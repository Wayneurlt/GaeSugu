import type { Metadata } from "next";
import { NewsletterBlock, PageHero } from "@/components/blocks";
import { links } from "@/lib/site";

export const metadata: Metadata = {
  title: "Videos · Gae Sugu",
  description: "Interviews and films from the road, on YouTube.",
};

const videos = [
  { title: "[Video title: Kajiado pilot trip]", bg: "#3E4A3A" },
  { title: "[Video title: interview]", bg: "#5A4636" },
  { title: "[Video title: wildlife]", bg: "#3A4A52" },
];

export default function VideosPage() {
  return (
    <>
      <PageHero
        title="Videos"
        hand="from the road"
        intro="Interviews with elders, healers and rainmakers, and films of the places we visit."
        crumbs={[{ label: "Videos" }]}
      />
      <section className="container section stack-lg">
        <div className="article-grid">
          {videos.map((v) => (
            <a key={v.title} href={links.youtube} className="article-card">
              <div className="video-thumb" style={{ background: v.bg }}>
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
