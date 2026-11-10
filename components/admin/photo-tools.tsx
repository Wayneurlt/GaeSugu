"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type LitePhoto = { id: string; file: string; alt: string; focus: string; width: number; height: number };

export const thumb = (file: string, width = 320) => `/api/admin/media?file=${encodeURIComponent(file)}&w=${width}`;

/** Shrinks big photos in the browser first, so uploads are quick and fit Vercel's 4.5 MB limit. */
async function shrink(file: File): Promise<Blob> {
  if (file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.88));
    return blob ?? file;
  } catch {
    return file; // the server explains if it cannot read it either
  }
}

export async function uploadPhoto(file: File, alt: string, replaceId?: string) {
  const form = new FormData();
  const blob = await shrink(file);
  form.set("file", blob instanceof File ? blob : new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: blob.type }));
  form.set("alt", alt);
  if (replaceId) form.set("replaceId", replaceId);
  const res = await fetch("/api/admin/photos", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Upload failed.");
  return data.photo as LitePhoto;
}

/** Choose a file, describe it, upload it. */
export function Uploader({ onUploaded, label = "Upload a new photo" }: { onUploaded: (photo: LitePhoto) => void; label?: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  useEffect(() => () => (preview ? URL.revokeObjectURL(preview) : undefined), [preview]);

  const choose = (f: File | undefined) => {
    if (!f) return;
    setFile(f);
    setError("");
    if (!alt) setAlt(f.name.replace(/\.\w+$/, "").replace(/[-_]+/g, " "));
  };

  async function send() {
    if (!file) return;
    if (!alt.trim()) {
      setError("Describe the photo in a few words first.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const photo = await uploadPhoto(file, alt.trim());
      onUploaded(photo);
      setFile(null);
      setAlt("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={`a-upload${drag ? " drag" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        choose(e.dataTransfer.files[0]);
      }}
    >
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => choose(e.target.files?.[0])} />
      {file ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="" className="a-thumb" />
          <label className="a-field" style={{ flex: "1 1 260px" }}>
            <span className="a-field-label">Describe the photo</span>
            <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="e.g. Elders gathered under an acacia tree" />
            <span className="a-hint">Read aloud to people who cannot see it, and used to name the file.</span>
          </label>
          <div style={{ display: "flex", gap: 6 }}>
            <button type="button" className="a-btn primary" onClick={send} disabled={busy}>
              {busy ? "Uploading…" : "Upload"}
            </button>
            <button type="button" className="a-btn" onClick={() => setFile(null)} disabled={busy}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <button type="button" className="a-btn primary" onClick={() => input.current?.click()}>
            {label}
          </button>
          <span className="a-muted">or drop a photo here. Large photos are resized and location data is removed.</span>
        </>
      )}
      {error && (
        <div className="a-notice error" style={{ width: "100%" }} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

/** Modal for choosing a photo from the library (or uploading one). */
export function PhotoPicker({
  photos,
  current,
  onPick,
  onClose,
  onUploaded,
}: {
  photos: LitePhoto[];
  current?: string;
  onPick: (id: string) => void;
  onClose: () => void;
  onUploaded: (photo: LitePhoto) => void;
}) {
  const [query, setQuery] = useState("");
  const shown = photos.filter((p) => `${p.alt} ${p.id}`.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="a-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="a-modal" role="dialog" aria-modal="true" aria-label="Choose a photo">
        <div className="a-modal-head">
          <h2 style={{ flex: 1 }}>Choose a photo</h2>
          <button type="button" className="a-btn" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="a-modal-body">
          <Uploader
            onUploaded={(photo) => {
              onUploaded(photo);
              onPick(photo.id);
            }}
          />
          <input type="search" placeholder="Search photos by description…" value={query} onChange={(e) => setQuery(e.target.value)} autoFocus />
          <div className="a-grid">
            {shown.map((p) => (
              <button key={p.id} type="button" className="a-pick" aria-pressed={p.id === current} onClick={() => onPick(p.id)} title={p.alt}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb(p.file, 300)} alt="" loading="lazy" />
                <span>{p.alt || p.id}</span>
              </button>
            ))}
          </div>
          {shown.length === 0 && <p className="a-muted">No photos match “{query}”.</p>}
        </div>
      </div>
    </div>
  );
}
