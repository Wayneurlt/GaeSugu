import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/photo";
import type { PhotoId } from "@/lib/photos";
import { NewsletterBlock, PageHero } from "@/components/blocks";
import { journey } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Archive · Gae Sugu",
  description: "A living digital archive of African knowledge: voices, photographs, journals, artefacts and indigenous knowledge.",
};

const collections: { title: string; text: string; bg: string; href: string; photo?: PhotoId }[] = [
  { title: "Voices", text: "Recorded interviews with elders, healers, rainmakers and artisans.", bg: "#E2C2B2", href: "/history-culture/oral-history", photo: "boatman" },
  { title: "Photographs", text: "Communities, ceremonies, wildlife and landscapes.", bg: "#C9DCE3", href: "/photography", photo: "egret" },
  { title: "Journals", text: "Our field journals, county by county.", bg: "#EBD9B4", href: "/travel/field-notes", photo: "longonot" },
  { title: "Artefacts", text: "Proper records of objects: what they are, who made them and how they are used.", bg: "#E8D3B8", href: "/history-culture/heritage-sites", photo: "dugoutCanoes" },
  { title: "Indigenous knowledge", text: "Plants, seasons, sky and land, as taught by those who know.", bg: "#B7C7A8", href: "/animals-nature/plants-healing", photo: "sausageTree" },
  { title: "Beliefs & omens", text: "What our communities believe about animals and places, and why.", bg: "#C9D6B8", href: "/animals-nature/sacred-nature", photo: "mossForest" },
];

export default function ArchivePage() {
  return (
    <>
      <PageHero
        title="The Archive"
        hand="picking the pieces back up"
        intro="A gae is a broken piece of a pot. This is where we keep every piece we find: voices, photographs, journals, artefacts and indigenous knowledge, so they are not lost for good."
        color="#E8D3B8"
        crumbs={[{ label: "The Archive" }]}
      />
      <section className="container section stack-lg">
        <div className="section-head">
          <h2 className="display-sm">Collections</h2>
        </div>
        <div className="keep-grid">
          {collections.map((c) => (
            <Link key={c.title} href={c.href} className="keep-card">
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
        <h2 className="display-sm">Add a piece</h2>
        <p className="muted" style={{ margin: 0 }}>
          Do you know an elder with stories to tell, an object with a history, or a belief worth explaining? We would
          love to hear from you. Everything is recorded with consent, and credited to the people who share it.
        </p>
        <Link href="/contact" className="see-more" style={{ alignSelf: "flex-start" }}>
          CONTACT US
        </Link>
      </section>
      <NewsletterBlock />
    </>
  );
}
