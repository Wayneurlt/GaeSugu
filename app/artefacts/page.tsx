import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterBlock, PageHero } from "@/components/blocks";
import Photo from "@/components/photo";
import { artefacts } from "@/lib/site";

export const metadata: Metadata = {
  title: "Artefacts · Gae Sugu",
  description: "Proper records of objects: what they are, who made them and how they are used.",
};

const record = [
  { title: "What it is", text: "Its name in the local language, what it is made of and how it is made." },
  { title: "Who made it", text: "The maker, the community and the county, credited by name where they agree." },
  { title: "How it is used", text: "Everyday use, ceremonies, and the stories and beliefs around it." },
  { title: "With consent", text: "We only photograph and publish what the owners are happy to share." },
];

export default function ArtefactsPage() {
  return (
    <>
      <PageHero
        eyebrow="THE ARCHIVE"
        title="Artefacts"
        hand="objects that carry memory"
        intro="Proper records of objects: what they are, who made them and how they are used."
        color="#EBD9B4"
        crumbs={[{ label: "The Archive", href: "/archive" }, { label: "Artefacts" }]}
      />

      <section className="container section">
        <div className="article-grid">
          {artefacts.map((a) => (
            <div key={a.slug} id={a.slug} className="article-card">
              <Photo id={a.photo} className="article-card-photo" sizes="(max-width: 700px) 100vw, 400px" style={{ background: "#EBD9B4" }} />
              <span className="kicker">
                {a.community} · {a.county}
              </span>
              <span className="card-title-lg">{a.name}</span>
              <span className="muted small">{a.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream">
        <div className="container section stack-lg">
          <div className="section-head">
            <h2 className="display-sm">What we record for every object</h2>
          </div>
          <div className="topic-grid">
            {record.map((r) => (
              <div key={r.title} className="topic-card">
                <span className="card-title-lg">{r.title}</span>
                <span className="muted small">{r.text}</span>
              </div>
            ))}
          </div>
          <p className="muted" style={{ margin: 0 }}>
            Do you keep an object with a story?{" "}
            <Link href="/contribute" className="underline-link">
              Share it with us
            </Link>
            .
          </p>
        </div>
      </section>

      <NewsletterBlock />
    </>
  );
}
