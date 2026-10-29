import type { Metadata } from "next";
import { NewsletterBlock, PageHero, TopicChips } from "@/components/blocks";
import { GalleryGrid, PhotoOfTheWeek } from "@/components/photo";
import { galleries, getCategory } from "@/lib/site";

const category = getCategory("photography")!;

export const metadata: Metadata = { title: "Photography · Gae Sugu", description: category.intro };

export default function PhotographyPage() {
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
