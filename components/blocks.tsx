import Link from "next/link";
import type { ReactNode } from "react";
import Photo from "./photo";
import { type Article, type GaeEvent, type Topic } from "@/lib/site";
import { getSite } from "@/lib/site";

export async function Footer() {
  const { links, settings } = await getSite();
  return (
    <footer id="contact" className="footer">
      <div className="container center stack-md">
        <span className="logo-word" style={{ fontSize: 30 }}>
          GAE
        </span>
        <nav aria-label="Footer" className="footer-nav">
          <Link href="/explore">Explore Africa</Link>
          <Link href="/history-culture">Culture &amp; Heritage</Link>
          <Link href="/animals-nature">Biodiversity</Link>
          <Link href="/diaspora">Diaspora</Link>
          <Link href="/archive">Archive</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/support">Support</Link>
          <a href={links.instagram}>Instagram</a>
          <a href={links.tiktok}>TikTok</a>
          <a href={links.youtube}>YouTube</a>
        </nav>
        <span style={{ fontSize: 17, color: "#5A4A3C" }}>{settings.footer.note}</span>
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

export async function ArticleCard({ article }: { article: Article }) {
  const { getCategory } = await getSite();
  const category = getCategory(article.category);
  const topic = category?.topics.find((t) => t.slug === article.topic);
  return (
    <Link href={`/articles/${article.slug}`} className="article-card">
      {article.photo ? (
        <Photo
          id={article.photo}
          className="article-card-photo"
          sizes="(max-width: 900px) 100vw, 400px"
          style={{ background: article.color }}
        />
      ) : (
        <div className="article-card-photo" style={{ background: article.color }} />
      )}
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
          <Link href="/contact?topic=event" className="event-cta">
            {e.cta}
          </Link>
        </div>
      ))}
    </div>
  );
}

export async function WhyNature() {
  const { whyNature, whyNatureIntro } = await getSite();
  return (
    <section className="container section why-nature">
      <div className="why-copy">
        <span className="eyebrow terracotta">{whyNatureIntro.kicker}</span>
        <h2 className="display-md">{whyNatureIntro.title}</h2>
        <p className="muted" style={{ margin: 0 }}>
          {whyNatureIntro.text}
        </p>
        <span className="hand terracotta">{whyNatureIntro.hand}</span>
      </div>
      <ul className="why-list">
        {whyNature.map((w, i) => (
          <li key={i}>
            <span className="card-title">{w.title}</span>
            <span className="muted small">{w.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export async function Journey() {
  const { journey, journeyIntro } = await getSite();
  return (
    <section className="container section stack-lg">
      <div className="section-head split">
        <h2 className="display-sm">{journeyIntro.title}</h2>
        <span className="hand terracotta">{journeyIntro.hand}</span>
      </div>
      <ol className="route">
        {journey.map((j, i) => (
          <li key={i} className={`stop${i === 0 ? " is-current" : ""}`}>
            <span className="stop-dot" aria-hidden="true" />
            <span className="kicker">{j.stage}</span>
            <span className="card-title-lg">{j.place}</span>
            <span className="muted small">{j.text}</span>
          </li>
        ))}
      </ol>
      <div className="who">
        <span className="kicker">{journeyIntro.whoKicker}</span>
        <p className="who-list">{journeyIntro.whoList}</p>
        <p className="muted" style={{ margin: 0 }}>
          {journeyIntro.whoText}
        </p>
      </div>
    </section>
  );
}

export async function Founders({ withHeading = true }: { withHeading?: boolean }) {
  const { founders } = await getSite();
  return (
    <section className="container mid founders">
      {withHeading && (
        <div className="section-head">
          <h2 className="display-sm">Our Founders</h2>
        </div>
      )}
      {founders.map((f, i) => (
        <div key={i} className={`founder${i > 0 ? " divided" : ""}`}>
          <Photo id={f.photo} decorative className="founder-photo" sizes="200px" style={{ background: f.bg }} />
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

export async function NewsletterBlock() {
  const { settings } = await getSite();
  return (
    <section className="newsletter">
      <div className="container newsletter-inner">
        <h2 className="newsletter-title">{settings.newsletterBlock.title}</h2>
        <p className="newsletter-text">{settings.newsletterBlock.text}</p>
        <form className="newsletter-form">
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input id="email" type="email" placeholder="Your email address" />
          <button type="button">{settings.newsletterBlock.button}</button>
        </form>
      </div>
    </section>
  );
}

export async function SupportBlock() {
  const { links, settings } = await getSite();
  return (
    <section className="bg-terracotta">
      <div className="container mid center stack-md support">
        <h2 className="display-lg">{settings.supportBlock.title}</h2>
        <p className="lead" style={{ maxWidth: 620 }}>
          {settings.supportBlock.text}
        </p>
        <div className="support-cta">
          <a href={links.buyMeACoffee} className="btn btn-white">
            {settings.supportBlock.coffeeButton}
          </a>
          <Link href="/support#donate" className="btn btn-outline-white">
            {settings.supportBlock.donateButton}
          </Link>
        </div>
      </div>
    </section>
  );
}

export const contactTopics = {
  story: "I have a story or knowledge to share",
  work: "Photographs, writing or research to submit",
  visit: "A place you should visit",
  event: "Events and schools",
  partner: "Partnerships and press",
  other: "Something else",
};

export type ContactTopic = keyof typeof contactTopics;

export function isContactTopic(value: unknown): value is ContactTopic {
  return typeof value === "string" && value in contactTopics;
}

export function ContactForm({ topic = "story", extra }: { topic?: ContactTopic; extra?: ReactNode }) {
  return (
    <form className="contact-form">
      <label>
        Name
        <input type="text" name="name" autoComplete="name" />
      </label>
      <label>
        Email
        <input type="email" name="email" autoComplete="email" />
      </label>
      <label>
        What is it about?
        <select name="topic" defaultValue={topic}>
          {Object.entries(contactTopics).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      {extra}
      <label>
        Message
        <textarea name="message" rows={6} />
      </label>
      <button type="button" className="btn btn-solid">
        SEND
      </button>
    </form>
  );
}

/**
 * Renders article text written in the admin. Blank lines separate paragraphs,
 * a line starting "## " is a subheading and one starting "> " is a quote.
 */
export function Prose({ text }: { text: string }) {
  const blocks = text
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  return (
    <>
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) return <h2 key={i}>{block.slice(3)}</h2>;
        if (block.startsWith("> ")) return <blockquote key={i}>{block.replace(/^> ?/gm, "")}</blockquote>;
        return <p key={i}>{block}</p>;
      })}
    </>
  );
}
