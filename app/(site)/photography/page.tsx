import type { Metadata } from "next";
import { NewsletterBlock, PageHero, TopicChips } from "@/components/blocks";
import { GalleryGrid, PhotoOfTheWeek } from "@/components/photo";
import { getSite } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { getCategory } = await getSite();
  return { title: "Photography · Gae Sugu", description: getCategory("photography")?.intro };
}

export default async function PhotographyPage() {
  const { galleries, getCategory } = await getSite();
  const category = getCategory("photography")!;
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
        <TopicChips base="/photography" topics={category.topics} />
      </section>
      <PhotoOfTheWeek />
      <section className="container section stack-lg">
        <div className="section-head">
          <h2 className="display-sm">Galleries &amp; photo essays</h2>
        </div>
        <GalleryGrid items={galleries} />
      </section>
      <NewsletterBlock />
    </>
  );
}
