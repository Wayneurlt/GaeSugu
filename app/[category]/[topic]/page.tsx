import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleGrid, NewsletterBlock, PageHero, TopicChips } from "@/components/blocks";
import { articleCategories, articlesFor, getCategory, getTopic } from "@/lib/site";

type Props = { params: Promise<{ category: string; topic: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return articleCategories.flatMap((c) => c.topics.map((t) => ({ category: c.slug, topic: t.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, topic } = await params;
  const t = getTopic(category, topic);
  return { title: t ? `${t.label} · Gae Sugu` : "Gae Sugu", description: t?.intro };
}

export default async function TopicPage({ params }: Props) {
  const { category: categorySlug, topic: topicSlug } = await params;
  const category = getCategory(categorySlug);
  const topic = getTopic(categorySlug, topicSlug);
  if (!category || !topic) notFound();

  return (
    <>
      <PageHero
        eyebrow={category.label.toUpperCase()}
        title={topic.label}
        intro={topic.intro}
        color={category.color}
        crumbs={[{ label: category.label, href: `/${category.slug}` }, { label: topic.label }]}
      />
      <section className="container section stack-lg">
        <TopicChips base={`/${category.slug}`} topics={category.topics} active={topic.slug} />
        <ArticleGrid items={articlesFor(category.slug, topic.slug)} />
      </section>
      <NewsletterBlock />
    </>
  );
}
