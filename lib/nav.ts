import type { PhotoId } from "./photos";

export type NavLink = { label: string; href: string };

export type NavSection = {
  id: string;
  label: string;
  viewAllHref: string;
  children: NavLink[];
  latest: { title: string; href: string; color: string; photo: PhotoId }[];
};

const thumbs = ["#C9D6B8", "#E2C2B2"];

function section(
  id: string,
  label: string,
  viewAllHref: string,
  children: NavLink[],
  latest: [string, string],
  pics: [PhotoId, PhotoId],
): NavSection {
  return {
    id,
    label,
    viewAllHref,
    children,
    latest: latest.map((title, i) => ({ title, href: viewAllHref, color: thumbs[i], photo: pics[i] })),
  };
}

export const navSections: NavSection[] = [
  section(
    "explore",
    "Explore Africa",
    "/explore",
    [
      { label: "East Africa (starting with Kenya)", href: "/explore#east-africa" },
      { label: "West Africa", href: "/explore#west-africa" },
      { label: "Central Africa", href: "/explore#central-africa" },
      { label: "Southern Africa", href: "/explore#southern-africa" },
      { label: "North Africa", href: "/explore#north-africa" },
      { label: "Indian Ocean Islands", href: "/explore#indian-ocean-islands" },
    ],
    ["[Latest field story · Kajiado]", "[Coming next · Western Kenya]"],
    ["forestPath", "lonePalm"],
  ),
  section(
    "culture",
    "Culture & Heritage",
    "/history-culture",
    [
      { label: "Traditions & Ceremonies", href: "/history-culture/traditions-ceremonies" },
      { label: "Folklore, Music & Food", href: "/history-culture/folklore-music-food" },
      { label: "Languages", href: "/history-culture/languages" },
      { label: "Crafts & Artisans", href: "/history-culture/crafts-artisans" },
      { label: "Elders, Healers & Rainmakers", href: "/history-culture/oral-history" },
      { label: "Myths or Meaning?", href: "/animals-nature/sacred-nature" },
      { label: "Who Are We? (essays by Naomi)", href: "/history-culture/roots-identity" },
    ],
    ["[Latest interview]", "[Latest essay title]"],
    ["boatman", "coastVillage"],
  ),
  section(
    "nature",
    "Biodiversity & Conservation",
    "/animals-nature",
    [
      { label: "Wildlife", href: "/animals-nature/wildlife" },
      { label: "Plants & Healing Plants", href: "/animals-nature/plants-healing" },
      { label: "Ecosystems & Landscapes", href: "/animals-nature/ecosystems-landscapes" },
      { label: "Endangered Species", href: "/animals-nature/endangered-species" },
      { label: "Sacred Sites", href: "/animals-nature/sacred-places" },
      { label: "Conservation Stories", href: "/sustainability/conservation" },
      { label: "Sustainable Travel", href: "/travel/green-travel" },
    ],
    ["[Species spotlight]", "[Latest story title]"],
    ["vervet", "kingfisher"],
  ),
  section(
    "diaspora",
    "Black & African Diaspora",
    "/diaspora",
    [
      { label: "Diaspora Voices", href: "/diaspora/diaspora-voices" },
      { label: "Finding Your Roots", href: "/diaspora/finding-your-roots" },
      { label: "Names & Meanings", href: "/diaspora/names-meanings" },
      { label: "Learn a Language", href: "/diaspora/learn-a-language" },
      { label: "Coming Home", href: "/diaspora/coming-home" },
    ],
    ["[Latest diaspora story]", "[Latest story title]"],
    ["palmGrove", "muralWall"],
  ),
  section(
    "archive",
    "The Archive",
    "/archive",
    [
      { label: "Articles & Essays", href: "/articles" },
      { label: "Photography", href: "/photography" },
      { label: "Documentaries", href: "/videos" },
      { label: "Artefacts", href: "/artefacts" },
    ],
    ["[Latest article]", "[Photo of the week]"],
    ["mossForest", "egret"],
  ),
  section(
    "involved",
    "Get Involved",
    "/events",
    [
      { label: "Events", href: "/events" },
      { label: "Competitions & Clubs", href: "/events/competitions-clubs" },
      { label: "Contribute", href: "/contribute" },
      { label: "Newsletter", href: "/newsletter" },
    ],
    ["[Next event]", "[Next event]"],
    ["clearLake", "lakeRocks"],
  ),
  section(
    "about",
    "About",
    "/about",
    [
      { label: "Mission & Vision", href: "/about#mission" },
      { label: "Founders", href: "/founders" },
      { label: "Our Ethics", href: "/about#ethics" },
      { label: "Contact", href: "/contact" },
    ],
    ["[Latest article]", "[Latest article]"],
    ["riftView", "grassHillside"],
  ),
];
