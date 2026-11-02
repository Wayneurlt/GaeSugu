import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm, PageHero } from "@/components/blocks";
import { ethics } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contribute · Gae Sugu",
  description: "Photographers, writers, researchers and knowledge-holders: share a story or photograph with us.",
};

const wanted = [
  { title: "Photographs", text: "Communities, ceremonies, wildlife and landscapes, with a line on who, where and when." },
  { title: "Stories & essays", text: "Field notes, family histories, and essays on identity and belonging." },
  { title: "Research", text: "Work on languages, plants, sacred sites, beliefs and oral history." },
  { title: "Knowledge", text: "Are you an elder, healer, rainmaker or artisan? We would love to sit and listen." },
];

export default function ContributePage() {
  return (
    <>
      <PageHero
        eyebrow="GET INVOLVED"
        title="Contribute to Gae"
        hand="add your piece to the pot"
        intro="Photographers, writers, researchers and knowledge-holders: share a story or photograph with us."
        color="#D6DFC4"
        crumbs={[{ label: "Contribute" }]}
      />

      <section className="container section stack-lg">
        <div className="section-head">
          <h2 className="display-sm">What we are looking for</h2>
        </div>
        <div className="topic-grid">
          {wanted.map((w) => (
            <div key={w.title} className="topic-card">
              <span className="card-title-lg">{w.title}</span>
              <span className="muted small">{w.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream">
        <div className="container section stack-lg">
          <div className="section-head">
            <h2 className="display-sm">How we work with you</h2>
            <Link href="/about#ethics" className="see-more">
              OUR ETHICS
            </Link>
          </div>
          <div className="topic-grid">
            {ethics.map((e) => (
              <div key={e.kicker} className="topic-card">
                <span className="kicker">{e.kicker}</span>
                <span className="muted small">{e.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="submit" className="container section contact">
        <ContactForm
          topic="work"
          extra={
            <label>
              Link to your work (optional)
              <input type="url" name="link" placeholder="Google Drive, Dropbox, a website…" />
            </label>
          }
        />
        <div className="contact-info stack-sm">
          <span className="kicker">YOU KEEP THE CREDIT</span>
          <span className="muted">Everything we publish carries your name, and you can ask us to take it down at any time.</span>
        </div>
      </section>
    </>
  );
}
