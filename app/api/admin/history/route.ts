import { NextResponse, type NextRequest } from "next/server";
import { PHOTOS_FILE, docFile, getDoc } from "@/lib/admin/docs";
import { failure, guard } from "@/lib/admin/guard";
import { readJson, storageInfo, toJsonFile, writeFiles } from "@/lib/admin/storage";
import { validateDoc } from "@/lib/admin/validate";
import { listVersions, readVersion } from "@/lib/db";

/** The content files that keep a history: every editor section, plus the photo library. */
function fileFor(doc: string | null) {
  if (doc === "photos") return { id: "photos", title: "Photo library", file: PHOTOS_FILE };
  const d = doc ? getDoc(doc) : undefined;
  return d ? { id: d.id, title: d.title, file: docFile(d.id) } : undefined;
}

const unavailable = () =>
  NextResponse.json(
    { error: "Version history needs the database. Set DATABASE_URL to keep a history of every save." },
    { status: 409 },
  );

/** ?doc=home lists saved versions; ?doc=home&id=12 returns one version's content. */
export async function GET(request: NextRequest) {
  const denied = await guard(request);
  if (denied) return denied;
  const target = fileFor(request.nextUrl.searchParams.get("doc"));
  if (!target) return NextResponse.json({ error: "Unknown section." }, { status: 404 });
  if (storageInfo().mode !== "database") return unavailable();
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ versions: await listVersions(target.id) });
    const data = await readVersion(target.id, id);
    if (data === undefined) return NextResponse.json({ error: "That version no longer exists." }, { status: 404 });
    return NextResponse.json({ data });
  } catch (error) {
    return failure(error);
  }
}

/** Restores a saved version straight away (used by the photo library, which has no editor to review it in). */
export async function POST(request: NextRequest) {
  const denied = await guard(request);
  if (denied) return denied;
  const body = (await request.json().catch(() => null)) as { doc?: string; id?: string } | null;
  const target = fileFor(body?.doc ?? null);
  if (!target || !body?.id) return NextResponse.json({ error: "Nothing to restore." }, { status: 400 });
  if (storageInfo().mode !== "database") return unavailable();
  try {
    const data = await readVersion(target.id, body.id);
    if (data === undefined) return NextResponse.json({ error: "That version no longer exists." }, { status: 404 });
    const errors = validateDoc(data, await readJson(target.file));
    if (errors.length) {
      return NextResponse.json({ error: "That version no longer fits the site's current layout, so it cannot be restored.", errors }, { status: 422 });
    }
    await writeFiles([{ path: target.file, content: toJsonFile(data) }], `Admin: restore ${target.title}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
