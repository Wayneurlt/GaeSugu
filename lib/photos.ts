export type PhotoInfo = {
  id: string;
  /** Where the image is served from: /photos/… (files in /public) or /media/… (uploads stored in the database). */
  file: string;
  alt: string;
  /** CSS object-position used when the photo is cropped to fit a frame. */
  focus: string;
  width: number;
  height: number;
  /** Tiny base64 preview shown while the photo loads. */
  blur?: string;
};

/** A photo's id in the photo library. Missing ids render as an empty frame. */
export type PhotoId = string;

/** Looks photos up by id in the library (managed at /admin/photos). */
export function photoLookup(list: PhotoInfo[]) {
  const byId = new Map(list.map((p) => [p.id, p]));
  return (id: PhotoId | undefined): PhotoInfo | undefined => (id ? byId.get(id) : undefined);
}
