import { promises as fs } from "node:fs";
import path from "node:path";
import { revalidatePath, revalidateTag } from "next/cache";
import { CONTENT_TAG, contentDefaults, isContentId } from "@/lib/content";
import { type DbChange, hasDatabase, readContentRow, readMedia, writeDb } from "@/lib/db";

/**
 * Where admin edits are saved.
 *
 * - With DATABASE_URL set (the Neon database), edits go to the database and
 *   show on the site as soon as they are saved, on Vercel and locally alike.
 *   Uploaded photos are stored there too and served from /media/….
 * - Otherwise, on Vercel the file system is read-only, so edits are committed to the
 *   GitHub repo (GITHUB_TOKEN + GITHUB_REPO, optional GITHUB_BRANCH) and Vercel
 *   redeploys the site, usually within one or two minutes.
 * - Anywhere else (e.g. `npm run dev` on your computer) edits are written
 *   straight to the files, and the dev server shows them at once.
 */

export type FileChange = { path: string; content: Buffer | string | null };

export type StorageInfo =
  | { mode: "database"; ready: true }
  | { mode: "github"; ready: true; repo: string; branch: string }
  | { mode: "local"; ready: boolean; problem?: string };

/** Only these files can be written from the admin. */
const WRITABLE = [
  /^content\/[a-z-]+\.json$/,
  /^public\/photos\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/,
  /^public\/media\/[a-z0-9-]+\.jpg$/,
];

function assertWritable(file: string) {
  if (!WRITABLE.some((re) => re.test(file))) throw new Error(`The admin cannot write to ${file}`);
}

export function storageInfo(): StorageInfo {
  const { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH, VERCEL } = process.env;
  if (hasDatabase()) return { mode: "database", ready: true };
  if (GITHUB_TOKEN && GITHUB_REPO) return { mode: "github", ready: true, repo: GITHUB_REPO, branch: GITHUB_BRANCH || "main" };
  if (VERCEL) {
    return {
      mode: "local",
      ready: false,
      problem:
        "Saving is switched off on the live site until DATABASE_URL is set in Vercel. You can still look around.",
    };
  }
  return { mode: "local", ready: true };
}

// ---------- Local files ----------

const root = process.cwd();

async function readLocal(file: string) {
  return fs.readFile(path.join(root, file));
}

async function writeLocal(changes: FileChange[]) {
  for (const change of changes) {
    const target = path.join(root, change.path);
    if (change.content === null) {
      await fs.rm(target, { force: true });
      continue;
    }
    await fs.mkdir(path.dirname(target), { recursive: true });
    // Write then rename, so a half-written file is never read by the site.
    const temp = `${target}.${process.pid}.tmp`;
    await fs.writeFile(temp, change.content);
    await fs.rename(temp, target);
  }
}

// ---------- GitHub ----------

async function github<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
  const { GITHUB_TOKEN, GITHUB_REPO } = process.env;
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}${endpoint}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    const error = new Error(`GitHub ${res.status}: ${detail.slice(0, 300)}`) as Error & { status?: number };
    error.status = res.status;
    throw error;
  }
  return (res.headers.get("content-type")?.includes("json") ? res.json() : res.arrayBuffer()) as Promise<T>;
}

const encodePath = (file: string) => file.split("/").map(encodeURIComponent).join("/");

async function readGithub(file: string, branch: string) {
  const data = await github<ArrayBuffer>(`/contents/${encodePath(file)}?ref=${encodeURIComponent(branch)}`, {
    headers: { Accept: "application/vnd.github.raw" },
  });
  return Buffer.from(data);
}

