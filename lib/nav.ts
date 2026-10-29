import { articlesFor, categories, events, galleries, links } from "./site";

export type NavLink = { label: string; href: string };

export type NavSection = {
  id: string;
  label: string;
  viewAllHref: string;
  children: NavLink[];
  latest: { title: string; href: string; color: string }[];
};

function latestFor(slug: string): NavSection["latest"] {
  if (slug === "photography") {
    return galleries.slice(0, 2).map((g) => ({ title: g.title, href: `/photography/gallery/${g.slug}`, color: g.colors[0] }));
  }
  if (slug === "events") {
    return events.slice(0, 2).map((e) => ({ title: e.title, href: `/events/${e.type}`, color: "#EBD9B4" }));
  }
  return articlesFor(slug)
    .slice(0, 2)
    .map((a) => ({ title: a.title, href: `/articles/${a.slug}`, color: a.color }));
}

export const navSections: NavSection[] = [
  ...categories.map((c) => ({
    id: c.slug,
    label: c.label,
    viewAllHref: `/${c.slug}`,
    children: c.topics.map((t) => ({ label: t.label, href: `/${c.slug}/${t.slug}` })),
    latest: latestFor(c.slug),
  })),
  {
    id: "more",
    label: "More",
    viewAllHref: "/about",
    children: [
      { label: "About Gae", href: "/about" },
      { label: "All Articles", href: "/articles" },
      { label: "The Archive", href: "/archive" },
      { label: "Videos", href: "/videos" },
      { label: "Our Founders", href: "/founders" },
      { label: "Newsletter", href: "/newsletter" },
      { label: "Contact", href: "/contact" },
      { label: "YouTube", href: links.youtube },
      { label: "Instagram", href: links.instagram },
      { label: "TikTok", href: links.tiktok },
    ],
    latest: [],
  },
];
