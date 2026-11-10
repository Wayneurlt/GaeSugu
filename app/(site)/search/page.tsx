import type { Metadata } from "next";
import Link from "next/link";
import { ArticleGrid, PageHero } from "@/components/blocks";
import { getSite } from "@/lib/site";

export const metadata: Metadata = {
  title: "Search · Gae Sugu",
  description: "Search stories, topics and sections across the archive.",
};

/** Matches whole words or word starts, so "owl" finds owls but not "knowledge". */
const matches = (q: string, ...fields: string[]) => {
  const word = new RegExp(`\\b${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i");
  return fields.some((f) => word.test(f));
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { articles, categories } = await getSite();
  const query = ((await searchParams).q ?? "").trim();
  const q = query.toLowerCase();
  const foundArticles = q ? articles.filter((a) => matches(q, a.title, a.excerpt)) : [];
  const foundTopics = q
    ? categories.flatMap((c) =>
        [{ href: `/${c.slug}`, label: c.label, intro: c.intro, matched: matches(q, c.label, c.intro) }]
          .concat(c.topics.map((t) => ({ href: `/${c.slug}/${t.slug}`, label: t.label, intro: t.intro, matched: matches(q, t.label, t.intro) })))
          .filter((x) => x.matched),
      )
    : [];

  return (
    <>
      <PageHero title="Search" hand="find a piece" crumbs={[{ label: "Search" }]} />
      <section className="container section stack-lg">
        <form action="/search" className="search-form" role="search">
          <label htmlFor="q" className="sr-only">
            Search the archive
          </label>
          <input id="q" name="q" type="search" defaultValue={query} placeholder="Owls, rainmakers, Kajiado…" autoFocus />
          <button type="submit" className="btn btn-solid">
            SEARCH
          </button>
        </form>

        {q && (
          <>
            {foundTopics.length > 0 && (
              <div className="stack-md">
                <h2 className="display-sm">Sections</h2>
                <div className="topic-grid">
                  {foundTopics.map((t) => (
                    <Link key={t.href} href={t.href} className="topic-card">
                      <span className="card-title-lg">{t.label}</span>
                      <span className="muted small">{t.intro}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <div className="stack-md">
              <h2 className="display-sm">Stories</h2>
              <ArticleGrid items={foundArticles} empty={`Nothing yet for “${query}”. Try another word.`} />
            </div>
          </>
        )}
      </section>
    </>
  );
}
