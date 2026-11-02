import type { Metadata } from "next";
import Link from "next/link";
import { Founders, Journey, SupportBlock, WhyNature } from "@/components/blocks";
import { ethics, missionVision } from "@/lib/site";

export const metadata: Metadata = {
  title: "About · Gae Sugu",
  description: "What a gae is, why we started, and why our work is rooted in nature.",
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-forest">
        <div className="container narrow center stack-lg about">
          <nav aria-label="Breadcrumb" className="crumbs light">
            <Link href="/">Home</Link> / <span aria-current="page">About</span>
          </nav>
          <h1 className="display-xl">A gae is a broken piece of a pot.</h1>
          <div className="gold-rule" />
          <p className="lead">
            We thought that is how African knowledge feels right now: fragmented and scattered everywhere, with bits of
            our stories, languages and traditions disappearing quietly.
          </p>
          <p className="lead">
            Gae is our attempt to pick those pieces back up and put them together in a living digital archive, so they
            are not lost for good.
          </p>
          <p className="lead">
            We interview elders, healers, rainmakers and artisans; photograph communities and wildlife; keep proper
            records of artefacts and indigenous knowledge; and dig into African beliefs, like why some animals are seen
            as bad omens, to work out what is myth and what carries real meaning.
          </p>
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
            <h2 className="display-sm">Our ethics</h2>
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
