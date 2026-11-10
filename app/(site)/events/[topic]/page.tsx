import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventList, NewsletterBlock, PageHero, TopicChips } from "@/components/blocks";
import { getSite } from "@/lib/site";

type Props = { params: Promise<{ topic: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const { getCategory } = await getSite();
  return getCategory("events")!.topics.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { getTopic } = await getSite();
  const topic = getTopic("events", (await params).topic);
  return { title: topic ? `${topic.label} · Gae Sugu` : "Gae Sugu", description: topic?.intro };
}

export default async function EventTopicPage({ params }: Props) {
  const { events, getCategory, getTopic } = await getSite();
  const category = getCategory("events")!;
  const topic = getTopic("events", (await params).topic);
  if (!topic) notFound();
  // "Upcoming" lists everything; the other topics filter by event type.
  const items = topic.slug === "upcoming" ? events : events.filter((e) => e.type === topic.slug);

  return (
    <>
      <PageHero
        eyebrow="EVENTS"
        title={topic.label}
        intro={topic.intro}
        color={category.color}
        crumbs={[{ label: category.label, href: "/events" }, { label: topic.label }]}
      />
      <section className="container section-tight">
        <TopicChips base="/events" topics={category.topics} active={topic.slug} />
      </section>
      <section className="bg-forest">
        <div className="container events">
          {items.length > 0 ? (
            <EventList items={items} />
          ) : (
            <p style={{ margin: 0 }}>Nothing scheduled yet. Sign up below to hear first.</p>
          )}
        </div>
      </section>
      <NewsletterBlock />
    </>
  );
}
