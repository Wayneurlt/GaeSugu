/**
 * Site content for the pages. It comes from the files in /content, with any
 * edits made in the admin (/admin) stored in the database on top. Text in
 * [square brackets] is a placeholder waiting for real words, photos or links.
 *
 * Pages call `await getSite()`; it is loaded once per request and cached
 * between requests until the admin saves.
 */

import { cache } from "react";
import { loadContent, type Content } from "./content";
import { buildNav } from "./nav";
import { photoLookup, type PhotoId, type PhotoInfo } from "./photos";

export type Topic = { slug: string; label: string; intro: string };

export type Category = {
  slug: string;
  label: string;
  tagline: string;
  intro: string;
  color: string;
  topics: Topic[];
};


// ---------- Articles ----------

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  topic: string;
  county: string;
  author: string;
  minutes: number;
  color: string;
  /** Lead photo; falls back to `color` until one is chosen. */
  photo?: PhotoId;
  /** Blank lines separate paragraphs; "## " starts a heading and "> " a quote. */
  body: string;
  /** Small print under the article: sources, consent, language notes. */
  note: string;
};


// ---------- Photography ----------

export type Gallery = {
  slug: string;
  title: string;
  county: string;
  kind: "gallery" | "photo-essay" | string;
  /** Placeholder tones, used until `photos` is filled in. */
  colors: string[];
  photos: PhotoId[];
};


// ---------- Events ----------

export type GaeEvent = {
  slug: string;
  /** Which events topic lists it: exhibitions, upcoming or competitions-clubs. */
  type: string;
  kicker: string;
  title: string;
  day: string;
  month: string;
  meta: string;
  cta: string;
};


// ---------- Explore, artefacts, about ----------

export type Region = { slug: string; name: string; text: string; bg: string; photo: PhotoId };


export type Artefact = { slug: string; name: string; community: string; county: string; text: string; photo: PhotoId };

// ---------- Everything together ----------

function buildSite(c: Content) {
  const categories: Category[] = c.categories.categories;
  const articles: Article[] = c.articles.articles;
  const photoList: PhotoInfo[] = c.photos.photos;
  const getPhoto = photoLookup(photoList);
  const getCategory = (slug: string) => categories.find((x) => x.slug === slug);

  return {
    categories,
    /** Categories whose pages list articles (Photography and Events have their own pages). */
    articleCategories: categories.filter((x) => x.slug !== "photography" && x.slug !== "events"),
    getCategory,
    getTopic: (categorySlug: string, topicSlug: string) => getCategory(categorySlug)?.topics.find((t) => t.slug === topicSlug),

    articles,
    getArticle: (slug: string) => articles.find((a) => a.slug === slug),
    articlesFor: (category: string, topic?: string) => articles.filter((a) => a.category === category && (!topic || a.topic === topic)),

    galleries: c.photography.galleries as Gallery[],
    photoOfTheWeek: c.photography.photoOfTheWeek as { title: string; text: string; county: string; photo: PhotoId },
    pastWeeks: c.photography.pastWeeks as PhotoId[],

    events: c.events.events as GaeEvent[],

    /** The rest of the continent. Photos are stand-ins until we travel there. */
    regions: c.explore.regions as Region[],
    artefacts: c.explore.artefacts as Artefact[],

    missionVision: c.about.missionVision,
    ethics: c.about.ethics,
    founders: c.about.founders,
    journey: c.about.journey,
    journeyIntro: c.about.journeyIntro,
    whyNature: c.about.whyNature,
    whyNatureIntro: c.about.whyNatureIntro,

    home: c.home,
    pages: c.pages,
    settings: c.settings,
    /** Social and support links, plus the contact email. */
    links: { ...c.settings.links, email: c.settings.email },

    photoList,
    getPhoto,
    navSections: buildNav(c.nav, getPhoto),
  };
}

export type Site = ReturnType<typeof buildSite>;

/** All site content, for server components and route functions. */
export const getSite = cache(async () => buildSite(await loadContent()));
