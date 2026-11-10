import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsletterBlock, PageHero, TopicChips } from "@/components/blocks";
import Photo, { GalleryGrid, PhotoOfTheWeek } from "@/components/photo";
import { getSite } from "@/lib/site";

type Props = { params: Promise<{ topic: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const { getCategory } = await getSite();
  return getCategory("photography")!.topics.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { getTopic } = await getSite();
  const topic = getTopic("photography", (await params).topic);
  return { title: topic ? `${topic.label} · Gae Sugu` : "Gae Sugu", description: topic?.intro };
}

export default async function PhotographyTopicPage({ params }: Props) {
  const { galleries, getCategory, getTopic, pastWeeks } = await getSite();
  const category = getCategory("photography")!;
  const topic = getTopic("photography", (await params).topic);
  if (!topic) notFound();

  const items =
    topic.slug === "photo-essays"
      ? galleries.filter((g) => g.kind === "photo-essay")
      : galleries.filter((g) => g.kind === "gallery");

  return (
    <>
      <PageHero
        eyebrow="PHOTOGRAPHY"
        title={topic.label}
        intro={topic.intro}
        color={category.color}
        crumbs={[{ label: category.label, href: "/photography" }, { label: topic.label }]}
      />
      <section className="container section-tight">
        <TopicChips base="/photography" topics={category.topics} active={topic.slug} />
      </section>
      {topic.slug === "photo-of-the-week" ? (
        <>
          <PhotoOfTheWeek />
          <section className="container section stack-lg">
            <div className="section-head">
              <h2 className="display-sm">Past weeks</h2>
            </div>
            <div className="gallery">
              {pastWeeks.map((id, i) => (
                <Photo key={`${id}-${i}`} id={id} sizes="(max-width: 700px) 100vw, 400px" style={{ background: "#D9D3C7" }} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="container section stack-lg">
          <GalleryGrid items={items} />
        </section>
      )}
      <NewsletterBlock />
    </>
  );
}
