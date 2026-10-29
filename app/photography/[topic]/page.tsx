import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsletterBlock, PageHero, TopicChips } from "@/components/blocks";
import { GalleryGrid, PhotoOfTheWeek } from "@/components/photo";
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
              {["#D9D3C7", "#C9D6B8", "#E2C2B2", "#C9DCE3", "#EBD9B4", "#B7C7A8"].map((c, i) => (
                <div key={i} className="photo" style={{ background: c }}>
                  <span className="placeholder-note muted">[Week {i + 1} photo]</span>
                </div>
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
