import { NextResponse, type NextRequest } from "next/server";
import { docFile, getDoc } from "@/lib/admin/docs";
import { failure, guard } from "@/lib/admin/guard";
import { readJson, storageInfo, toJsonFile, writeFiles } from "@/lib/admin/storage";
import { validateDoc } from "@/lib/admin/validate";

/** Saves one content file, after checking it has the same shape as before. */
export async function POST(request: NextRequest) {
  const denied = await guard(request);
  if (denied) return denied;

  const body = (await request.json().catch(() => null)) as { doc?: string; data?: unknown } | null;
  const doc = body?.doc ? getDoc(body.doc) : undefined;
  if (!doc || body?.data === undefined) return NextResponse.json({ error: "Nothing to save." }, { status: 400 });
  if (JSON.stringify(body.data).length > 1_000_000) return NextResponse.json({ error: "This is too much text to save at once." }, { status: 413 });

  try {
    const file = docFile(doc.id);
    const errors = validateDoc(body.data, await readJson(file));
    if (errors.length) return NextResponse.json({ error: "Some fields need fixing before saving.", errors }, { status: 422 });
    await writeFiles([{ path: file, content: toJsonFile(body.data) }], `Admin: update ${doc.title}`);
    return NextResponse.json({ ok: true, mode: storageInfo().mode });
  } catch (error) {
    return failure(error);
  }
}
