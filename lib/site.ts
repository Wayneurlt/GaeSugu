/**
 * All site content lives here. Text in [square brackets] is a placeholder
 * waiting for real words, photos or links.
 */

export type Topic = { slug: string; label: string; intro: string };

export type Category = {
  slug: string;
  label: string;
  tagline: string;
  intro: string;
  color: string;
  topics: Topic[];
};

export const categories: Category[] = [
  {
    slug: "animals-nature",
    label: "Animals & Nature",
    tagline: "the land we cannot be separated from",
    intro:
      "Wildlife, plants and sacred places, and the beliefs around them. When an animal or a forest disappears, a piece of our culture goes with it.",
    color: "#B7C7A8",
    topics: [
      { slug: "wildlife", label: "Wildlife", intro: "The animals of each place we visit, documented by Jeff." },
      {
        slug: "sacred-nature",
        label: "Sacred Nature",
        intro: "Animals, plants and places once honoured, later feared. What is myth, and what carries real meaning?",
      },
      { slug: "plants-healing", label: "Plants & Healing", intro: "Plants healers know by name and use." },
      { slug: "sacred-places", label: "Sacred Places", intro: "Groves, hills, rivers and trees held sacred." },
    ],
  },
  {
    slug: "history-culture",
    label: "History & Culture",
    tagline: "the pieces we are picking back up",
    intro:
      "Traditions, ceremonies, languages and the voices of elders, healers, rainmakers and artisans, recorded so they are not lost.",
    color: "#E2C2B2",
    topics: [
      { slug: "traditions-ceremonies", label: "Traditions & Ceremonies", intro: "Rites, gatherings and the meaning behind them." },
      { slug: "oral-history", label: "Oral History & Voices", intro: "Interviews with elders, healers, rainmakers and artisans." },
      { slug: "heritage-sites", label: "Heritage Sites", intro: "Places that hold our history." },
      { slug: "languages", label: "Languages", intro: "Words, sayings and names, and what they carry." },
      { slug: "roots-identity", label: "Roots & Identity", intro: "Essays on what it means to be African today." },
    ],
  },
  {
    slug: "travel",
    label: "Travel",
    tagline: "one county at a time",
    intro: "Field notes from the road: Kajiado first, then western Kenya, then the rest of Kenya and Africa.",
    color: "#EBD9B4",
    topics: [
      { slug: "field-notes", label: "Field Notes by County", intro: "What we saw, heard and learned in each county." },
      { slug: "destination-guides", label: "Destination Guides", intro: "Where to go, and how to go respectfully." },
      { slug: "villages-homestays", label: "Villages & Homestays", intro: "Staying with communities, not just passing through." },
      { slug: "green-travel", label: "Green Travel", intro: "Travelling lightly on the land." },
    ],
  },
  {
    slug: "wellness",
    label: "Wellness",
    tagline: "living well, the old way",
    intro: "Food from the land, movement in nature, rest, and traditional healing.",
    color: "#D6DFC4",
    topics: [
      { slug: "living-well", label: "Living Well", intro: "Everyday ways our communities stay well." },
      { slug: "food-nutrition", label: "Food & Nutrition", intro: "Indigenous foods and how they are prepared." },
      { slug: "movement-in-nature", label: "Movement in Nature", intro: "Walking, working and moving through the land." },
      { slug: "traditional-healing", label: "Traditional Healing", intro: "Healers, their knowledge and their practice." },
    ],
  },
  {
    slug: "sustainability",
    label: "Sustainability",
    tagline: "caring for the land that keeps us",
    intro: "Conservation, climate and the community projects protecting forests, rivers and wildlife.",
    color: "#BFD8C8",
    topics: [
      { slug: "conservation", label: "Conservation", intro: "Communities protecting forests, rivers and wildlife." },
      { slug: "climate-land", label: "Climate & Land", intro: "How traditional knowledge cares for the land." },
      { slug: "community-projects", label: "Community Projects", intro: "Tree planting, clean-ups and projects we support." },
    ],
  },
  {
    slug: "photography",
    label: "Photography",
    tagline: "through our lens",
    intro: "Communities, wildlife, ceremonies and landscapes, photographed on the road.",
    color: "#C9DCE3",
    topics: [
      { slug: "photo-of-the-week", label: "Photo of the Week", intro: "One photograph and the story behind it." },
      { slug: "galleries", label: "Galleries", intro: "Collections from each place we visit." },
      { slug: "photo-essays", label: "Photo Essays", intro: "Stories told mostly in pictures." },
    ],
  },
  {
    slug: "events",
    label: "Events",
    tagline: "come and gather with us",
    intro: "Exhibitions, nature walks, storytelling evenings and essay competitions.",
    color: "#E8D3B8",
    topics: [
      { slug: "upcoming", label: "Upcoming Events", intro: "Everything coming up." },
      { slug: "exhibitions", label: "Exhibitions", intro: "Photo exhibitions from the archive." },
      { slug: "competitions-clubs", label: "Essay Competitions & Clubs", intro: "For schools and young writers." },
    ],
  },
];

