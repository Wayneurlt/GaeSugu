import { NextResponse, type NextRequest } from "next/server";
import { PHOTOS_FILE } from "@/lib/admin/docs";
import { failure, guard } from "@/lib/admin/guard";
import { isFocus, loadLibrary, newPhotoFile, newPhotoId, photoUsage, processPhoto } from "@/lib/admin/photos";
import { photoFolder, storageInfo, toJsonFile, writeFiles } from "@/lib/admin/storage";
import type { PhotoInfo } from "@/lib/photos";

export const runtime = "nodejs";

const MAX_UPLOAD = 4.4 * 1024 * 1024; // Vercel accepts request bodies up to 4.5 MB
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

const toPublic = (file: string) => `public${file}`;

/** "/photos/egret-on-boat-bow-mhq3k2ab.jpg" → "egret-on-boat-bow" (drops the suffix added on upload). */
const photoBaseName = (file: string) =>
  file
    .replace(/^\/(photos|media)\//, "")
    .replace(/\.[a-z]+$/, "")
    .replace(/-(?=[a-z0-9]{8}$)(?=.*\d)[a-z0-9]{8}$/, "");

/** Upload a new photo, or replace the file behind an existing one (form fields: file, alt, replaceId). */
export async function POST(request: NextRequest) {
  const denied = await guard(request);
  if (denied) return denied;
  try {
    const form = await request.formData();
    const file = form.get("file");
    const alt = String(form.get("alt") ?? "").trim().slice(0, 300);
    const replaceId = String(form.get("replaceId") ?? "");
    if (!(file instanceof File)) return NextResponse.json({ error: "Choose a photo to upload." }, { status: 400 });
    if (file.size > MAX_UPLOAD) return NextResponse.json({ error: "That photo is too large. Keep it under 4 MB." }, { status: 413 });
    if (!TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Use a JPG, PNG, WebP or AVIF photo. (iPhone HEIC photos: export as JPG first.)" }, { status: 415 });
    }

    const library = await loadLibrary();
    const processed = await processPhoto(Buffer.from(await file.arrayBuffer())).catch(() => null);
    if (!processed) return NextResponse.json({ error: "That file could not be read as a photo." }, { status: 422 });

    const existing = replaceId ? library.photos.find((p) => p.id === replaceId) : undefined;
    if (replaceId && !existing) return NextResponse.json({ error: "That photo no longer exists." }, { status: 404 });

    const photo: PhotoInfo = {
      id: existing?.id ?? newPhotoId(alt || file.name, new Set(library.photos.map((p) => p.id))),
      // A replaced photo keeps its readable name with a fresh suffix; a new one is named after its description.
      file: newPhotoFile(existing ? photoBaseName(existing.file) : alt || file.name, photoFolder()),
      alt: existing ? alt || existing.alt : alt || "",
      focus: existing?.focus ?? "50% 50%",
      width: processed.width,
      height: processed.height,
      blur: processed.blur,
    };
    const photos = existing ? library.photos.map((p) => (p.id === existing.id ? photo : p)) : [photo, ...library.photos];

    await writeFiles(
      [
        { path: toPublic(photo.file), content: processed.data },
        { path: PHOTOS_FILE, content: toJsonFile({ ...library, photos }) },
        ...(existing && existing.file !== photo.file ? [{ path: toPublic(existing.file), content: null }] : []),
      ],
      existing ? `Admin: replace photo ${photo.id}` : `Admin: add photo ${photo.id}`,
    );
    return NextResponse.json({ ok: true, photo, mode: storageInfo().mode });
  } catch (error) {
    return failure(error);
  }
}

/** Update a photo's description (alt text) or focus point. */
export async function PATCH(request: NextRequest) {
  const denied = await guard(request);
  if (denied) return denied;
  try {
    const body = (await request.json().catch(() => ({}))) as { id?: string; alt?: unknown; focus?: unknown };
    const library = await loadLibrary();
    const photo = library.photos.find((p) => p.id === body.id);
    if (!photo) return NextResponse.json({ error: "That photo no longer exists." }, { status: 404 });
    if (typeof body.alt !== "string" || !body.alt.trim()) {
      return NextResponse.json({ error: "Describe the photo in a few words, for people using screen readers." }, { status: 400 });
    }
    const updated = { ...photo, alt: body.alt.trim().slice(0, 300), focus: isFocus(body.focus) ? body.focus : photo.focus };
    const photos = library.photos.map((p) => (p.id === photo.id ? updated : p));
    await writeFiles([{ path: PHOTOS_FILE, content: toJsonFile({ ...library, photos }) }], `Admin: edit photo ${photo.id}`);
    return NextResponse.json({ ok: true, photo: updated, mode: storageInfo().mode });
  } catch (error) {
    return failure(error);
  }
}

/** Delete a photo, but only once nothing on the site uses it. */
export async function DELETE(request: NextRequest) {
  const denied = await guard(request);
  if (denied) return denied;
  try {
    const id = request.nextUrl.searchParams.get("id") ?? "";
    const library = await loadLibrary();
    const photo = library.photos.find((p) => p.id === id);
    if (!photo) return NextResponse.json({ error: "That photo no longer exists." }, { status: 404 });
    const uses = (await photoUsage([id]))[id];
    if (uses.length) {
      return NextResponse.json({ error: "This photo is still used on the site. Swap it out of these places first.", uses }, { status: 409 });
    }
    await writeFiles(
      [
        { path: PHOTOS_FILE, content: toJsonFile({ ...library, photos: library.photos.filter((p) => p.id !== id) }) },
        { path: toPublic(photo.file), content: null },
      ],
      `Admin: delete photo ${id}`,
    );
    return NextResponse.json({ ok: true, mode: storageInfo().mode });
  } catch (error) {
    return failure(error);
  }
}
