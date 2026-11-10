"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons";

type Version = { id: string; savedAt: string; label: string | null; current: boolean };

const TZ = "Africa/Nairobi";
const dayFmt = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: TZ });
const timeFmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: TZ });

/**
 * Every saved version of one section. In an editor, "Load" puts a version into
 * the form to review before saving; in the photo library, "Restore" brings it
 * back straight away.
 */
export default function HistoryPanel({
  doc,
  title,
  onClose,
  onLoad,
  onRestored,
}: {
  doc: string;
  title: string;
  onClose: () => void;
  onLoad?: (data: unknown, when: string) => void;
  onRestored?: () => void;
}) {
  const [versions, setVersions] = useState<Version[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    fetch(`/api/admin/history?doc=${encodeURIComponent(doc)}`)
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!live) return;
        if (!res.ok) setError(data.error || "Could not load the history.");
        else setVersions(data.versions);
      })
      .catch(() => live && setError("Could not reach the server. Check your connection and try again."));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      live = false;
      document.removeEventListener("keydown", onKey);
    };
  }, [doc, onClose]);

  const when = (v: Version) => `${dayFmt.format(new Date(v.savedAt))}, ${timeFmt.format(new Date(v.savedAt))}`;

  async function choose(v: Version) {
    setBusy(v.id);
    setError("");
    try {
      if (onLoad) {
        const res = await fetch(`/api/admin/history?doc=${encodeURIComponent(doc)}&id=${v.id}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Could not load that version.");
        onLoad(data.data, when(v));
        onClose();
      } else {
        if (!window.confirm(`Bring back the ${title.toLowerCase()} as it was on ${when(v)}? This is saved straight away; you can undo it from this list.`)) return;
        const res = await fetch("/api/admin/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ doc, id: v.id }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error([data.error, ...(data.errors ?? [])].filter(Boolean).join("\n") || "Could not restore that version.");
        onRestored?.();
        onClose();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="a-drawer-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="a-drawer" role="dialog" aria-modal="true" aria-labelledby="history-title">
        <div className="a-drawer-head">
          <div>
            <h2 id="history-title">Version history</h2>
            <p className="a-muted a-small">{title}: every save is kept, so you can always go back.</p>
          </div>
          <button type="button" className="a-icon-btn" aria-label="Close" onClick={onClose} autoFocus>
            <Icon name="close" />
          </button>
        </div>

        {error && (
          <div className="a-notice error" role="alert" style={{ whiteSpace: "pre-line" }}>
            {error}
          </div>
        )}
        {!versions && !error && <p className="a-muted">Loading…</p>}
        {versions && versions.length === 0 && (
          <p className="a-muted">Nothing saved yet. Each time you save, a version is added here, starting with the original.</p>
        )}

        {versions && versions.length > 0 && (
          <ol className="a-versions">
            {versions.map((v) => (
              <li key={v.id}>
                <span className="a-version-dot" aria-hidden="true" />
                <span className="a-version-text">
                  <strong>{when(v)}</strong>
                  <span className="a-version-tags">
                    {v.current && <span className="a-tag ok">Live now</span>}
                    {v.label === "Original" && <span className="a-tag">Original</span>}
                  </span>
                </span>
                {!v.current && (
                  <button type="button" className="a-btn small" disabled={busy !== null} onClick={() => choose(v)}>
                    {busy === v.id ? "…" : onLoad ? "Load" : "Restore"}
                  </button>
                )}
              </li>
            ))}
          </ol>
        )}
        {onLoad && versions && versions.length > 1 && (
          <p className="a-muted a-small">“Load” puts that version into the editor. Nothing changes on the site until you press Save.</p>
        )}
      </aside>
    </div>
  );
}
