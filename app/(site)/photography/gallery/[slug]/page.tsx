import type { Metadata } from "next";
import Link from "next/link";
import Photo from "@/components/photo";

import { notFound } from "next/navigation";
import { PageHero, SupportBlock } from "@/components/blocks";
import { getSite } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { galleries } = await getSite();
  return galleries.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { galleries } = await getSite();
  const { slug } = await params;
  const g = galleries.find((x) => x.slug === slug);
  return { title: g ? `${g.title} · Gae Sugu` : "Gae Sugu" };
}

export default async function GalleryPage({ params }: Props) {
  const { getPhoto, galleries } = await getSite();
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
          {gallery.photos.length > 0
            ? gallery.photos.map((id, i) => (
                <figure key={`${id}-${i}`} className={`gallery-item${i % 3 === 0 ? " tall" : ""}`} style={{ margin: 0 }}>
                  <Photo id={id} sizes="(max-width: 700px) 100vw, 400px" style={{ height: "100%", background: "#D9D3C7" }} />
                  <figcaption className="muted small">{getPhoto(id)?.alt}</figcaption>
                </figure>
              ))
            : [...gallery.colors, ...gallery.colors].slice(0, 8).map((c, i) => (
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
