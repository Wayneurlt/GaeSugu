import { neon } from "@neondatabase/serverless";

/**
 * The Neon Postgres database (DATABASE_URL). When it is set, every admin edit
 * is stored here:
 * - `site_content`: the page text, one row per content file, once that file has been edited
 * - `site_content_history`: every saved version of each file, so any edit can be undone
 * - `site_media`: uploaded photos
 * - `admin_login_attempts`: failed sign-ins, so password guessing is slowed on every server
 * Files in /content are the starting point for anything not yet edited.
 */

export const hasDatabase = () => Boolean(process.env.DATABASE_URL);

/** How many saved versions to keep for each content file. */
export const HISTORY_LIMIT = 60;

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
      data json not null,
      updated_at timestamptz not null default now()
    )`;
    await sql`create table if not exists site_content_history (
      id bigserial primary key,
      doc_id text not null,
      data json not null,
      label text,
      saved_at timestamptz not null default now()
    )`;
    // Content is stored as json, not jsonb: jsonb re-sorts the keys, which would jumble the order of fields in the editors.
    // Tables made before this change are converted (jsonb cannot recover the original order, but new saves keep it).
    const jsonb = (await sql`select table_name from information_schema.columns
      where table_schema = current_schema() and column_name = 'data' and data_type = 'jsonb'
        and table_name in ('site_content', 'site_content_history')`) as { table_name: string }[];
    for (const { table_name } of jsonb) {
      if (table_name === "site_content") await sql`alter table site_content alter column data type json using data::json`;
      else await sql`alter table site_content_history alter column data type json using data::json`;
    }
    await sql`create index if not exists site_content_history_doc on site_content_history (doc_id, id desc)`;
    await sql`create table if not exists site_media (
      name text primary key,
      bytes bytea not null,
      content_type text not null,
      created_at timestamptz not null default now()
    )`;
    await sql`create table if not exists admin_login_attempts (
      key text primary key,
      count integer not null,
      until timestamptz not null
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
  /** `original` is the file's starting content, kept as the first version the first time the file is saved. */
  | { kind: "content"; id: string; data: unknown; original?: unknown }
  | { kind: "media"; name: string; bytes: Buffer; contentType: string };

/** Applies all changes in one transaction, so the site never sees half an edit, and records each new version. */
export async function writeDb(changes: DbChange[]) {
  const sql = await db();
  await sql.transaction(
    changes.flatMap((c) => {
      if (c.kind === "media") {
        return [
          sql`insert into site_media (name, bytes, content_type) values (${c.name}, ${"\\x" + c.bytes.toString("hex")}::bytea, ${c.contentType})
              on conflict (name) do update set bytes = excluded.bytes, content_type = excluded.content_type`,
        ];
      }
      const data = JSON.stringify(c.data);
      return [
        // Before the very first save, keep the original so it can always be brought back.
        ...(c.original === undefined
          ? []
          : [
              sql`insert into site_content_history (doc_id, data, label, saved_at)
                  select ${c.id}, ${JSON.stringify(c.original)}::json, 'Original', now() - interval '1 second'
                  where not exists (select 1 from site_content where id = ${c.id})
                    and not exists (select 1 from site_content_history where doc_id = ${c.id})`,
            ]),
        sql`insert into site_content (id, data, updated_at) values (${c.id}, ${data}::json, now())
            on conflict (id) do update set data = excluded.data, updated_at = now()`,
        sql`insert into site_content_history (doc_id, data) values (${c.id}, ${data}::json)`,
        // Keep the newest versions, plus the original.
        sql`delete from site_content_history
            where doc_id = ${c.id} and label is distinct from 'Original'
              and id not in (select id from site_content_history where doc_id = ${c.id} order by id desc limit ${HISTORY_LIMIT})`,
      ];
    }),
  );
}

export type Version = { id: string; savedAt: string; label: string | null; current: boolean };

/** Saved versions of one content file, newest first. */
export async function listVersions(docId: string): Promise<Version[]> {
  const sql = await db();
  // Sort by the numeric id: sorting the text form would put "9" after "10".
  const rows = (await sql`select h.id::text as version_id, h.saved_at, h.label from site_content_history h where h.doc_id = ${docId} order by h.id desc`) as {
    version_id: string;
    saved_at: string | Date;
    label: string | null;
  }[];
  return rows.map((r, i) => ({ id: r.version_id, savedAt: new Date(r.saved_at).toISOString(), label: r.label, current: i === 0 }));
}

export async function readVersion(docId: string, id: string): Promise<unknown | undefined> {
  if (!/^\d{1,18}$/.test(id)) return undefined;
  const sql = await db();
  const rows = (await sql`select data from site_content_history where doc_id = ${docId} and id = ${id}::bigint`) as { data: unknown }[];
  return rows[0]?.data;
}

export async function readMedia(name: string) {
  const sql = await db();
  const rows = (await sql`select encode(bytes, 'base64') as b64, content_type from site_media where name = ${name}`) as {
    b64: string;
    content_type: string;
  }[];
  return rows[0] ? { bytes: Buffer.from(rows[0].b64, "base64"), contentType: rows[0].content_type } : undefined;
}

// ---------- Sign-in attempts ----------

/** Minutes left on a lock-out for this visitor, or 0. */
export async function loginLockMinutes(key: string, max: number): Promise<number> {
  const sql = await db();
  const rows = (await sql`select count, until from admin_login_attempts where key = ${key} and until > now()`) as {
    count: number;
    until: string | Date;
  }[];
  const row = rows[0];
  return row && row.count >= max ? Math.max(1, Math.ceil((new Date(row.until).getTime() - Date.now()) / 60000)) : 0;
}

/** Counts a failed sign-in; the count resets once the lock-out window has passed. */
export async function recordLoginFailure(key: string, minutes: number) {
  const sql = await db();
  await sql`insert into admin_login_attempts (key, count, until) values (${key}, 1, now() + make_interval(mins => ${minutes}))
            on conflict (key) do update set
              count = case when admin_login_attempts.until > now() then admin_login_attempts.count + 1 else 1 end,
              until = now() + make_interval(mins => ${minutes})`;
  // Tidy up old records now and then.
  if (Math.random() < 0.05) await sql`delete from admin_login_attempts where until < now() - interval '1 day'`;
}

export async function clearLoginFailures(key: string) {
  const sql = await db();
  await sql`delete from admin_login_attempts where key = ${key}`;
}
