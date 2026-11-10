/** The content files the admin can edit, in the order they appear in the sidebar. */
export const docs = [
  {
    id: "home",
    title: "Homepage",
    description: "Every section of the front page: headings, text, cards, buttons and photos.",
    view: "/",
  },
  {
    id: "articles",
    title: "Articles",
    description: "Write, edit and add articles: title, summary, full text, section and lead photo.",
    view: "/articles",
  },
  {
    id: "photography",
    title: "Photography",
    description: "Photo of the week, past weeks, galleries and photo essays.",
    view: "/photography",
  },
  {
    id: "events",
    title: "Events",
    description: "Exhibitions, nature walks, competitions and clubs.",
    view: "/events",
  },
  {
    id: "about",
    title: "About & founders",
    description: "Mission, vision, ethics, the founders, the journey and why nature.",
    view: "/about",
  },
  {
    id: "explore",
    title: "Regions & artefacts",
    description: "The region cards on Explore Africa and the artefact records.",
    view: "/explore",
  },
  {
    id: "pages",
    title: "Other pages",
    description: "Headings and text on About, Archive, Videos, Support, Contribute, Contact and more.",
    view: "/archive",
  },
  {
    id: "categories",
    title: "Sections & topics",
    description: "The site sections (History & Culture, Travel…) and the topics inside each one.",
    view: "/history-culture",
  },
  {
    id: "nav",
    title: "Menu",
    description: "The slide-out menu: its sections, links and the small “Latest” thumbnails.",
    view: "/",
  },
  {
    id: "settings",
    title: "Settings & links",
    description: "Social and donation links, email, footer, and the newsletter and support boxes.",
    view: "/support",
  },
] as const;

export type DocId = (typeof docs)[number]["id"];

export function getDoc(id: string) {
  return docs.find((d) => d.id === id);
}

export const docFile = (id: DocId) => `content/${id}.json`;

export const PHOTOS_FILE = "content/photos.json";
