import { neon } from "@neondatabase/serverless";

/**
 * The Neon Postgres database (DATABASE_URL). When it is set, every admin edit
 * is stored here: the page text in `site_content` (one row per content file,
 * only once that file has been edited) and uploaded photos in `site_media`.
 * Files in /content are the starting point for anything not yet edited.
 */

export const hasDatabase = () => Boolean(process.env.DATABASE_URL);

let client: ReturnType<typeof neon> | undefined;
let ready: Promise<void> | undefined;

export async function db() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set.");
  client ??= neon(process.env.DATABASE_URL);
  const sql = client;
  // Create the tables the first time they are needed.
  ready ??= (async () => {
    await sql`create table if not exists site_content (
      id text primary key,
      data jsonb not null,
      updated_at timestamptz not null default now()
    )`;
    await sql`create table if not exists site_media (
      name text primary key,
      bytes bytea not null,
      content_type text not null,
      created_at timestamptz not null default now()
    )`;
  })().catch((error) => {
    ready = undefined;
    throw error;
  });
  await ready;
  return sql;
}

/** Edited content files, by id ("home", "articles", "photos"…). */
export async function readContentRows(): Promise<Record<string, unknown>> {
  const sql = await db();
  const rows = (await sql`select id, data from site_content`) as { id: string; data: unknown }[];
  return Object.fromEntries(rows.map((r) => [r.id, r.data]));
}

/** When each edited content file was last saved. */
export async function readContentDates(): Promise<Record<string, string>> {
  const sql = await db();
  const rows = (await sql`select id, updated_at from site_content`) as { id: string; updated_at: string | Date }[];
  return Object.fromEntries(rows.map((r) => [r.id, new Date(r.updated_at).toISOString()]));
}

export async function readContentRow(id: string): Promise<unknown | undefined> {
  const sql = await db();
  const rows = (await sql`select data from site_content where id = ${id}`) as { data: unknown }[];
  return rows[0]?.data;
}

export type DbChange =
  | { kind: "content"; id: string; data: unknown }
  | { kind: "media"; name: string; bytes: Buffer; contentType: string }
  | { kind: "media-delete"; name: string };

/** Applies all changes in one transaction, so the site never sees half an edit. */
export async function writeDb(changes: DbChange[]) {
  const sql = await db();
  await sql.transaction(
    changes.map((c) =>
      c.kind === "content"
        ? sql`insert into site_content (id, data, updated_at) values (${c.id}, ${JSON.stringify(c.data)}::jsonb, now())
              on conflict (id) do update set data = excluded.data, updated_at = now()`
        : c.kind === "media"
          ? sql`insert into site_media (name, bytes, content_type) values (${c.name}, ${"\\x" + c.bytes.toString("hex")}::bytea, ${c.contentType})
                on conflict (name) do update set bytes = excluded.bytes, content_type = excluded.content_type`
          : sql`delete from site_media where name = ${c.name}`,
    ),
  );
}

export async function readMedia(name: string) {
  const sql = await db();
  const rows = (await sql`select encode(bytes, 'base64') as b64, content_type from site_media where name = ${name}`) as {
    b64: string;
    content_type: string;
  }[];
  return rows[0] ? { bytes: Buffer.from(rows[0].b64, "base64"), contentType: rows[0].content_type } : undefined;
}
