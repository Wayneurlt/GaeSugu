import type { Metadata } from "next";
import { NewsletterBlock, PageHero } from "@/components/blocks";
import { links } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support · Gae Sugu",
  description: "Help us keep the record. Buy us a coffee or donate.",
};

const uses = [
  { title: "Getting there", text: "Fuel and transport to reach communities, starting with Kajiado." },
  { title: "Recording", text: "Audio, camera and storage so interviews and photographs are kept properly." },
  { title: "Giving back", text: "Thanking the people who share their knowledge, and returning copies to them." },
  { title: "Keeping it online", text: "Hosting the archive so it stays free for everyone." },
];

export default function SupportPage() {
  return (
    <>
      <PageHero
        title="Help us keep the record."
        hand="every piece counts"
        intro="Every trip, interview and photograph is made possible by people like you."
        color="#E8D3B8"
        crumbs={[{ label: "Support" }]}
      />
      <section className="container section support-options">
        <div className="support-option">
          <span className="kicker">ONE-OFF</span>
          <h2 className="card-title-xl">Buy us a coffee</h2>
          <p className="muted" style={{ margin: 0 }}>
            A small thank-you that keeps us going on the road.
          </p>
          <a href={links.buyMeACoffee} className="btn btn-solid">
            BUY US A COFFEE
          </a>
        </div>
        <div className="support-option">
          <span className="kicker">ANY AMOUNT</span>
          <h2 className="card-title-xl">Donate</h2>
          <p className="muted" style={{ margin: 0 }}>
            Fund a trip, an interview or a piece of the archive. [Add M-Pesa, PayPal or bank details.]
          </p>
          <a href={links.donate} className="btn btn-outline">
            DONATE
          </a>
        </div>
      </section>
      <section className="bg-cream">
        <div className="container section stack-lg">
          <div className="section-head">
            <h2 className="display-sm">Where your support goes</h2>
          </div>
          <div className="topic-grid">
            {uses.map((u) => (
              <div key={u.title} className="topic-card">
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
