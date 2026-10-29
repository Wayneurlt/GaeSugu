import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleGrid, SupportBlock } from "@/components/blocks";
import { articles, articlesFor, getArticle, getCategory } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle((await params).slug);
  return { title: article ? `${article.title} · Gae Sugu` : "Gae Sugu", description: article?.excerpt };
}

export default async function ArticlePage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  const category = getCategory(article.category);
  const topic = category?.topics.find((t) => t.slug === article.topic);
  const related = articlesFor(article.category)
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <>
      <article className="container mid article-page">
        <nav aria-label="Breadcrumb" className="crumbs">
          <Link href="/">Home</Link> / <Link href={`/${article.category}`}>{category?.label}</Link>
          {topic && (
            <>
              {" "}
              / <Link href={`/${article.category}/${topic.slug}`}>{topic.label}</Link>
            </>
          )}
        </nav>
        <header className="center stack-sm">
          <span className="kicker">{(topic?.label ?? category?.label ?? "").toUpperCase()}</span>
          <h1 className="article-title">{article.title}</h1>
          <p className="lead muted" style={{ maxWidth: 680 }}>
            {article.excerpt}
          </p>
          <span className="byline">
            By {article.author} | {article.county} | {article.minutes} mins
          </span>
        </header>
        <div className="photo" style={{ background: article.color, height: 480 }}>
          <span className="placeholder-note muted">[LEAD PHOTO + caption]</span>
        </div>
        <div className="prose">
          <p>[Opening paragraph: set the scene. Where are we, who are we with, and why does this matter?]</p>
          <p>[The story: what we saw and heard. Quote the people we spoke with in their own words.]</p>
          <blockquote>“[A quote from an elder, healer, rainmaker or artisan.]”</blockquote>
          <h2>[Subheading]</h2>
          <p>[Myth or meaning? What the belief says, where it comes from, and what it tells us about the land.]</p>
          <p>[Closing: what we are keeping from this place, and what we still want to learn.]</p>
          <p className="muted small">
            <em>Recorded in {article.county}. Interviews shared with permission. [Add notes on language, consent and sources.]</em>
          </p>
        </div>
      </article>
      {related.length > 0 && (
        <section className="bg-cream">
          <div className="container section stack-lg">
            <div className="section-head split">
              <h2 className="display-sm">More from {category?.label}</h2>
              <Link href={`/${article.category}`} className="see-more">
                VIEW ALL
              </Link>
            </div>
            <ArticleGrid items={related} />
          </div>
        </section>
      )}
      <SupportBlock />
    </>
  );
}
