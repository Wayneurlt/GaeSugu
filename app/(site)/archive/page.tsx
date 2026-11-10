import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/photo";
import { NewsletterBlock, PageHero } from "@/components/blocks";
import { getSite } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Archive · Gae Sugu",
  description: "A living digital archive of African knowledge: voices, photographs, journals, artefacts and indigenous knowledge.",
};

export default async function ArchivePage() {
  const { journey, pages } = await getSite();
  return (
    <>
      <PageHero
        title={pages.archive.title}
        hand={pages.archive.hand}
        intro={pages.archive.intro}
        color="#E8D3B8"
        crumbs={[{ label: "The Archive" }]}
      />
      <section className="container section stack-lg">
        <div className="section-head">
          <h2 className="display-sm">Collections</h2>
        </div>
        <div className="keep-grid">
          {pages.archive.collections.map((c, i) => (
            <Link key={i} href={c.href} className="keep-card">
              {c.photo ? (
                <Photo id={c.photo} className="arch" sizes="(max-width: 700px) 100vw, 360px" style={{ background: c.bg, height: 240 }} />
              ) : (
                <div className="arch" style={{ background: c.bg, height: 240 }} />
              )}
              <span className="card-title">{c.title}</span>
              <span className="muted small">{c.text}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-cream">
        <div className="container section stack-lg">
          <div className="section-head">
            <h2 className="display-sm">Browse by place</h2>
          </div>
          <div className="topic-grid">
            {journey.map((j, i) => (
              <div key={j.place} className="topic-card">
                <span className="kicker">{j.stage}</span>
                <span className="card-title-lg">{j.place}</span>
                <span className="muted small">{i === 0 ? "The first records are being added now." : "Not yet visited."}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="container mid section stack-md">
        <h2 className="display-sm">{pages.archive.addTitle}</h2>
        <p className="muted" style={{ margin: 0 }}>
          {pages.archive.addText}
        </p>
        <Link href="/contribute" className="see-more" style={{ alignSelf: "flex-start" }}>
          CONTACT US
        </Link>
      </section>
      <NewsletterBlock />
    </>
  );
}
