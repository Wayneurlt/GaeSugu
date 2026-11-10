import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { niceTop } from "@/lib/admin/chart";
import { countText } from "@/lib/admin/completeness";

describe("countText: how much of a section is written", () => {
  it("counts text fields and the ones that are still placeholders", () => {
    const doc = {
      title: "Welcome",
      text: "[Add a few lines in your own words.]",
      cards: [{ title: "Traditions", text: "Real words" }, { title: "[Card title]", text: "More words" }],
    };
    assert.deepEqual(countText(doc), { texts: 6, placeholders: 2 });
  });

  it("ignores links, colours, slugs and photo ids", () => {
    const doc = {
      slug: "the-owl",
      href: "/articles",
      viewAllHref: "/travel",
      bg: "#A8432E",
      color: "#fff",
      photo: "egret",
      photos: ["a", "b"],
      heroPhoto: "kingfisher",
      link: "https://example.com",
      email: "mailto:hi@example.com",
      title: "Only this counts",
    };
    assert.deepEqual(countText(doc), { texts: 1, placeholders: 0 });
  });

  it("does not treat ordinary brackets in writing as placeholders", () => {
    assert.equal(countText({ text: "He said it [sic] twice […] as noted [2]." }).placeholders, 0);
    assert.equal(countText({ text: "Met [Name] in [Place]." }).placeholders, 1);
  });
});

describe("niceTop: the chart's top value", () => {
  it("is a round number at or above the highest bar, split into four equal steps", () => {
    for (const max of [0, 1, 3, 4, 7, 21, 54, 130, 999]) {
      const top = niceTop(max);
      assert.ok(top >= max && top >= 4, `max ${max} → ${top}`);
      assert.ok(Number.isInteger((top / 4) * 2), `max ${max} → step ${top / 4}`);
    }
  });

  it("leaves some room so the tallest bar is not cut off", () => {
    assert.equal(niceTop(3), 4);
    assert.equal(niceTop(8), 10);
    assert.equal(niceTop(21), 40);
  });
});
