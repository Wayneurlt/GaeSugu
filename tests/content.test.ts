import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { validateDoc } from "@/lib/admin/validate";

/** Guards the content files the site starts from, so a hand edit to /content cannot break a page. */
const root = path.join(__dirname, "..");
const dir = path.join(root, "content");
const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
const load = (file: string) => JSON.parse(readFileSync(path.join(dir, file), "utf8"));

describe("content files", () => {
  it("are all present", () => {
    for (const name of ["about", "articles", "categories", "events", "explore", "home", "nav", "pages", "photography", "photos", "settings"]) {
      assert.ok(files.includes(`${name}.json`), name);
    }
  });

  for (const file of files) {
    it(`${file} is valid JSON with a consistent shape`, () => {
      const data = load(file);
      assert.deepEqual(validateDoc(data, data), []);
    });
  }

  it("every photo used on the site exists in the library, and its file is in /public", () => {
    const photos = load("photos.json").photos as { id: string; file: string }[];
    const ids = new Set(photos.map((p) => p.id));
    for (const p of photos) {
      assert.ok(p.file.startsWith("/photos/"), p.file);
      assert.doesNotThrow(() => readFileSync(path.join(root, "public", p.file)), p.file);
    }
    const used: string[] = [];
    const walk = (v: unknown, key = "") => {
      if (typeof v === "string") {
        if (v && (key === "photo" || /Photo$/.test(key))) used.push(v);
      } else if (Array.isArray(v)) {
        for (const x of v) {
          if ((key === "photos" || key === "pastWeeks") && typeof x === "string") used.push(x);
          else walk(x, key);
        }
      } else if (v && typeof v === "object") {
        for (const [k, x] of Object.entries(v)) walk(x, k);
      }
    };
    for (const f of files.filter((f) => f !== "photos.json")) walk(load(f));
    assert.deepEqual(used.filter((id) => !ids.has(id)), []);
  });

  it("every article belongs to a real section and topic", () => {
    const categories = load("categories.json").categories as { slug: string; topics: { slug: string }[] }[];
    for (const a of load("articles.json").articles as { slug: string; category: string; topic: string }[]) {
      const category = categories.find((c) => c.slug === a.category);
      assert.ok(category, `${a.slug}: section ${a.category}`);
      assert.ok(category.topics.some((t) => t.slug === a.topic), `${a.slug}: topic ${a.topic}`);
    }
  });
});
