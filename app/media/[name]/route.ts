import { NextResponse, type NextRequest } from "next/server";
import { hasDatabase, readMedia } from "@/lib/db";

export const runtime = "nodejs";

/** Photos uploaded in the admin, stored in the database. Each upload gets a new name, so they can be cached for good. */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!hasDatabase() || !/^[a-z0-9-]+\.jpg$/.test(name)) return new NextResponse("Not found", { status: 404 });
  const media = await readMedia(name);
  if (!media) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(new Uint8Array(media.bytes), {
    headers: { "Content-Type": media.contentType, "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
