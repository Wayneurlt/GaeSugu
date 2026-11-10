import { unstable_cache } from "next/cache";
import { cache } from "react";
import about from "@/content/about.json";
import articles from "@/content/articles.json";
import categories from "@/content/categories.json";
import events from "@/content/events.json";
import explore from "@/content/explore.json";
import home from "@/content/home.json";
import nav from "@/content/nav.json";
import pages from "@/content/pages.json";
import photography from "@/content/photography.json";
import photos from "@/content/photos.json";
import settings from "@/content/settings.json";
import { hasDatabase, readContentRows } from "./db";

/** The files in /content: the site's starting content, used until a file is edited in the admin. */
export const contentDefaults = { about, articles, categories, events, explore, home, nav, pages, photography, photos, settings };

export type Content = typeof contentDefaults;
export type ContentId = keyof Content;

export const isContentId = (id: string): id is ContentId => Object.hasOwn(contentDefaults, id);

/** Cache tag cleared whenever the admin saves, so every page shows the change on its next visit. */
export const CONTENT_TAG = "site-content";

const loadFromDatabase = unstable_cache(
  async () => ({ ...contentDefaults, ...(await readContentRows()) }) as Content,
  ["site-content"],
  { tags: [CONTENT_TAG] },
);

/** All site content: edits from the database on top of the files in /content. */
export const loadContent = cache(async (): Promise<Content> => (hasDatabase() ? loadFromDatabase() : contentDefaults));
