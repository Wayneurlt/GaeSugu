import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsletterBlock, PageHero, TopicChips } from "@/components/blocks";
import Photo, { GalleryGrid, PhotoOfTheWeek } from "@/components/photo";
import { galleries, getCategory, getTopic } from "@/lib/site";

type Props = { params: Promise<{ topic: string }> };

const category = getCategory("photography")!;

export const dynamicParams = false;

export function generateStaticParams() {
  return category.topics.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = getTopic("photography", (await params).topic);
  return { title: topic ? `${topic.label} · Gae Sugu` : "Gae Sugu", description: topic?.intro };
}

export default async function PhotographyTopicPage({ params }: Props) {
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
              {(["beachCrows", "kingfisher", "clearLake", "longonot", "palmFence", "hillsideWater"] as const).map((id) => (
                <Photo key={id} id={id} sizes="(max-width: 700px) 100vw, 400px" style={{ background: "#D9D3C7" }} />
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
