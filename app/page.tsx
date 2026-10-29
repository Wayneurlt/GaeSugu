import Link from "next/link";
import {
  EventList,
  Founders,
  Journey,
  NewsletterBlock,
  SupportBlock,
  WhyNature,
} from "@/components/blocks";
import { articles, events, getCategory, photoOfTheWeek } from "@/lib/site";

const keepCards = [
  { title: "Articles", text: "Field notes from each county we visit.", href: "/articles", bg: "#C9D6B8" },
  { title: "Photography", text: "People, places and ceremonies.", href: "/photography", bg: "#C9DCE3" },
  { title: "Events", text: "Exhibitions, nature walks, essays and clubs.", href: "/events", bg: "#EBD9B4" },
  { title: "The Archive", text: "Voices, photographs and journals.", href: "/archive", bg: "#E8D3B8" },
  { title: "Sacred Nature", text: "Nature once feared, brought back into the light.", href: "/animals-nature/sacred-nature", bg: "#B7C7A8" },
  { title: "Sustainability", text: "Conservation and caring for the land.", href: "/sustainability", bg: "#BFD8C8" },
  { title: "Roots & Identity", text: "What it means to be African today.", href: "/history-culture/roots-identity", bg: "#E2C2B2" },
  { title: "Living Well", text: "Food from the land, walking, rest by the fire.", href: "/wellness", bg: "#D6DFC4" },
];

const gallery = [
  { label: "[PHOTO: portrait]", bg: "#D9D3C7", fg: "#4A4238", tall: true },
  { label: "[PHOTO: landscape]", bg: "#C9D6B8", fg: "#3E4A36" },
  { label: "[PHOTO: ceremony]", bg: "#E2C2B2", fg: "#5A3A2C", tall: true },
  { label: "[PHOTO: market]", bg: "#C9DCE3", fg: "#2E3A40" },
  { label: "[PHOTO: hands at work]", bg: "#EBD9B4", fg: "#5A4A3C" },
  { label: "[PHOTO: nature]", bg: "#B7C7A8", fg: "#3E4A36" },
];

const natureCards = [
  { title: "The owl", text: "A bad omen, or a messenger? What the elders say.", href: "/articles/the-owl-omen-or-messenger" },
  { title: "Sacred groves", text: "Forests protected for generations.", href: "/articles/who-protects-sacred-groves" },
  { title: "Healing plants", text: "Knowledge passed down by grandmothers.", href: "/animals-nature/plants-healing" },
];

const sustainCards = [
  { kicker: "CONSERVATION", title: "Who protects the sacred groves?", text: "Communities protecting forests, rivers and wildlife.", bg: "#BFD8C8", href: "/sustainability/conservation" },
  { kicker: "LAND & CLIMATE", title: "[Story title]", text: "How traditional knowledge cares for the land.", bg: "#D6DFC4", href: "/sustainability/climate-land" },
  { kicker: "COMMUNITY PROJECTS", title: "[Project name]", text: "Tree planting, clean-ups and projects we support.", bg: "#E8D3B8", href: "/sustainability/community-projects" },
];

const featured = ["kajiado-first-trip", "the-owl-omen-or-messenger"]
  .map((slug) => articles.find((a) => a.slug === slug))
  .filter((a) => a !== undefined);

const more = ["what-rainmakers-read", "clan-totems", "hares-and-hyenas", "the-healers-garden"]
  .map((slug) => articles.find((a) => a.slug === slug))
  .filter((a) => a !== undefined);

const moreColors = ["#3E4A3A", "#5A4636", "#3A4A52", "#4A5A3E"];

