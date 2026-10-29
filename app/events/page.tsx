import type { Metadata } from "next";
import Link from "next/link";
import { EventList, NewsletterBlock, PageHero, TopicChips } from "@/components/blocks";
import { events, getCategory } from "@/lib/site";

const category = getCategory("events")!;

export const metadata: Metadata = { title: "Events · Gae Sugu", description: category.intro };

export default function EventsPage() {
  return (
    <>
      <PageHero
        title={category.label}
        hand={category.tagline}
        intro={category.intro}
        color={category.color}
        crumbs={[{ label: category.label }]}
      />
      <section className="container section-tight">
        <TopicChips base="/events" topics={category.topics} />
      </section>
      <section className="bg-forest">
        <div className="container events">
          <EventList items={events} />
        </div>
      </section>
      <section className="container mid section stack-md">
        <h2 className="display-sm">Host or partner with us</h2>
        <p className="muted" style={{ margin: 0 }}>
          Schools, community groups and organisations can invite us for an exhibition, a talk or an essay club.{" "}
          <Link href="/contact" className="underline-link">
            Get in touch
          </Link>
          .
        </p>
      </section>
      <NewsletterBlock />
    </>
  );
}
