import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArticleGrid, NewsletterBlock, PageHero, TopicChips } from "@/components/blocks";
import { getSite } from "@/lib/site";

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  const { articleCategories } = await getSite();
  return articleCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { getCategory } = await getSite();
  const category = getCategory((await params).category);
  return { title: category ? `${category.label} · Gae Sugu` : "Gae Sugu", description: category?.intro };
}

export default async function CategoryPage({ params }: Props) {
  const { articlesFor, getCategory } = await getSite();
  const category = getCategory((await params).category);
  if (!category) notFound();
  const base = `/${category.slug}`;

  return (
    <>
      <PageHero
        title={category.label}
        hand={category.tagline}
        intro={category.intro}
        color={category.color}
        crumbs={[{ label: category.label }]}
      />
      <section className="container section stack-lg">
        <TopicChips base={base} topics={category.topics} />
        <ArticleGrid items={articlesFor(category.slug)} />
      </section>
      <section className="bg-cream">
        <div className="container section stack-lg">
          <div className="section-head">
            <h2 className="display-sm">Explore {category.label}</h2>
          </div>
          <div className="topic-grid">
            {category.topics.map((t) => (
              <Link key={t.slug} href={`${base}/${t.slug}`} className="topic-card">
                <span className="card-title-lg">{t.label}</span>
                <span className="muted small">{t.intro}</span>
                <span className="kicker">{articlesFor(category.slug, t.slug).length} STORIES →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <NewsletterBlock />
    </>
  );
}
