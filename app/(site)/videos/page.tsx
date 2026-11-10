import Photo from "@/components/photo";
import type { Metadata } from "next";
import { NewsletterBlock, PageHero } from "@/components/blocks";
import { getSite } from "@/lib/site";

export const metadata: Metadata = {
  title: "Videos · Gae Sugu",
  description: "Interviews and films from the road, on YouTube.",
};

export default async function VideosPage() {
  const { links, pages } = await getSite();
  return (
    <>
      <PageHero
        title={pages.videos.title}
        hand={pages.videos.hand}
        intro={pages.videos.intro}
        crumbs={[{ label: "Videos" }]}
      />
      <section className="container section stack-lg">
        <div className="article-grid">
          {pages.videos.items.map((v, i) => (
            <a key={i} href={v.href} className="article-card">
              <div className="video-thumb" style={{ background: "#3E4A3A", position: "relative", overflow: "hidden" }}>
                <Photo id={v.photo} decorative sizes="(max-width: 700px) 100vw, 400px" style={{ position: "absolute", inset: 0 }} />
                <span aria-hidden="true">▶</span>
              </div>
              <span className="kicker">YOUTUBE</span>
              <span className="card-title-lg">{v.title}</span>
            </a>
          ))}
        </div>
        <a href={links.youtube} className="see-more">
          SUBSCRIBE ON YOUTUBE
        </a>
      </section>
      <NewsletterBlock />
    </>
  );
}
