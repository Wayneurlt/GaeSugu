import type { Metadata } from "next";
import { PageHero } from "@/components/blocks";
import { links } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact · Gae Sugu",
  description: "Get in touch with Gae Sugu.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact"
        hand="karibu, say hello"
        intro="Share a story, suggest a place we should visit, invite us to an event, or ask about working together."
        crumbs={[{ label: "Contact" }]}
      />
      <section className="container section contact">
        <form className="contact-form">
          <label>
            Name
            <input type="text" name="name" />
          </label>
          <label>
            Email
            <input type="email" name="email" />
          </label>
          <label>
            What is it about?
            <select name="topic" defaultValue="story">
              <option value="story">I have a story or knowledge to share</option>
              <option value="visit">A place you should visit</option>
              <option value="event">Events and schools</option>
              <option value="partner">Partnerships and press</option>
              <option value="other">Something else</option>
            </select>
          </label>
          <label>
            Message
            <textarea name="message" rows={6} />
          </label>
          <button type="button" className="btn btn-solid">
            SEND
          </button>
        </form>
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
