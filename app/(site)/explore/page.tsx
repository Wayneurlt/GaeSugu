import type { Metadata } from "next";
import Link from "next/link";
import { ArticleGrid, Journey, NewsletterBlock, PageHero } from "@/components/blocks";
import Photo from "@/components/photo";
import { getSite } from "@/lib/site";

export const metadata: Metadata = {
  title: "Explore Africa · Gae Sugu",
  description: "Africa, piece by piece. Our first journey starts in Kajiado, then western Kenya, then the rest of the continent.",
};

export default async function ExplorePage() {
  const { articlesFor, pages, regions } = await getSite();
  return (
    <>
      <PageHero
        eyebrow="EXPLORE AFRICA"
        title={pages.explore.title}
        hand={pages.explore.hand}
        intro={pages.explore.intro}
        color="#C9DCE3"
        crumbs={[{ label: "Explore Africa" }]}
      />

      <section id="east-africa" className="container section stack-lg">
        <div className="section-head">
          <h2 className="display-sm">{pages.explore.eastAfricaTitle}</h2>
          <Link href="/travel/field-notes" className="see-more">
            ALL FIELD NOTES
          </Link>
        </div>
        <ArticleGrid items={articlesFor("travel", "field-notes")} />
        <Link href="/photography/gallery/kajiado-pilot" className="underline-link" style={{ alignSelf: "flex-start" }}>
          See the Kajiado pilot gallery
        </Link>
      </section>

      <section className="bg-cream">
        <Journey />
      </section>

      <section id="regions" className="container section stack-lg">
        <div className="section-head">
          <h2 className="display-sm">{pages.explore.regionsTitle}</h2>
          <span className="hand">{pages.explore.regionsHand}</span>
        </div>
        <div className="article-grid">
          {regions.map((r) => (
            <div key={r.slug} id={r.slug} className="article-card">
              <Photo id={r.photo} decorative className="article-card-photo" sizes="(max-width: 700px) 100vw, 400px" style={{ background: r.bg }} />
              <span className="kicker">COMING LATER</span>
              <span className="card-title-lg">{r.name}</span>
              <span className="muted small">{r.text}</span>
            </div>
          ))}
        </div>
        <p className="muted" style={{ margin: 0 }}>
          Know a community we should visit?{" "}
          <Link href="/contact?topic=visit" className="underline-link">
            Tell us
          </Link>
          .
        </p>
      </section>

      <NewsletterBlock />
    </>
  );
}
