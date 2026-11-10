import type { Content } from "./content";
import type { PhotoId, PhotoInfo } from "./photos";

export type NavLink = { label: string; href: string };

export type NavSection = {
  label: string;
  viewAllHref: string;
  links: NavLink[];
  /** Thumbnails at the foot of the section; `photo` is resolved for the client menu. */
  latest: { title: string; href: string; color: string; photo: PhotoInfo | undefined }[];
};

/** The slide-out menu, edited in the admin under "Menu". */
export function buildNav(nav: Content["nav"], getPhoto: (id: PhotoId | undefined) => PhotoInfo | undefined): NavSection[] {
  return nav.sections.map((s) => ({
    ...s,
    latest: s.latest.map((l) => ({ ...l, photo: getPhoto(l.photo) })),
  }));
}