export default function Home() {
  return (
    <div className="page">
      <section id="top" className="hero">
        <span className="placeholder-note light">[FULL-WIDTH PHOTO: Kajiado landscape from the pilot trip]</span>
      </section>

      <section id="about" className="bg-forest">
        <div className="container narrow center stack-lg about">
          <h1 className="display-xl">Imagine keeping all of Africa’s stories.</h1>
          <div className="gold-rule" />
          <div className="lead">
            <span className="italic">Gae /[pronunciation]/</span>
            <span>“a broken piece of a pot” in English, from [language]</span>
          </div>
          <p className="lead">
            That is how African knowledge feels today: fragmented and scattered, with pieces of our stories, languages
            and traditions quietly disappearing.
          </p>
          <p className="lead">
            Gae is our attempt to pick those pieces back up and put them together in a living digital archive, so they
            are not lost for good.
          </p>
          <p className="lead">
            Karibu Gae. <strong>Karibu nyumbani.</strong>
          </p>
          <Link href="/about" className="see-more">
            OUR STORY
          </Link>
        </div>
      </section>

      <WhyNature />

      <section id="work" className="bg-cream">
        <div className="container section stack-xl">
          <div className="center stack-xs">
            <h2 className="display-md terracotta">What we keep</h2>
            <span className="hand">from every place we visit</span>
          </div>
          <div className="keep-grid">
            {keepCards.map((c) => (
              <Link key={c.title} href={c.href} className="keep-card">
                <div className="arch" style={{ background: c.bg }} />
                <span className="card-title">{c.title}</span>
                <span className="muted small">{c.text}</span>
              </Link>
            ))}
          </div>
        </div>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true" className="mountains">
          <path
            d="M0 120 L0 92 L180 40 L300 78 L470 14 L640 84 L780 52 L930 96 L1100 30 L1260 80 L1440 48 L1440 120 Z"
            fill="#FFFFFF"
          />
        </svg>
      </section>

      <Journey />

      <section id="stories" className="container mid stories">
        <div className="section-head">
          <h2 className="display-sm">Articles</h2>
        </div>
        {featured.map((a) => (
          <Link key={a.slug} href={`/articles/${a.slug}`} className="article">
            <div className="photo" style={{ background: a.color, height: 520 }}>
              <span className="placeholder-note muted">[PHOTO]</span>
            </div>
            <span className="kicker">{getCategory(a.category)?.label.toUpperCase()}</span>
            <span className="article-title">{a.title}</span>
            <span className="byline">
              By {a.author} | {a.county} | {a.minutes} mins
            </span>
          </Link>
        ))}
        <Link href="/articles" className="see-more">
          SEE MORE
        </Link>
      </section>

      <section id="potw" className="potw">
        <div className="container potw-inner">
          <span className="placeholder-note light potw-note">[FULL-WIDTH PHOTO: your best photo this week]</span>
          <span className="potw-label">PHOTO OF THE WEEK</span>
          <h2 className="potw-title">{photoOfTheWeek.title}</h2>
          <p className="potw-text">{photoOfTheWeek.text}</p>
          <Link href="/photography/photo-of-the-week" className="btn btn-ghost">
            SEE MORE PHOTOS
          </Link>
        </div>
      </section>

      <section id="photography" className="bg-cream">
        <div className="container section stack-lg">
          <div className="section-head split">
            <h2 className="display-sm">Photography</h2>
            <span className="hand terracotta">through our lens</span>
          </div>
          <div className="gallery">
            {gallery.map((g) => (
              <div key={g.label} className={`photo${g.tall ? " tall" : ""}`} style={{ background: g.bg }}>
                <span className="placeholder-note" style={{ color: g.fg }}>
                  {g.label}
                </span>
              </div>
            ))}
          </div>
          <div className="split">
            <span className="italic muted">Gallery: Kajiado, the pilot trip</span>
            <Link href="/photography/galleries" className="see-more">
              ALL GALLERIES
            </Link>
          </div>
        </div>
      </section>

      <section id="nature" className="nature">
        <svg viewBox="0 0 1440 300" preserveAspectRatio="none" aria-hidden="true" className="nature-waves">
          <path
            d="M-20 80 C 160 10, 260 170, 440 90 S 760 0, 920 110 S 1240 190, 1460 60"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="26"
            strokeLinecap="round"
          />
          <path
            d="M-20 210 C 200 150, 330 280, 560 200 S 960 120, 1140 230 S 1340 260, 1460 190"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="18"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
        <div className="container nature-inner">
          <div className="nature-copy">
            <span className="eyebrow" style={{ color: "#2E3A40" }}>
              SACRED NATURE
            </span>
            <h2 className="nature-title">Bringing nature back into the light.</h2>
            <p style={{ fontSize: 21, color: "#23303A", margin: 0 }}>
              Why is the owl a bad omen? Why must some trees never be cut? We go back to the people who know, and work
              out what is myth and what carries real meaning, for animals, plants and places once honoured and later
              feared or misunderstood.
            </p>
          </div>
          <div className="nature-list">
            <p className="nature-quote">“What the elders honoured, we were taught to fear.”</p>
            {natureCards.map((c) => (
              <Link key={c.title} href={c.href} className="nature-card">
                <span className="nature-card-title">{c.title}</span>
                <span className="muted small">{c.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="sustainability" className="container section stack-lg">
        <div className="section-head split">
          <h2 className="display-sm">Sustainability</h2>
          <span className="hand" style={{ color: "#3E6B4A" }}>
            caring for the land that keeps us
          </span>
        </div>
        <div className="sustain-grid">
          {sustainCards.map((c) => (
            <Link key={c.kicker} href={c.href} className="stack-sm">
              <div style={{ height: 260, background: c.bg }} />
              <span className="kicker" style={{ color: "#3E6B4A" }}>
                {c.kicker}
              </span>
              <span className="card-title-lg">{c.title}</span>
              <span className="muted small">{c.text}</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="more" className="bg-ink">
        <div className="container more">
          <h2 className="more-title">MORE</h2>
          <div className="carousel">
            {more.map((a, i) => (
              <Link key={a.slug} href={`/articles/${a.slug}`} className="carousel-card">
                <div style={{ height: 300, background: moreColors[i % moreColors.length] }} />
                <span className="kicker" style={{ color: "#D8CFC2", letterSpacing: "0.28em" }}>
                  {getCategory(a.category)?.label.toUpperCase()}
                </span>
                <span className="card-title-lg">{a.title}</span>
              </Link>
            ))}
          </div>
          <Link href="/articles" className="see-more">
            SEE MORE
          </Link>
        </div>
      </section>

      <section id="identity" className="bg-cream">
        <div className="container identity">
          <div className="identity-photo">
            <span className="placeholder-note" style={{ color: "#5A3A2C" }}>
              [PHOTO: portrait of Naomi]
            </span>
          </div>
          <div className="identity-copy">
            <span className="eyebrow terracotta">ROOTS &amp; IDENTITY</span>
            <h2 className="identity-title">Who are we when we tell our own story?</h2>
            <p className="muted" style={{ margin: 0 }}>
              Essays on African identity: names, language, faith, dress, memory, and what it means to be African today.
            </p>
            <span className="hand-lg terracotta">Naomi</span>
            <Link href="/articles/clan-totems" className="underline-link">
              Read: Clan totems and the animals that protect us
            </Link>
          </div>
        </div>
      </section>

      <section id="events" className="bg-forest">
        <div className="container events">
          <div className="stack-sm">
            <h2 className="display-sm">Events</h2>
            <div className="gold-rule short" />
            <p style={{ margin: 0, color: "#E9EDE4" }}>
              Come and gather with us: exhibitions, nature walks, storytelling evenings and essay competitions.
            </p>
          </div>
          <EventList items={events} />
          <Link href="/events" className="see-more" style={{ alignSelf: "flex-start" }}>
            ALL EVENTS
          </Link>
        </div>
      </section>

      <NewsletterBlock />
      <Founders />
      <SupportBlock />
    </div>
  );
}
