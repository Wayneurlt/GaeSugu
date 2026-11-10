"use client";

import { useCallback, useRef, useState } from "react";
import HistoryPanel from "./HistoryPanel";
import { Icon } from "./icons";
import { thumb, uploadPhoto, Uploader, type LitePhoto } from "./photo-tools";

const FOCUS = [
  { value: "50% 50%", label: "Centre" },
  { value: "50% 20%", label: "Top" },
  { value: "50% 80%", label: "Bottom" },
  { value: "20% 50%", label: "Left" },
  { value: "80% 50%", label: "Right" },
];

type Props = { photos: LitePhoto[]; usage: Record<string, string[]>; mode: "database" | "local" | "github"; canSave: boolean };

export default function PhotoLibrary({ photos: initial, usage, mode, canSave }: Props) {
  const [photos, setPhotos] = useState(initial);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [history, setHistory] = useState(false);
  const closeHistory = useCallback(() => setHistory(false), []);
  const shown = photos.filter((p) => `${p.alt} ${p.id}`.toLowerCase().includes(query.toLowerCase()));

  const done = (text: string) => {
    setToast({ kind: "ok", text: mode === "github" ? `${text} The live site updates in about 1–2 minutes.` : text });
    setTimeout(() => setToast(null), 6000);
  };
  const fail = (text: string) => setToast({ kind: "error", text });
  const replaceInList = (photo: LitePhoto) => setPhotos((list) => list.map((p) => (p.id === photo.id ? photo : p)));

  return (
    <>
      <div className="a-head">
        <div className="a-head-text">
          <h1>Photo library</h1>
          <p className="a-muted">
            Every photo on the site. Choose where a photo appears from each page’s editor; here you add, replace and describe
            them.
          </p>
        </div>
        <div className="a-head-actions">
          <button
            type="button"
            className="a-btn"
            onClick={() => setHistory(true)}
            disabled={mode !== "database"}
            title={mode === "database" ? "See and bring back earlier versions of the library" : "Version history needs the database (DATABASE_URL)"}
          >
            <Icon name="history" size={16} /> History
          </button>
        </div>
      </div>

      {history && (
        <HistoryPanel
          doc="photos"
          title="Photo library"
          onClose={closeHistory}
          // The list on this page comes from the server, so reload it to show the restored library.
          onRestored={() => window.location.reload()}
        />
      )}

      {canSave && (
        <Uploader
          onUploaded={(photo) => {
            setPhotos((list) => [photo, ...list]);
            done("Photo uploaded. Pick it from any photo field to use it.");
          }}
        />
      )}

      <input type="search" placeholder={`Search ${photos.length} photos…`} value={query} onChange={(e) => setQuery(e.target.value)} />

      <div className="a-library">
        {shown.map((p) => (
          <PhotoCard
            key={p.id}
            photo={p}
            uses={usage[p.id] ?? []}
            canSave={canSave}
            onChanged={(photo, text) => {
              replaceInList(photo);
              done(text);
            }}
            onDeleted={() => {
              setPhotos((list) => list.filter((x) => x.id !== p.id));
              done("Photo deleted.");
            }}
            onError={fail}
          />
        ))}
      </div>
      {shown.length === 0 && <p className="a-muted">No photos match “{query}”.</p>}

      {toast && (
        <div className={`a-notice ${toast.kind} a-toast`} role={toast.kind === "error" ? "alert" : "status"} onClick={() => setToast(null)}>
          {toast.text}
        </div>
      )}
    </>
  );
}

function PhotoCard({
  photo,
  uses,
  canSave,
  onChanged,
  onDeleted,
  onError,
}: {
  photo: LitePhoto;
  uses: string[];
  canSave: boolean;
  onChanged: (photo: LitePhoto, message: string) => void;
  onDeleted: () => void;
  onError: (message: string) => void;
}) {
  const [alt, setAlt] = useState(photo.alt);
  const [focus, setFocus] = useState(photo.focus);
  const [busy, setBusy] = useState<"" | "save" | "replace" | "delete">("");
  const [version, setVersion] = useState(0);
  const fileInput = useRef<HTMLInputElement>(null);
  const changed = alt !== photo.alt || focus !== photo.focus;

  async function call(kind: "save" | "delete", init: RequestInit, url = "/api/admin/photos") {
    setBusy(kind);
    try {
      const res = await fetch(url, init);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error([data.error, ...(data.uses ?? []).map((u: string) => `• ${u}`)].filter(Boolean).join("\n"));
      return data;
    } catch (e) {
      onError(e instanceof Error ? e.message : "Something went wrong.");
      return null;
    } finally {
      setBusy("");
    }
  }

  async function save() {
    const data = await call("save", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: photo.id, alt, focus }),
    });
    if (data) onChanged(data.photo, "Photo details saved.");
  }

  async function replace(file: File | undefined) {
    if (!file) return;
    setBusy("replace");
    try {
      const updated = await uploadPhoto(file, alt, photo.id);
      setVersion((v) => v + 1);
      onChanged(updated, "Photo replaced everywhere it is used.");
    } catch (e) {
      onError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy("");
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function remove() {
    if (!window.confirm("Delete this photo from the library? This cannot be undone here.")) return;
    const data = await call("delete", { method: "DELETE" }, `/api/admin/photos?id=${encodeURIComponent(photo.id)}`);
    if (data) onDeleted();
  }

  return (
    <div className="a-photo-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${thumb(photo.file, 520)}&v=${version}`} alt="" loading="lazy" style={{ objectPosition: focus }} />
      <div className="a-photo-card-body">
        <span style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          <span className="a-tag">
            {photo.width}×{photo.height}
          </span>
          <span className="a-tag" title={uses.join("\n")}>
            {uses.length ? `Used in ${uses.length} place${uses.length === 1 ? "" : "s"}` : "Not used yet"}
          </span>
        </span>
        <label className="a-field">
          <span className="a-field-label">Description</span>
          <textarea rows={2} value={alt} onChange={(e) => setAlt(e.target.value)} disabled={!canSave} />
        </label>
        <label className="a-field">
          <span className="a-field-label">Keep in view when cropped</span>
          <select value={focus} onChange={(e) => setFocus(e.target.value)} disabled={!canSave}>
            {!FOCUS.some((f) => f.value === focus) && <option value={focus}>Custom ({focus})</option>}
            {FOCUS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        {uses.length > 0 && (
          <details className="a-small">
            <summary className="a-muted" style={{ cursor: "pointer" }}>
              Where it is used
            </summary>
            <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
              {uses.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </details>
        )}
        {canSave && (
          <div className="a-photo-card-actions">
            <button type="button" className="a-btn small primary" onClick={save} disabled={!changed || !!busy}>
              {busy === "save" ? "Saving…" : "Save"}
            </button>
            <input ref={fileInput} type="file" accept="image/*" hidden onChange={(e) => replace(e.target.files?.[0])} />
            <button type="button" className="a-btn small" onClick={() => fileInput.current?.click()} disabled={!!busy}>
              {busy === "replace" ? "Uploading…" : "Replace file"}
            </button>
            <button
              type="button"
              className="a-btn small danger"
              onClick={remove}
              disabled={!!busy || uses.length > 0}
              title={uses.length ? "Swap this photo out of every page first" : "Delete"}
            >
              {busy === "delete" ? "Deleting…" : "Delete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
