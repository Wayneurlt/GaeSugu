import { promises as fs } from "node:fs";
import path from "node:path";
import { type Content, contentDefaults } from "@/lib/content";
import { readContentDates } from "@/lib/db";
import { docs } from "./docs";
import { readJson, storageInfo } from "./storage";
import { isPhotoKey } from "./validate";

/** A placeholder waiting for real words, like "[Add a few lines in your own words.]". */
const PLACEHOLDER = /\[[^\]"]{2,}\]/;
/** Fields that hold links, colours, slugs or photo ids rather than words. */
const NOT_TEXT = /^(href|.*Href|slug|bg|color|colors|focus|file|blur|id|type|kind|category|topic)$/;

/** Counts the words-fields in a content file, and how many still hold a placeholder. */
function countText(value: unknown, key = ""): { texts: number; placeholders: number } {
  if (typeof value === "string") {
    if (NOT_TEXT.test(key) || isPhotoKey(key) || /^(#|\/|https?:|mailto:|data:)/.test(value)) return { texts: 0, placeholders: 0 };
    return { texts: 1, placeholders: PLACEHOLDER.test(value) ? 1 : 0 };
  }
  const children: [string, unknown][] = Array.isArray(value)
    ? value.map((v) => [key, v])
    : value && typeof value === "object"
      ? Object.entries(value)
      : [];
  if (isPhotoKey(key)) return { texts: 0, placeholders: 0 };
  return children.reduce(
    (sum, [k, v]) => {
      const c = countText(v, k);
      return { texts: sum.texts + c.texts, placeholders: sum.placeholders + c.placeholders };
    },
    { texts: 0, placeholders: 0 },
  );
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

function itemsLabel(id: keyof Content | "photos", c: Content, texts: number) {
  switch (id) {
    case "articles":
      return plural(c.articles.articles.length, "article");
    case "photography":
      return plural(c.photography.galleries.length, "gallery").replace("gallerys", "galleries");
    case "events":
      return plural(c.events.events.length, "event");
    case "explore":
      return `${plural(c.explore.regions.length, "region")}, ${c.explore.artefacts.length} artefacts`;
    case "categories":
      return plural(c.categories.categories.length, "section");
    case "nav":
      return plural(c.nav.sections.length, "menu group");
    case "photos":
      return plural(c.photos.photos.length, "photo");
    default:
      return plural(texts, "text");
  }
}

/** When each content file was last changed: from the database, or the file's own date on this computer. */
async function lastEdited(): Promise<Record<string, string>> {
  const mode = storageInfo().mode;
  if (mode === "database") return readContentDates().catch(() => ({}));
  if (mode !== "local") return {};
  const ids = Object.keys(contentDefaults);
  const stats = await Promise.all(
    ids.map((id) =>
      fs
        .stat(path.join(process.cwd(), "content", `${id}.json`))
        .then((s) => [id, s.mtime.toISOString()] as const)
        .catch(() => null),
    ),
  );
  return Object.fromEntries(stats.filter((s) => s !== null));
}

export type TrackerRow = {
  id: string;
  title: string;
  note: string;
  href: string;
  view: string;
  progress: number;
  placeholders: number;
  edited: string | null;
  items: string;
};

export async function dashboardData() {
  const storage = storageInfo();
  // Read through the admin's storage, so the numbers match what the editors show.
  const ids = [...docs.map((d) => d.id), "photos"] as (keyof Content)[];
  const loaded = await Promise.all(ids.map((id) => readJson(`content/${id}.json`).catch(() => contentDefaults[id])));
  const c = Object.fromEntries(ids.map((id, i) => [id, loaded[i]])) as unknown as Content;
  const dates = await lastEdited();

  const rows: TrackerRow[] = docs.map((d) => {
    const { texts, placeholders } = countText(c[d.id]);
    return {
      id: d.id,
      title: d.title,
      note: d.view === "/" ? "front page" : d.view,
      href: `/admin/edit/${d.id}`,
      view: d.view,
      progress: texts ? Math.round(((texts - placeholders) / texts) * 100) : 100,
      placeholders,
      edited: dates[d.id] ?? null,
      items: itemsLabel(d.id, c, texts),
    };
  });

  // The photo library: "complete" means every photo has a description.
  const photos = c.photos.photos;
  const described = photos.filter((p) => p.alt.trim()).length;
  rows.splice(1, 0, {
    id: "photos",
    title: "Photo library",
    note: "/photography",
    href: "/admin/photos",
    view: "/photography",
    progress: photos.length ? Math.round((described / photos.length) * 100) : 100,
    placeholders: photos.length - described,
    edited: dates.photos ?? null,
    items: itemsLabel("photos", c, 0),
  });

  const sections = c.categories.categories
    .filter((x) => x.slug !== "photography" && x.slug !== "events")
    .map((x) => {
      const list = c.articles.articles.filter((a) => a.category === x.slug);
      const short = x.slug.split("-")[0];
      return {
        slug: x.slug,
        label: x.label,
        short: short[0].toUpperCase() + short.slice(1),
        articles: list.length,
        minutes: list.reduce((sum, a) => sum + (Number(a.minutes) || 0), 0),
      };
    });

  const founders = c.about.founders.map((f) => ({
    name: f.name,
    role: f.role,
    bg: f.bg,
    file: photos.find((p) => p.id === f.photo)?.file,
  }));

  return {
    storage,
    rows,
    sections,
    founders,
    email: c.settings.email,
    stats: {
      articles: c.articles.articles.length,
      readingMinutes: c.articles.articles.reduce((sum, a) => sum + (Number(a.minutes) || 0), 0),
      photos: photos.length,
      ready: rows.filter((r) => r.placeholders === 0).length,
      total: rows.length,
    },
    edited: rows.filter((r) => r.edited).length,
    search: [
      ...rows.map((r) => ({ label: r.title, hint: "Section", href: r.href })),
      ...c.articles.articles.map((a) => ({ label: a.title, hint: "Article", href: "/admin/edit/articles" })),
      ...photos.map((p) => ({ label: p.alt || p.id, hint: "Photo", href: "/admin/photos" })),
    ],
  };
}

export type DashboardData = Awaited<ReturnType<typeof dashboardData>>;
