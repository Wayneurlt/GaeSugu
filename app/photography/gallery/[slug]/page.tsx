import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, SupportBlock } from "@/components/blocks";
import { galleries } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return galleries.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const g = galleries.find((x) => x.slug === slug);
  return { title: g ? `${g.title} · Gae Sugu` : "Gae Sugu" };
}

export default async function GalleryPage({ params }: Props) {
  const { slug } = await params;
  const gallery = galleries.find((g) => g.slug === slug);
  if (!gallery) notFound();
  const listHref = gallery.kind === "photo-essay" ? "/photography/photo-essays" : "/photography/galleries";

  return (
    <>
      <PageHero
        eyebrow={gallery.kind === "photo-essay" ? "PHOTO ESSAY" : "GALLERY"}
        title={gallery.title}
        intro={`${gallery.county}. [A short introduction: where these photos were taken, and who is in them.]`}
        color="#C9DCE3"
        crumbs={[
          { label: "Photography", href: "/photography" },
          { label: gallery.kind === "photo-essay" ? "Photo Essays" : "Galleries", href: listHref },
          { label: gallery.title },
        ]}
      />
      <section className="container section stack-lg">
        <div className="gallery">
          {[...gallery.colors, ...gallery.colors].slice(0, 8).map((c, i) => (
            <figure key={i} className={`photo${i % 3 === 0 ? " tall" : ""}`} style={{ background: c, margin: 0 }}>
              <figcaption className="placeholder-note muted">[Photo {i + 1}: caption, name, place]</figcaption>
            </figure>
          ))}
        </div>
        <Link href={listHref} className="see-more">
          BACK TO ALL
        </Link>
      </section>
      <SupportBlock />
    </>
  );
}
