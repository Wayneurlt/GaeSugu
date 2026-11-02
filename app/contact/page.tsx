import type { Metadata } from "next";
import { ContactForm, PageHero, isContactTopic } from "@/components/blocks";
import { links } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact · Gae Sugu",
  description: "Get in touch with Gae Sugu.",
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  return (
    <>
      <PageHero
        title="Contact"
        hand="karibu, say hello"
        intro="Share a story, suggest a place we should visit, invite us to an event, or ask about working together."
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
