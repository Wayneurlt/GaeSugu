import type { Metadata } from "next";
import Link from "next/link";
import { Founders, Journey, SupportBlock, WhyNature } from "@/components/blocks";
import { getSite } from "@/lib/site";

export const metadata: Metadata = {
  title: "About · Gae Sugu",
  description: "What a gae is, why we started, and why our work is rooted in nature.",
};

export default async function AboutPage() {
  const { ethics, missionVision, pages } = await getSite();
  return (
    <>
      <section className="bg-forest">
        <div className="container narrow center stack-lg about">
          <nav aria-label="Breadcrumb" className="crumbs light">
            <Link href="/">Home</Link> / <span aria-current="page">About</span>
          </nav>
          <h1 className="display-xl">{pages.about.title}</h1>
          <div className="gold-rule" />
          {pages.about.paragraphs.map((text, i) => (
            <p key={i} className="lead">
              {text}
            </p>
          ))}
        </div>
      </section>
      <section id="mission" className="container section topic-grid">
        {missionVision.map((m) => (
          <div key={m.kicker} className="topic-card">
            <span className="kicker">{m.kicker}</span>
            <span className="card-title-lg">{m.text}</span>
          </div>
        ))}
      </section>
      <WhyNature />
      <section className="bg-cream">
        <Journey />
      </section>
      <div id="founders">
        <Founders />
      </div>
      <section id="ethics" className="bg-cream">
        <div className="container section stack-lg">
          <div className="section-head">
            <h2 className="display-sm">{pages.about.ethicsTitle}</h2>
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
      <SupportBlock />
    </>
  );
}