/** Commits all changes in one go, so the site never sees half an edit. */
async function commitGithub(changes: FileChange[], message: string, branch: string) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const ref = await github<{ object: { sha: string } }>(`/git/ref/heads/${encodeURIComponent(branch)}`);
    const parent = await github<{ tree: { sha: string } }>(`/git/commits/${ref.object.sha}`);
    const tree = await Promise.all(
      changes.map(async (change) => {
        if (change.content === null) return { path: change.path, mode: "100644", type: "blob", sha: null };
        const content = Buffer.isBuffer(change.content) ? change.content : Buffer.from(change.content, "utf8");
        const blob = await github<{ sha: string }>("/git/blobs", {
          method: "POST",
          body: JSON.stringify({ content: content.toString("base64"), encoding: "base64" }),
        });
        return { path: change.path, mode: "100644", type: "blob", sha: blob.sha };
      }),
    );
    const newTree = await github<{ sha: string }>("/git/trees", {
      method: "POST",
      body: JSON.stringify({ base_tree: parent.tree.sha, tree }),
    });
    const commit = await github<{ sha: string }>("/git/commits", {
      method: "POST",
      body: JSON.stringify({ message, tree: newTree.sha, parents: [ref.object.sha] }),
    });
    try {
      await github(`/git/refs/heads/${encodeURIComponent(branch)}`, {
        method: "PATCH",
        body: JSON.stringify({ sha: commit.sha }),
      });
      return;
    } catch (error) {
      // Someone else committed in between; rebuild on top of their commit.
      if ((error as { status?: number }).status !== 422 || attempt === 2) throw error;
    }
  }
}

// ---------- Database ----------

const contentId = (file: string) => file.match(/^content\/([a-z-]+)\.json$/)?.[1];
const mediaName = (file: string) => file.match(/^public\/media\/([a-z0-9-]+\.jpg)$/)?.[1];

async function readDatabase(file: string): Promise<Buffer> {
  const id = contentId(file);
  if (id && isContentId(id)) return Buffer.from(JSON.stringify((await readContentRow(id)) ?? contentDefaults[id]), "utf8");
  const name = mediaName(file);
  if (name) {
    const media = await readMedia(name);
    if (!media) throw new Error(`${file} not found`);
    return media.bytes;
  }
  // The photos that came with the site are files in /public.
  return readLocal(file);
}

function toDbChanges(changes: FileChange[]): DbChange[] {
  return changes.flatMap((c): DbChange[] => {
    const id = contentId(c.path);
    if (id) {
      if (!isContentId(id) || c.content === null) throw new Error(`The admin cannot change ${c.path}`);
      return [{ kind: "content", id, data: JSON.parse(c.content.toString()) }];
    }
    const name = mediaName(c.path);
    if (name) {
      if (c.content === null) return [{ kind: "media-delete", name }];
      return [{ kind: "media", name, bytes: Buffer.from(c.content), contentType: "image/jpeg" }];
    }
    // Photos that came with the site are part of the deployment and stay there; they are just no longer listed.
    if (c.content === null) return [];
    throw new Error(`With the database, new photos are stored under /media, not ${c.path}`);
  });
}

// ---------- Public API ----------

export async function readFile(file: string): Promise<Buffer> {
  const info = storageInfo();
  if (info.mode === "database") return readDatabase(file);
  return info.mode === "github" ? readGithub(file, info.branch) : readLocal(file);
}

export async function readJson<T = unknown>(file: string): Promise<T> {
  return JSON.parse((await readFile(file)).toString("utf8")) as T;
}

export async function writeFiles(changes: FileChange[], message: string) {
  const info = storageInfo();
  if (!info.ready) throw new Error(info.problem);
  changes.forEach((c) => assertWritable(c.path));
  if (info.mode === "database") await writeDb(toDbChanges(changes));
  else if (info.mode === "github") await commitGithub(changes, message, info.branch);
  else await writeLocal(changes);
  // Every page reads the content through one cache; clear it so the change shows on the next visit.
  revalidateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
}

/** Where a newly uploaded photo is served from. */
export const photoFolder = () => (storageInfo().mode === "database" ? "/media" : "/photos");

export const toJsonFile = (data: unknown) => JSON.stringify(data, null, 2) + "\n";
