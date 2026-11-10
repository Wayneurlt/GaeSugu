import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm, PageHero } from "@/components/blocks";
import { getSite } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contribute · Gae Sugu",
  description: "Photographers, writers, researchers and knowledge-holders: share a story or photograph with us.",
};

export default async function ContributePage() {
  const { ethics, pages } = await getSite();
  return (
    <>
      <PageHero
        eyebrow="GET INVOLVED"
        title={pages.contribute.title}
        hand={pages.contribute.hand}
        intro={pages.contribute.intro}
        color="#D6DFC4"
        crumbs={[{ label: "Contribute" }]}
      />

      <section className="container section stack-lg">
        <div className="section-head">
          <h2 className="display-sm">{pages.contribute.wantedTitle}</h2>
        </div>
        <div className="topic-grid">
          {pages.contribute.wanted.map((w, i) => (
            <div key={i} className="topic-card">
              <span className="card-title-lg">{w.title}</span>
              <span className="muted small">{w.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream">
        <div className="container section stack-lg">
          <div className="section-head">
            <h2 className="display-sm">{pages.contribute.ethicsTitle}</h2>
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
          <span className="kicker">{pages.contribute.creditTitle}</span>
          <span className="muted">{pages.contribute.creditText}</span>
        </div>
      </section>
    </>
  );
}
