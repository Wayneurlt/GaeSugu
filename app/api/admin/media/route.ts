import { NextResponse, type NextRequest } from "next/server";
import sharp from "sharp";
import { guard } from "@/lib/admin/guard";
import { readFile } from "@/lib/admin/storage";

export const runtime = "nodejs";

/**
 * Photo previews for the admin. Reads from the same place edits are saved to,
 * so a photo uploaded a moment ago shows before the live site has redeployed.
 */
export async function GET(request: NextRequest) {
  const denied = await guard(request);
  if (denied) return denied;

  const file = request.nextUrl.searchParams.get("file") ?? "";
  const width = Math.min(Math.max(Number(request.nextUrl.searchParams.get("w")) || 400, 80), 1600);
  if (!/^\/(photos|media)\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/.test(file)) return new NextResponse("Not found", { status: 404 });

  try {
    const image = await sharp(await readSource(file, request.nextUrl.origin))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 72 })
      .toBuffer();
    return new NextResponse(new Uint8Array(image), {
      headers: { "Content-Type": "image/webp", "Cache-Control": "private, max-age=3600" },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}

/** On Vercel the photos that came with the site are not inside the server function, so fetch those from the site itself. */
async function readSource(file: string, origin: string) {
  try {
    return await readFile(`public${file}`);
  } catch (error) {
    if (!file.startsWith("/photos/")) throw error;
    const res = await fetch(`${origin}${file}`, { cache: "no-store" });
    if (!res.ok) throw error;
    return Buffer.from(await res.arrayBuffer());
  }
}
