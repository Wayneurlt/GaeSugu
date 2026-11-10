import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/photo";
import { notFound } from "next/navigation";
import { ArticleGrid, Prose, SupportBlock } from "@/components/blocks";
import { getSite } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { articles } = await getSite();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { getArticle } = await getSite();
  const article = getArticle((await params).slug);
  return { title: article ? `${article.title} · Gae Sugu` : "Gae Sugu", description: article?.excerpt };
}

export default async function ArticlePage({ params }: Props) {
  const { articlesFor, getArticle, getCategory } = await getSite();
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
        {article.photo ? (
          <Photo id={article.photo} priority sizes="(max-width: 960px) 100vw, 920px" style={{ background: article.color, height: 480 }} />
        ) : (
          <div className="photo" style={{ background: article.color, height: 480 }}>
            <span className="placeholder-note muted">[LEAD PHOTO + caption]</span>
          </div>
        )}
        <div className="prose">
          <Prose text={article.body} />
          {article.note && (
            <p className="muted small">
              <em>{article.note}</em>
            </p>
          )}
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
