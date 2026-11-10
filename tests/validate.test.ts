import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { findPhotoUses, isPhotoKey, validateDoc } from "@/lib/admin/validate";

const current = {
  intro: { title: "A living archive", text: "Stories from the land." },
  articles: [
    { slug: "first-trip", title: "Our first trip", minutes: 8, photo: "egret" },
    { slug: "the-owl", title: "The owl", minutes: 6, photo: "" },
  ],
};
const copy = () => structuredClone(current);

describe("validateDoc: an edit must keep the shape of the page", () => {
  it("accepts an unchanged file and ordinary text edits", () => {
    assert.deepEqual(validateDoc(copy(), current), []);
    const edited = copy();
    edited.intro.title = "A new title";
    edited.articles[1].minutes = 12;
    assert.deepEqual(validateDoc(edited, current), []);
  });

  it("accepts adding, removing and reordering list items", () => {
    const edited = copy();
    edited.articles.reverse();
    edited.articles.push({ slug: "new-article", title: "New", minutes: 5, photo: "" });
    assert.deepEqual(validateDoc(edited, current), []);
    assert.deepEqual(validateDoc({ ...copy(), articles: [] }, current), []);
  });

  it("refuses the wrong type of value", () => {
    const edited = copy();
    (edited.intro as Record<string, unknown>).title = 42;
    assert.ok(validateDoc(edited, current).length > 0);
  });

  it("refuses missing and unknown fields", () => {
    const missing = copy() as Partial<typeof current>;
    delete missing.intro;
    assert.ok(validateDoc(missing, current).length > 0);

    const extra = copy();
    (extra.articles[0] as Record<string, unknown>).sneaky = "<script>";
    assert.ok(validateDoc(extra, current).length > 0);
  });

  it("refuses invalid and duplicate slugs", () => {
    const bad = copy();
    bad.articles[0].slug = "Not A Slug";
    assert.match(validateDoc(bad, current).join(" "), /slug/i);

    const dupe = copy();
    dupe.articles[1].slug = dupe.articles[0].slug;
    assert.match(validateDoc(dupe, current).join(" "), /slug/i);
  });
});

describe("photo fields", () => {
  it("recognises the fields that hold photo ids", () => {
    for (const key of ["photo", "photos", "pastWeeks", "heroPhoto"]) assert.equal(isPhotoKey(key), true, key);
    for (const key of ["title", "photographer", "slug"]) assert.equal(isPhotoKey(key), false, key);
  });

  it("finds where a photo is used", () => {
    assert.equal(findPhotoUses("Articles", current, "egret").length, 1);
    assert.deepEqual(findPhotoUses("Articles", current, "kingfisher"), []);
  });
});