/** Categories whose pages list articles (Photography and Events have their own pages). */
export const articleCategories = categories.filter((c) => c.slug !== "photography" && c.slug !== "events");

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getTopic(categorySlug: string, topicSlug: string) {
  return getCategory(categorySlug)?.topics.find((t) => t.slug === topicSlug);
}

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
};

export const articles: Article[] = [
  {
    slug: "kajiado-first-trip",
    title: "Kajiado: notes from our first trip",
    excerpt: "[Where we went, who we met, and what we learned on the pilot trip.]",
    category: "travel",
    topic: "field-notes",
    county: "Kajiado",
    author: "Naomi & Jeff",
    minutes: 8,
    color: "#D9D3C7",
  },
  {
    slug: "the-owl-omen-or-messenger",
    title: "The owl: bad omen or messenger?",
    excerpt: "Why is the owl feared? We asked the elders what is myth, and what carries real meaning.",
    category: "animals-nature",
    topic: "sacred-nature",
    county: "[County]",
    author: "Naomi",
    minutes: 6,
    color: "#C9DCE3",
  },
  {
    slug: "wildlife-of-kajiado",
    title: "The wildlife of Kajiado",
    excerpt: "[Jeff’s field notes on the animals and birds we recorded around Kajiado.]",
    category: "animals-nature",
    topic: "wildlife",
    county: "Kajiado",
    author: "Jeff",
    minutes: 7,
    color: "#B7C7A8",
  },
  {
    slug: "what-rainmakers-read",
    title: "What the rainmakers read in the sky",
    excerpt: "[An interview with a rainmaker on reading the sky, the wind and the birds.]",
    category: "history-culture",
    topic: "oral-history",
    county: "[County]",
    author: "Naomi",
    minutes: 9,
    color: "#E2C2B2",
  },
  {
    slug: "hares-and-hyenas",
    title: "Hares and hyenas: what our folktales teach",
    excerpt: "[The animals in our stories, and the lessons they were meant to carry.]",
    category: "history-culture",
    topic: "traditions-ceremonies",
    county: "[County]",
    author: "Naomi",
    minutes: 5,
    color: "#EBD9B4",
  },
  {
    slug: "clan-totems",
    title: "Clan totems and the animals that protect us",
    excerpt: "[How clans are bound to their animals, and what happens when those animals disappear.]",
    category: "history-culture",
    topic: "roots-identity",
    county: "[County]",
    author: "Naomi",
    minutes: 7,
    color: "#E8D3B8",
  },
  {
    slug: "the-healers-garden",
    title: "The healer’s garden",
    excerpt: "[Plants most of us have never heard of, and the healers who know them.]",
    category: "wellness",
    topic: "traditional-healing",
    county: "[County]",
    author: "Naomi",
    minutes: 6,
    color: "#D6DFC4",
  },
  {
    slug: "who-protects-sacred-groves",
    title: "Who protects the sacred groves?",
    excerpt: "[Forests protected for generations, and the people keeping them standing.]",
    category: "sustainability",
    topic: "conservation",
    county: "[County]",
    author: "Jeff",
    minutes: 6,
    color: "#BFD8C8",
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function articlesFor(category: string, topic?: string) {
  return articles.filter((a) => a.category === category && (!topic || a.topic === topic));
}

// ---------- Photography ----------

export type Gallery = { slug: string; title: string; county: string; kind: "gallery" | "photo-essay"; colors: string[] };

export const galleries: Gallery[] = [
  { slug: "kajiado-pilot", title: "Kajiado: the pilot trip", county: "Kajiado", kind: "gallery", colors: ["#D9D3C7", "#C9D6B8", "#E2C2B2", "#C9DCE3", "#EBD9B4", "#B7C7A8"] },
  { slug: "faces-of-the-elders", title: "[Photo essay title]", county: "[County]", kind: "photo-essay", colors: ["#E2C2B2", "#D9D3C7", "#E8D3B8", "#C9D6B8"] },
  { slug: "wildlife-and-land", title: "[Gallery title]", county: "[County]", kind: "gallery", colors: ["#B7C7A8", "#BFD8C8", "#C9DCE3", "#D6DFC4"] },
];

export const photoOfTheWeek = {
  title: "[Photo title]",
  text: "[Two or three sentences about who or what is in the photo, where it was taken, and the story behind it.]",
  county: "[County]",
};

// ---------- Events ----------

export type GaeEvent = {
  slug: string;
  type: "exhibitions" | "upcoming" | "competitions-clubs";
  kicker: string;
  title: string;
  day: string;
  month: string;
  meta: string;
  cta: string;
};

export const events: GaeEvent[] = [
  { slug: "photo-exhibition", type: "exhibitions", kicker: "PHOTO EXHIBITION", title: "[Event name]", day: "[DD]", month: "[MON]", meta: "[Place] · [Time]", cta: "REGISTER" },
  { slug: "nature-walk", type: "upcoming", kicker: "NATURE WALK", title: "[Event name]", day: "[DD]", month: "[MON]", meta: "[Place] · [Time]", cta: "REGISTER" },
  { slug: "essay-competition", type: "competitions-clubs", kicker: "ESSAY COMPETITION & CLUBS", title: "[Competition theme]", day: "•", month: "ONGOING", meta: "Online and in schools", cta: "JOIN" },
];

// ---------- People & places ----------

export const founders = [
  {
    name: "Naomi",
    role: "Co-founder · Culture, Roots & Identity",
    bio: "Naomi documents the cultures that live around the land: the beliefs, languages, ceremonies and stories of the communities we visit. [Add a few lines in your own words: who you are and why Gae matters to you.]",
    bg: "#E2C2B2",
  },
  {
    name: "Jeff",
    role: "Co-founder · Wildlife & Biodiversity",
    bio: "Jeff follows the wildlife and biodiversity in each place we visit, because when an animal or a forest disappears, a piece of our culture goes with it. [Add a few lines in Jeff’s own words.]",
    bg: "#C9D6B8",
  },
];

export const journey = [
  { stage: "PILOT · STARTING NOW", place: "Kajiado", text: "Close to home: where we learn how to listen and record well." },
  { stage: "NEXT", place: "Western Kenya", text: "Where our own identity and roots are." },
  { stage: "THEN", place: "All of Kenya", text: "Every county, every community willing to share." },
  { stage: "THE DREAM", place: "Africa", text: "The rest of the continent, piece by piece." },
];

export const whyNature = [
  { title: "Animal totems", text: "Clans are named for, and bound to, the animals that protect them." },
  { title: "Hares and hyenas", text: "Our folktales teach through the creatures we live beside." },
  { title: "Sacred trees", text: "Certain trees and groves are places of prayer and gathering." },
  { title: "Rainmakers", text: "Those who read the sky, the wind and the birds for the coming season." },
  { title: "Healers’ plants", text: "Medicines most of us have never heard of, known by name and use." },
];

/** Replace these with your real links. */
export const links = {
  buyMeACoffee: "https://www.buymeacoffee.com/[your-page]",
  donate: "[Donation link, e.g. M-Pesa paybill or PayPal]",
  youtube: "https://www.youtube.com/@[your-channel]",
  instagram: "https://www.instagram.com/[your-handle]",
  tiktok: "https://www.tiktok.com/@[your-handle]",
  email: "[hello@your-domain]",
};
