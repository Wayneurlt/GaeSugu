import type { Metadata } from "next";
import { NewsletterBlock, PageHero } from "@/components/blocks";
import { getSite } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support · Gae Sugu",
  description: "Help us keep the record. Buy us a coffee or donate.",
};

export default async function SupportPage() {
  const { links, pages } = await getSite();
  return (
    <>
      <PageHero
        title={pages.support.title}
        hand={pages.support.hand}
        intro={pages.support.intro}
        color="#E8D3B8"
        crumbs={[{ label: "Support" }]}
      />
      <section className="container section support-options">
        <div className="support-option">
          <span className="kicker">ONE-OFF</span>
          <h2 className="card-title-xl">{pages.support.coffeeTitle}</h2>
          <p className="muted" style={{ margin: 0 }}>
            {pages.support.coffeeText}
          </p>
          <a href={links.buyMeACoffee} className="btn btn-solid">
            BUY US A COFFEE
          </a>
        </div>
        <div id="donate" className="support-option">
          <span className="kicker">ANY AMOUNT</span>
          <h2 className="card-title-xl">{pages.support.donateTitle}</h2>
          <p className="muted" style={{ margin: 0 }}>
            {pages.support.donateText}
          </p>
          <a href={links.donate} className="btn btn-outline">
            DONATE
          </a>
        </div>
      </section>
      <section className="bg-cream">
        <div className="container section stack-lg">
          <div className="section-head">
            <h2 className="display-sm">{pages.support.usesTitle}</h2>
          </div>
          <div className="topic-grid">
            {pages.support.uses.map((u, i) => (
              <div key={i} className="topic-card">
                <span className="card-title-lg">{u.title}</span>
                <span className="muted small">{u.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <NewsletterBlock />
    </>
  );
}
