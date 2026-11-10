import type { Metadata } from "next";
import Link from "next/link";
import { EventList, NewsletterBlock, PageHero, TopicChips } from "@/components/blocks";
import { getSite } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { getCategory } = await getSite();
  return { title: "Events · Gae Sugu", description: getCategory("events")?.intro };
}

export default async function EventsPage() {
  const { events, pages, getCategory } = await getSite();
  const category = getCategory("events")!;
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
        <h2 className="display-sm">{pages.events.partnerTitle}</h2>
        <p className="muted" style={{ margin: 0 }}>
          {pages.events.partnerText}{" "}
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
