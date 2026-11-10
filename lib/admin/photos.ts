import sharp from "sharp";
import type { PhotoInfo } from "@/lib/photos";
import { docFile, docs, PHOTOS_FILE } from "./docs";
import { readJson } from "./storage";
import { findPhotoUses } from "./validate";

export type Library = { photos: PhotoInfo[] };

export const loadLibrary = () => readJson<Library>(PHOTOS_FILE);

/** For each photo id, the places on the site that use it. */
export async function photoUsage(ids: string[]) {
  const contents = await Promise.all(docs.map(async (d) => ({ title: d.title, data: await readJson(docFile(d.id)) })));
  return Object.fromEntries(ids.map((id) => [id, contents.flatMap((c) => findPhotoUses(c.title, c.data, id))]));
}

const words = (text: string) =>
  text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .slice(0, 5);

/** A short readable id like "eldersAtTheMarket", unique in the library. */
export function newPhotoId(source: string, taken: Set<string>) {
  const w = words(source);
  const base = (w.length ? w : ["photo"]).map((x, i) => (i ? x[0].toUpperCase() + x.slice(1) : x)).join("");
  const safe = /^[a-z]/.test(base) ? base : `photo${base}`;
  let id = safe;
  for (let n = 2; taken.has(id); n++) id = `${safe}${n}`;
  return id;
}

/** A file name like "elders-at-the-market-lq3k2.jpg"; the suffix keeps replaced photos from being cached. */
export function newPhotoFile(source: string, folder: string) {
  const slug = words(source).join("-") || "photo";
  return `${folder}/${slug}-${Date.now().toString(36)}.jpg`;
}

/** Turns, resizes and compresses an upload; strips location and camera data. */
export async function processPhoto(input: Buffer) {
  const { data, info } = await sharp(input, { failOn: "error" })
    .rotate()
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true, progressive: true })
    .toBuffer({ resolveWithObject: true });
  const blur = await sharp(data).resize(12).jpeg({ quality: 50 }).toBuffer();
  return { data, width: info.width, height: info.height, blur: `data:image/jpeg;base64,${blur.toString("base64")}` };
}

export const FOCUS_OPTIONS = ["50% 50%", "50% 20%", "50% 80%", "20% 50%", "80% 50%"];
export const isFocus = (value: unknown): value is string => typeof value === "string" && /^\d{1,3}% \d{1,3}%$/.test(value);
