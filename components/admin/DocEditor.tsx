"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isPhotoKey } from "@/lib/admin/validate";
import { PhotoPicker, thumb, type LitePhoto } from "./photo-tools";

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
type Obj = { [key: string]: Json };
type Path = (string | number)[];

export type CategoryOption = { slug: string; label: string; topics: { slug: string; label: string }[] };

type Props = {
  doc: { id: string; title: string; description: string; view: string };
  initial: Obj;
  photos: LitePhoto[];
  categories: CategoryOption[];
  mode: "database" | "local" | "github";
  canSave: boolean;
};

// ---------- Labels and hints ----------

const LABELS: Record<string, string> = {
  href: "Link",
  linkHref: "Link",
  viewAllHref: "“View all” link",
  bg: "Background colour",
  color: "Colour",
  colors: "Placeholder colours",
  kicker: "Small label",
  hand: "Handwritten line",
  cta: "Button text",
  buttonText: "Button text",
  meta: "Place and time",
  excerpt: "Summary",
  body: "Article text",
  note: "Small print",
  photo: "Photo",
  photos: "Photos",
  pastWeeks: "Past weeks’ photos",
  backgroundPhoto: "Background photo",
  minutes: "Reading time (minutes)",
  missionVision: "Mission & vision",
  whyNature: "Why nature: points",
  whyNatureIntro: "Why nature: heading and text",
  journeyIntro: "The journey: heading and text",
  journey: "The journey: stops",
  latest: "“Latest” thumbnails",
  photoOfTheWeek: "Photo of the week",
  galleryStrip: "Photo strip",
  newsletterBlock: "Newsletter box (inner pages)",
  supportBlock: "Support box (inner pages)",
  buyMeACoffee: "Buy Me a Coffee link",
  tiktok: "TikTok link",
  youtube: "YouTube link",
  instagram: "Instagram link",
  donate: "Donation link",
  siteTitle: "Site name",
  siteDescription: "Site description (for search engines)",
  titleFirstLine: "Title, first line",
  titleItalicWord: "Title, word in italics",
  titleRest: "Title, rest",
  welcomeBold: "Welcome (bold part)",
  otherNames: "Scientific and local names",
  whoList: "Who we sit with",
  whoKicker: "“Who we sit with” label",
  whoText: "“Who we sit with” text",
};

const HINTS: Record<string, string> = {
  href: "A page on this site, like /about or /articles/clan-totems, or a full web address starting with https://",
  slug: "Used in the page address. Lowercase letters, numbers and dashes only. Changing it changes the link.",
  bg: "Shown behind the photo while it loads.",
  color: "Shown behind the photo while it loads, or instead of it when there is no photo.",
  body: "Leave a blank line between paragraphs. Start a line with ## for a subheading, or > for a quote.",
  category: "Which section of the site this belongs to.",
  topic: "Which topic inside that section.",
  colors: "Shown while the gallery has no photos.",
  type: "Which events page lists it.",
  kind: "Galleries and photo essays are listed on separate pages.",
};

const LONG_KEYS = new Set(["text", "intro", "excerpt", "bio", "note", "description", "siteDescription", "whoText", "contributeText", "addText", "partnerText", "creditText", "quote"]);
const SELECT_KEYS: Record<string, { value: string; label: string }[]> = {
  kind: [
    { value: "gallery", label: "Gallery" },
    { value: "photo-essay", label: "Photo essay" },
  ],
  type: [
    { value: "upcoming", label: "Upcoming events" },
    { value: "exhibitions", label: "Exhibitions" },
    { value: "competitions-clubs", label: "Essay competitions & clubs" },
  ],
};
const isColour = (key: string, value: unknown) =>
  key === "bg" || key === "color" || (typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value));

