import Photo from "@/components/photo";
import type { PhotoId } from "@/lib/photos";
import type { Metadata } from "next";
import { NewsletterBlock, PageHero } from "@/components/blocks";
import { links } from "@/lib/site";

export const metadata: Metadata = {
  title: "Videos · Gae Sugu",
  description: "Interviews and films from the road, on YouTube.",
};

const videos: { title: string; bg: string; photo: PhotoId }[] = [
  { title: "[Video title: Kajiado pilot trip]", bg: "#3E4A3A", photo: "riftView" },
  { title: "[Video title: interview]", bg: "#5A4636", photo: "boatman" },
  { title: "[Video title: wildlife]", bg: "#3A4A52", photo: "kingfisher" },
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
              <div className="video-thumb" style={{ background: v.bg, position: "relative", overflow: "hidden" }}>
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
