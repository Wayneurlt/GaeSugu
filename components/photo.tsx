import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { getPhoto, type PhotoId } from "@/lib/photos";
import { type Gallery, photoOfTheWeek } from "@/lib/site";

type PhotoProps = {
  id: PhotoId;
  /** Styles for the frame; set a height or aspect-ratio here. */
  style?: CSSProperties;
  className?: string;
  /** Responsive sizes hint, so the browser downloads the smallest file that fits. */
  sizes?: string;
  /** Load straight away (use for the first photo on the page only). */
  priority?: boolean;
  /** Decorative photos get an empty alt so screen readers skip them. */
  decorative?: boolean;
};

/** A photo cropped to fill its frame, with a blurred preview while it loads. */
export default function Photo({ id, style, className, sizes = "100vw", priority, decorative }: PhotoProps) {
  const photo = getPhoto(id);
  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", ...style }}>
      <Image
        src={photo.src}
        alt={decorative ? "" : photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        style={{ objectFit: "cover", objectPosition: photo.focus ?? "50% 50%" }}
      />
    </div>
  );
}

export function GalleryGrid({ items }: { items: Gallery[] }) {
  return (
    <div className="article-grid">
      {items.map((g) => (
        <Link key={g.slug} href={`/photography/gallery/${g.slug}`} className="article-card">
          <div className="gallery-cover">
            {g.photos
              ? g.photos.slice(0, 3).map((id, i) => (
                  <Photo key={id} id={id} decorative={i > 0} sizes={i === 0 ? "300px" : "150px"} style={{ background: g.colors[i] }} />
                ))
              : g.colors.slice(0, 3).map((c, i) => <span key={i} style={{ background: c }} />)}
          </div>
          <span className="kicker">{g.kind === "photo-essay" ? "PHOTO ESSAY" : "GALLERY"}</span>
          <span className="card-title-lg">{g.title}</span>
          <span className="muted small">{g.county}</span>
        </Link>
      ))}
    </div>
  );
}

export function PhotoOfTheWeek() {
  return (
    <section className="potw">
      <Photo id={photoOfTheWeek.photo} style={{ position: "absolute", inset: 0 }} />
      <div className="potw-shade" aria-hidden="true" />
      <div className="container potw-inner">
        <span className="potw-label">PHOTO OF THE WEEK · {photoOfTheWeek.county.toUpperCase()}</span>
        <h2 className="potw-title">{photoOfTheWeek.title}</h2>
        <p className="potw-text">{photoOfTheWeek.text}</p>
      </div>
    </section>
  );
}