function humanize(key: string) {
  if (LABELS[key]) return LABELS[key];
  const words = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

const SINGULAR: Record<string, string> = {
  stories: "story",
  galleries: "gallery",
  categories: "section",
  latest: "thumbnail",
  documentaries: "documentary",
  galleryStrip: "photo",
  record: "point",
  wanted: "item",
  whyNature: "point",
  journey: "stop",
  missionVision: "card",
  ethics: "point",
  uses: "item",
  pastWeeks: "photo",
};
function singular(key: string) {
  if (SINGULAR[key]) return SINGULAR[key];
  const k = key.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
  if (k.endsWith("ies")) return k.slice(0, -3) + "y";
  if (k.endsWith("s")) return k.slice(0, -1);
  return "item";
}

function itemTitle(item: Json, key: string, index: number) {
  if (item && typeof item === "object" && !Array.isArray(item)) {
    for (const k of ["title", "name", "label", "kicker", "place", "stage", "day", "slug"]) {
      const v = item[k];
      if (typeof v === "string" && v.trim()) return v;
    }
  }
  return `${singular(key).replace(/^./, (c) => c.toUpperCase())} ${index + 1}`;
}

// ---------- Immutable helpers ----------

function setIn(root: Json, path: Path, value: Json): Json {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (Array.isArray(root)) {
    const copy = root.slice();
    copy[head as number] = setIn(copy[head as number], rest, value);
    return copy;
  }
  const obj = (root ?? {}) as Obj;
  return { ...obj, [head]: setIn(obj[head as string], rest, value) };
}

/** An empty copy of an item, used when adding a new one to a list. */
function blank(value: Json, key = ""): Json {
  if (Array.isArray(value)) return key === "colors" ? value.slice() : [];
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, blank(v, k)]));
  if (typeof value === "string") {
    if (key === "slug") return `new-${Date.now().toString(36)}`;
    if (isColour(key, value) || key in SELECT_KEYS || key === "category" || key === "topic") return value;
    return "";
  }
  return value; // numbers and true/false keep their example value
}

/** The first item of every list in the file, remembered so empty lists can still get new items. */
function collectTemplates(value: Json, path = "", out = new Map<string, Json>()) {
  if (Array.isArray(value)) {
    if (value.length && !out.has(path)) out.set(path, value[0]);
    value.forEach((v) => collectTemplates(v, `${path}[]`, out));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) collectTemplates(v, `${path}.${k}`, out);
  }
  return out;
}
const patternOf = (path: Path) => path.map((p) => (typeof p === "number" ? "[]" : `.${p}`)).join("");

// ---------- Editor ----------

type Ctx = {
  photos: LitePhoto[];
  categories: CategoryOption[];
  templates: Map<string, Json>;
  update: (path: Path, value: Json) => void;
  pickPhoto: (current: string, onPick: (id: string) => void) => void;
};

