import type { Metadata } from "next";
import Link from "next/link";
import { ArticleGrid, NewsletterBlock, PageHero } from "@/components/blocks";
import { articleCategories, articles, articlesFor } from "@/lib/site";

export const metadata: Metadata = {
  title: "Articles · Gae Sugu",
  description: "Field notes, interviews and essays from across Kenya.",
};

export default function ArticlesPage() {
  return (
    <>
      <PageHero
        title="Articles"
        hand="field notes from the road"
        intro="Field notes, interviews and essays from each county we visit, about the land and the people who live with it."
        crumbs={[{ label: "Articles" }]}
      />
      <section className="container section stack-lg">
        <div className="section-head">
          <h2 className="display-sm">Latest</h2>
        </div>
        <ArticleGrid items={articles} />
      </section>
      {articleCategories.map((c) => {
        const items = articlesFor(c.slug);
        if (items.length === 0) return null;
        return (
          <section key={c.slug} className="container section-tight stack-lg">
            <div className="section-head split">
              <h2 className="display-sm">{c.label}</h2>
              <Link href={`/${c.slug}`} className="see-more">
                VIEW ALL
              </Link>
            </div>
            <ArticleGrid items={items} />
          </section>
        );
      })}
      <NewsletterBlock />
    </>
  );
}
