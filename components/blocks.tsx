import Link from "next/link";
import { LogoMark } from "./Logo";
import {
  type Article,
  type GaeEvent,
  type Topic,
  founders,
  getCategory,
  journey,
  links,
  whyNature,
} from "@/lib/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container center stack-md">
        <Link href="/" className="footer-brand" aria-label="Gae Sugu home">
          <LogoMark size={36} />
          <span className="logo-word" style={{ fontSize: 26 }}>
            GAE SUGU
          </span>
        </Link>
        <nav aria-label="Footer" className="footer-nav">
          <Link href="/about">About</Link>
          <Link href="/articles">Articles</Link>
          <Link href="/archive">Archive</Link>
          <Link href="/founders">Founders</Link>
          <Link href="/support">Support</Link>
          <Link href="/newsletter">Newsletter</Link>
          <Link href="/contact">Contact</Link>
          <a href={links.youtube}>YouTube</a>
          <a href={links.instagram}>Instagram</a>
          <a href={links.tiktok}>TikTok</a>
        </nav>
        <span style={{ fontSize: 17, color: "#5A4A3C" }}>© 2026 Gae Sugu</span>
      </div>
    </footer>
  );
}

type Crumb = { label: string; href?: string };

export function PageHero({
  eyebrow,
  title,
  intro,
  hand,
  color = "var(--cream)",
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  hand?: string;
  color?: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="page-hero" style={{ background: color }}>
      <div className="container page-hero-inner">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="crumbs">
            <Link href="/">Home</Link>
            {crumbs.map((c) => (
              <span key={c.label}>
                <span aria-hidden="true"> / </span>
                {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && <span className="eyebrow terracotta">{eyebrow}</span>}
        <h1 className="display-lg">{title}</h1>
        {hand && <span className="hand">{hand}</span>}
        {intro && <p className="page-hero-intro">{intro}</p>}
      </div>
    </section>
  );
}

export function TopicChips({ base, topics, active }: { base: string; topics: Topic[]; active?: string }) {
  return (
    <nav aria-label="Topics" className="chips">
      <Link href={base} className={`chip${!active ? " is-active" : ""}`}>
        All
      </Link>
      {topics.map((t) => (
        <Link key={t.slug} href={`${base}/${t.slug}`} className={`chip${active === t.slug ? " is-active" : ""}`}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  const category = getCategory(article.category);
  const topic = category?.topics.find((t) => t.slug === article.topic);
  return (
    <Link href={`/articles/${article.slug}`} className="article-card">
      <div className="article-card-photo" style={{ background: article.color }} />
      <span className="kicker">{(topic?.label ?? category?.label ?? "").toUpperCase()}</span>
      <span className="card-title-lg">{article.title}</span>
      <span className="muted small">{article.excerpt}</span>
      <span className="byline small">
        By {article.author} | {article.county} | {article.minutes} mins
      </span>
    </Link>
  );
}

export function ArticleGrid({ items, empty }: { items: Article[]; empty?: string }) {
  if (items.length === 0) {
    return (
      <div className="empty">
        <span className="hand terracotta">coming soon</span>
        <p className="muted" style={{ margin: 0 }}>
          {empty ?? "The first stories here are on their way from the road. Sign up to hear when they are published."}
        </p>
        <Link href="/newsletter" className="see-more" style={{ alignSelf: "flex-start" }}>
          GET THE NEWSLETTER
        </Link>
      </div>
    );
  }
  return (
    <div className="article-grid">
      {items.map((a) => (
        <ArticleCard key={a.slug} article={a} />
      ))}
    </div>
  );
}

export function EventList({ items }: { items: GaeEvent[] }) {
  return (
    <div className="event-list">
      {items.map((e) => (
        <div key={e.slug} className="event">
          <div className="event-date">
            <span className="event-day">{e.day}</span>
            <span className="event-month">{e.month}</span>
          </div>
          <div className="event-body">
            <span className="event-kicker">{e.kicker}</span>
            <span className="card-title-lg">{e.title}</span>
            <span style={{ color: "#E9EDE4" }}>{e.meta}</span>
          </div>
          <Link href="/contact" className="event-cta">
            {e.cta}
          </Link>
        </div>
      ))}
    </div>
  );
}

export function WhyNature() {
  return (
    <section className="container section why-nature">
      <div className="why-copy">
        <span className="eyebrow terracotta">WHY NATURE</span>
        <h2 className="display-md">In Africa, you cannot separate people from the land.</h2>
        <p className="muted" style={{ margin: 0 }}>
          When an animal or a forest disappears, a piece of our culture goes with it. So we document both: Jeff follows
          the wildlife and biodiversity, and Naomi records the cultures that live around them.
        </p>
        <span className="hand terracotta">a Nat Geo for Africa, told by Africans</span>
      </div>
      <ul className="why-list">
        {whyNature.map((w) => (
          <li key={w.title}>
            <span className="card-title">{w.title}</span>
            <span className="muted small">{w.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Journey() {
  return (
    <section className="container section stack-lg">
      <div className="section-head split">
        <h2 className="display-sm">The journey</h2>
        <span className="hand terracotta">one county at a time</span>
      </div>
      <ol className="route">
        {journey.map((j, i) => (
          <li key={j.place} className={`stop${i === 0 ? " is-current" : ""}`}>
            <span className="stop-dot" aria-hidden="true" />
            <span className="kicker">{j.stage}</span>
            <span className="card-title-lg">{j.place}</span>
            <span className="muted small">{j.text}</span>
          </li>
        ))}
      </ol>
      <div className="who">
        <span className="kicker">ON THE ROAD WE SIT WITH</span>
        <p className="who-list">Elders · Healers · Rainmakers · Artisans · Storytellers · Young people</p>
        <p className="muted" style={{ margin: 0 }}>
          We interview them, photograph their communities and the wildlife around them, and keep proper records of
          artefacts and indigenous knowledge.
        </p>
      </div>
    </section>
  );
}

export function Founders({ withHeading = true }: { withHeading?: boolean }) {
  return (
    <section className="container mid founders">
      {withHeading && (
        <div className="section-head">
          <h2 className="display-sm">Our Founders</h2>
        </div>
      )}
      {founders.map((f, i) => (
        <div key={f.name} className={`founder${i > 0 ? " divided" : ""}`}>
          <div className="founder-photo" style={{ background: f.bg }} />
          <div className="founder-body">
            <span className="card-title-xl">{f.name}</span>
            <span className="italic terracotta">{f.role}</span>
            <p className="muted" style={{ margin: "8px 0 0" }}>
              {f.bio}
            </p>
            <p className="muted" style={{ margin: 0 }}>
              <em>Favourite place in Kenya:</em> [place]
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}

export function NewsletterBlock() {
  return (
    <section className="newsletter">
      <div className="container newsletter-inner">
        <h2 className="newsletter-title">STORIES FROM HOME, IN YOUR INBOX</h2>
        <p className="newsletter-text">New articles, photo essays and event invites from across Kenya. Free, once a month.</p>
        <form className="newsletter-form">
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input id="email" type="email" placeholder="Your email address" />
          <button type="button">SIGN UP</button>
        </form>
      </div>
    </section>
  );
}

export function SupportBlock() {
  return (
    <section className="bg-terracotta">
      <div className="container mid center stack-md support">
        <h2 className="display-lg">Help us keep the record.</h2>
        <p className="lead" style={{ maxWidth: 620 }}>
          Every trip, interview and photograph is made possible by people like you.
        </p>
        <div className="support-cta">
          <Link href="/support" className="btn btn-white">
            BUY US A COFFEE
          </Link>
          <Link href="/support" className="btn btn-outline-white">
            DONATE
          </Link>
        </div>
      </div>
    </section>
  );
}
