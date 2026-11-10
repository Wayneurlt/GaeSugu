import type { Metadata } from "next";
import { ContactForm, PageHero, isContactTopic } from "@/components/blocks";
import { getSite } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact · Gae Sugu",
  description: "Get in touch with Gae Sugu.",
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { links, pages } = await getSite();
  const { topic } = await searchParams;
  return (
    <>
      <PageHero
        title={pages.contact.title}
        hand={pages.contact.hand}
        intro={pages.contact.intro}
        crumbs={[{ label: "Contact" }]}
      />
      <section className="container section contact">
        <ContactForm topic={isContactTopic(topic) ? topic : undefined} />
        <div className="contact-info stack-sm">
          <span className="kicker">EMAIL</span>
          <span>{links.email}</span>
          <span className="kicker" style={{ marginTop: 16 }}>
            FOLLOW
          </span>
          <a href={links.youtube}>YouTube</a>
          <a href={links.instagram}>Instagram</a>
          <a href={links.tiktok}>TikTok</a>
        </div>
      </section>
    </>
  );
}