export default function DocEditor({ doc, initial, photos: initialPhotos, categories, mode, canSave }: Props) {
  const [value, setValue] = useState<Obj>(initial);
  const [saved, setSaved] = useState<string>(() => JSON.stringify(initial));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string; errors?: string[] } | null>(null);
  const [photos, setPhotos] = useState(initialPhotos);
  const [picker, setPicker] = useState<{ current: string; onPick: (id: string) => void } | null>(null);
  const templates = useMemo(() => collectTemplates(initial), [initial]);
  const dirty = JSON.stringify(value) !== saved;

  const update = useCallback((path: Path, next: Json) => setValue((v) => setIn(v, path, next) as Obj), []);
  const pickPhoto = useCallback((current: string, onPick: (id: string) => void) => setPicker({ current, onPick }), []);
  const ctx: Ctx = { photos, categories, templates, update, pickPhoto };

  const save = useCallback(async () => {
    if (!canSave || busy) return;
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doc: doc.id, data: value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ kind: "error", text: data.error || "Could not save.", errors: data.errors });
        return;
      }
      setSaved(JSON.stringify(value));
      setMessage({
        kind: "ok",
        text:
          mode === "github"
            ? "Saved. The live site updates in about 1–2 minutes, once Vercel has rebuilt it."
            : mode === "database"
              ? "Saved. It is live on the site now; refresh a page to see it."
              : "Saved. Refresh the site to see your changes.",
      });
    } catch {
      setMessage({ kind: "error", text: "Could not reach the server. Check your connection and try again." });
    } finally {
      setBusy(false);
    }
  }, [busy, canSave, doc.id, mode, value]);

  // Ctrl/Cmd + S saves; leaving with unsaved changes asks first.
  const saveRef = useRef(save);
  saveRef.current = save;
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void saveRef.current();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) e.preventDefault();
    };
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (!dirtyRef.current || !link || link.target === "_blank" || e.defaultPrevented) return;
      if (!window.confirm("You have unsaved changes. Leave this page without saving?")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeave);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  useEffect(() => {
    if (message?.kind !== "ok") return;
    const t = setTimeout(() => setMessage(null), 6000);
    return () => clearTimeout(t);
  }, [message]);

  const sections = Object.entries(value);

  return (
    <>
      <div className="a-head">
        <div className="a-head-text">
          <h1>{doc.title}</h1>
          <p className="a-muted">{doc.description}</p>
        </div>
        <a href={doc.view} target="_blank" rel="noreferrer" className="a-btn">
          View on site ↗
        </a>
      </div>

      <div className="a-savebar">
        <span className="a-savebar-status">
          <span className={`a-dot${dirty ? " dirty" : " saved"}`} aria-hidden="true" />
          {dirty ? "Unsaved changes" : "All changes saved"}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="a-btn" disabled={!dirty || busy} onClick={() => setValue(JSON.parse(saved))}>
            Undo changes
          </button>
          <button type="button" className="a-btn primary" disabled={!dirty || busy || !canSave} onClick={save} title="Ctrl + S">
            {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {message?.kind === "error" && (
        <div className="a-notice error" role="alert">
          {message.text}
          {message.errors && (
            <ul>
              {message.errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {sections.map(([key, v], i) => (
        <details key={key} className="a-section" open={sections.length === 1 || i === 0}>
          <summary>{humanize(key)}</summary>
          <div className="a-section-body">
            <Field ctx={ctx} path={[key]} name={key} value={v} parent={value} hideLabel />
          </div>
        </details>
      ))}

      {message?.kind === "ok" && (
        <div className="a-notice ok a-toast" role="status">
          {message.text}
        </div>
      )}

      {picker && (
        <PhotoPicker
          photos={photos}
          current={picker.current}
          onClose={() => setPicker(null)}
          onUploaded={(p) => setPhotos((list) => [p, ...list])}
          onPick={(id) => {
            picker.onPick(id);
            setPicker(null);
          }}
        />
      )}
    </>
  );
}

// ---------- Fields ----------

type FieldProps = { ctx: Ctx; path: Path; name: string; value: Json; parent: Json; hideLabel?: boolean };

function Field(props: FieldProps) {
  const { value, name } = props;
  if (Array.isArray(value)) {
    if (isPhotoKey(name)) return <PhotoListField {...props} value={value} />;
    if (name === "colors") return <ColourListField {...props} value={value} />;
    const example = value[0] ?? props.ctx.templates.get(patternOf(props.path));
    if (example !== null && typeof example === "object") return <ObjectListField {...props} value={value} />;
    return <StringListField {...props} value={value} />;
  }
  if (value !== null && typeof value === "object") return <GroupField {...props} value={value} />;
  return <LeafField {...props} />;
}

function Labelled({ name, hideLabel, children }: { name: string; hideLabel?: boolean; children: React.ReactNode }) {
  const hint = HINTS[name];
  return (
    <div className="a-field">
      {!hideLabel && <span className="a-field-label">{humanize(name)}</span>}
      {children}
      {hint && <span className="a-hint">{hint}</span>}
    </div>
  );
}

function LeafField({ ctx, path, name, value, parent, hideLabel }: FieldProps) {
  const set = (v: Json) => ctx.update(path, v);

  if (typeof value === "number") {
    return (
      <Labelled name={name} hideLabel={hideLabel}>
        <input type="number" value={value} onChange={(e) => set(e.target.value === "" ? 0 : Number(e.target.value))} style={{ maxWidth: 160 }} />
      </Labelled>
    );
  }
  if (typeof value === "boolean") {
    return (
      <label className="a-field" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <input type="checkbox" checked={value} onChange={(e) => set(e.target.checked)} />
        <span className="a-field-label">{humanize(name)}</span>
      </label>
    );
  }

  const text = typeof value === "string" ? value : "";

  if (isPhotoKey(name)) {
    return (
      <Labelled name={name} hideLabel={hideLabel}>
        <PhotoField ctx={ctx} id={text} onChange={set} />
      </Labelled>
    );
  }
  if (isColour(name, value)) {
    return (
      <Labelled name={name} hideLabel={hideLabel}>
        <ColourInput value={text} onChange={set} />
      </Labelled>
    );
  }
  if (name === "category" && ctx.categories.length) {
    return (
      <Labelled name={name} hideLabel={hideLabel}>
        <select value={text} onChange={(e) => set(e.target.value)}>
          {!ctx.categories.some((c) => c.slug === text) && <option value={text}>{text || "Choose…"}</option>}
          {ctx.categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </Labelled>
    );
  }
  if (name === "topic" && parent && typeof parent === "object" && !Array.isArray(parent) && typeof parent.category === "string") {
    const topics = ctx.categories.find((c) => c.slug === parent.category)?.topics ?? [];
    if (topics.length) {
      return (
        <Labelled name={name} hideLabel={hideLabel}>
          <select value={text} onChange={(e) => set(e.target.value)}>
            {!topics.some((t) => t.slug === text) && <option value={text}>{text ? `${text} (not in this section)` : "Choose…"}</option>}
            {topics.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.label}
              </option>
            ))}
          </select>
        </Labelled>
      );
    }
  }
  if (SELECT_KEYS[name]) {
    const options = SELECT_KEYS[name];
    return (
      <Labelled name={name} hideLabel={hideLabel}>
        <select value={text} onChange={(e) => set(e.target.value)}>
          {!options.some((o) => o.value === text) && <option value={text}>{text}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Labelled>
    );
  }
  if (name === "body") {
    return (
      <Labelled name={name} hideLabel={hideLabel}>
        <textarea value={text} onChange={(e) => set(e.target.value)} rows={Math.max(12, Math.min(40, text.split("\n").length + 4))} />
      </Labelled>
    );
  }
  if (LONG_KEYS.has(name) || text.length > 90 || text.includes("\n")) {
    return (
      <Labelled name={name} hideLabel={hideLabel}>
        <textarea value={text} onChange={(e) => set(e.target.value)} rows={Math.max(2, Math.min(10, Math.ceil(text.length / 90) + 1))} />
      </Labelled>
    );
  }
  return (
    <Labelled name={name} hideLabel={hideLabel}>
      <input type="text" value={text} onChange={(e) => set(e.target.value)} />
    </Labelled>
  );
}

function GroupField({ ctx, path, name, value, hideLabel }: FieldProps & { value: Obj }) {
  const fields = Object.entries(value).map(([k, v]) => (
    <Field key={k} ctx={ctx} path={[...path, k]} name={k} value={v} parent={value} />
  ));
  if (hideLabel) return <>{fields}</>;
  return (
    <div className="a-group">
      <span className="a-group-title">{humanize(name)}</span>
      {fields}
    </div>
  );
}

function ListTools({ ctx, path, list, index, onDuplicate }: { ctx: Ctx; path: Path; list: Json[]; index: number; onDuplicate?: () => void }) {
  const move = (to: number) => {
    const copy = list.slice();
    const [item] = copy.splice(index, 1);
    copy.splice(to, 0, item);
    ctx.update(path, copy);
  };
  return (
    <span className="a-item-tools" onClick={(e) => e.stopPropagation()}>
      <button type="button" className="a-btn small icon" title="Move up" aria-label="Move up" disabled={index === 0} onClick={() => move(index - 1)}>
        ↑
      </button>
      <button
        type="button"
        className="a-btn small icon"
        title="Move down"
        aria-label="Move down"
        disabled={index === list.length - 1}
        onClick={() => move(index + 1)}
      >
        ↓
      </button>
      {onDuplicate && (
        <button type="button" className="a-btn small icon" title="Duplicate" aria-label="Duplicate" onClick={onDuplicate}>
          ⧉
        </button>
      )}
      <button
        type="button"
        className="a-btn small icon danger"
        title="Remove"
        aria-label="Remove"
        onClick={() => window.confirm("Remove this item?") && ctx.update(path, list.filter((_, i) => i !== index))}
      >
        ✕
      </button>
    </span>
  );
}

function ObjectListField({ ctx, path, name, value, hideLabel }: FieldProps & { value: Json[] }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set(value.length === 1 ? [0] : []));
  const template = value[0] ?? ctx.templates.get(patternOf(path));
  const toggle = (i: number) =>
    setOpen((s) => {
      const next = new Set(s);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  const add = (item: Json, at = value.length) => {
    const copy: Json[] = [...value];
    copy.splice(at, 0, item);
    ctx.update(path, copy);
    setOpen(new Set([at]));
  };

  return (
    <div className="a-field">
      {!hideLabel && <span className="a-field-label">{humanize(name)}</span>}
      <div className="a-list">
        {value.map((item, i) => (
          <div key={i} className="a-item">
            <div className="a-item-head" onClick={() => toggle(i)}>
              <span aria-hidden="true">{open.has(i) ? "▾" : "▸"}</span>
              <span className="a-item-title">{itemTitle(item, name, i)}</span>
              <ListTools
                ctx={ctx}
                path={path}
                list={value}
                index={i}
                onDuplicate={() => {
                  const copy = JSON.parse(JSON.stringify(item)) as Json;
                  if (copy && typeof copy === "object" && !Array.isArray(copy) && typeof copy.slug === "string") {
                    copy.slug = `${copy.slug}-copy`;
                  }
                  add(copy, i + 1);
                }}
              />
            </div>
            {open.has(i) && (
              <div className="a-item-body">
                <Field ctx={ctx} path={[...path, i]} name={name} value={item} parent={value} hideLabel />
              </div>
            )}
          </div>
        ))}
        {value.length === 0 && <p className="a-muted">Nothing here yet.</p>}
      </div>
      {template !== undefined && (
        <button type="button" className="a-btn" style={{ alignSelf: "flex-start" }} onClick={() => add(blank(template))}>
          + Add {singular(name)}
        </button>
      )}
    </div>
  );
}

function StringListField({ ctx, path, name, value, hideLabel }: FieldProps & { value: Json[] }) {
  const long = name === "paragraphs" || value.some((v) => typeof v === "string" && v.length > 90);
  return (
    <div className="a-field">
      {!hideLabel && <span className="a-field-label">{humanize(name)}</span>}
      <div className="a-list">
        {value.map((item, i) => (
          <div key={i} className="a-row">
            {long ? (
              <textarea
                value={String(item ?? "")}
                rows={Math.max(2, Math.ceil(String(item ?? "").length / 90) + 1)}
                onChange={(e) => ctx.update([...path, i], e.target.value)}
              />
            ) : (
              <input type="text" value={String(item ?? "")} onChange={(e) => ctx.update([...path, i], e.target.value)} />
            )}
            <ListTools ctx={ctx} path={path} list={value} index={i} />
          </div>
        ))}
      </div>
      <button type="button" className="a-btn" style={{ alignSelf: "flex-start" }} onClick={() => ctx.update(path, [...value, ""])}>
        + Add {singular(name)}
      </button>
      {HINTS[name] && <span className="a-hint">{HINTS[name]}</span>}
    </div>
  );
}

function ColourInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const valid = /^#[0-9a-f]{6}$/i.test(value);
  return (
    <span className="a-color">
      <input type="color" value={valid ? value : "#cccccc"} onChange={(e) => onChange(e.target.value.toUpperCase())} aria-label="Pick a colour" />
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    </span>
  );
}

function ColourListField({ ctx, path, name, value }: FieldProps & { value: Json[] }) {
  return (
    <Labelled name={name}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {value.map((c, i) => (
          <span key={i} className="a-row" style={{ alignItems: "center" }}>
            <ColourInput value={String(c)} onChange={(v) => ctx.update([...path, i], v)} />
            <button type="button" className="a-btn small icon danger" aria-label="Remove colour" onClick={() => ctx.update(path, value.filter((_, j) => j !== i))}>
              ✕
            </button>
          </span>
        ))}
        <button type="button" className="a-btn small" onClick={() => ctx.update(path, [...value, "#D9D3C7"])}>
          + Add colour
        </button>
      </div>
    </Labelled>
  );
}

function PhotoField({ ctx, id, onChange }: { ctx: Ctx; id: string; onChange: (id: string) => void }) {
  const photo = ctx.photos.find((p) => p.id === id);
  return (
    <div className="a-photo-field">
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumb(photo.file, 240)} alt="" className="a-thumb" />
      ) : (
        <span className="a-thumb empty">{id ? "Missing" : "No photo"}</span>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
        <span className="a-small a-muted" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          {photo ? photo.alt : id ? `“${id}” is not in the photo library any more.` : "The frame shows its background colour."}
        </span>
        <span style={{ display: "flex", gap: 6 }}>
          <button type="button" className="a-btn small" onClick={() => ctx.pickPhoto(id, onChange)}>
            {photo ? "Change photo" : "Choose photo"}
          </button>
          {id && (
            <button type="button" className="a-btn small" onClick={() => onChange("")}>
              Remove
            </button>
          )}
        </span>
      </div>
    </div>
  );
}

function PhotoListField({ ctx, path, name, value }: FieldProps & { value: Json[] }) {
  const ids = value.map((v) => String(v ?? ""));
  const move = (from: number, to: number) => {
    const copy = ids.slice();
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    ctx.update(path, copy);
  };
  return (
    <Labelled name={name}>
      <div className="a-photo-list">
        {ids.map((id, i) => {
          const photo = ctx.photos.find((p) => p.id === id);
          return (
            <div key={`${id}-${i}`} className="a-photo-chip" title={photo?.alt ?? id}>
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb(photo.file, 200)} alt="" className="a-thumb" />
              ) : (
                <span className="a-thumb empty">Missing</span>
              )}
              <span className="a-photo-chip-tools">
                <button type="button" className="a-btn" aria-label="Move left" disabled={i === 0} onClick={() => move(i, i - 1)}>
                  ←
                </button>
                <button type="button" className="a-btn" aria-label="Move right" disabled={i === ids.length - 1} onClick={() => move(i, i + 1)}>
                  →
                </button>
                <button type="button" className="a-btn danger" aria-label="Remove photo" onClick={() => ctx.update(path, ids.filter((_, j) => j !== i))}>
                  ✕
                </button>
              </span>
            </div>
          );
        })}
        <button type="button" className="a-btn" style={{ height: 64 }} onClick={() => ctx.pickPhoto("", (picked) => ctx.update(path, [...ids, picked]))}>
          + Add photo
        </button>
      </div>
    </Labelled>
  );
}
