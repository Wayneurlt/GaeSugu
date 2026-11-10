import Link from "next/link";
import { type PhotoId } from "@/lib/photos";
import { type Gallery } from "@/lib/site";
import { PhotoFrame, type PhotoFrameProps } from "./photo-frame";
import { getSite } from "@/lib/site";

/** A library photo by id, cropped to fill its frame. */
export default async function Photo({ id, ...props }: Omit<PhotoFrameProps, "photo"> & { id: PhotoId | undefined }) {
  const { getPhoto } = await getSite();
  return <PhotoFrame photo={getPhoto(id)} {...props} />;
}

export function GalleryGrid({ items }: { items: Gallery[] }) {
  return (
    <div className="article-grid">
      {items.map((g) => (
        <Link key={g.slug} href={`/photography/gallery/${g.slug}`} className="article-card">
          <div className="gallery-cover">
            {g.photos.length > 0
              ? g.photos.slice(0, 3).map((id, i) => (
                  <Photo key={`${id}-${i}`} id={id} decorative={i > 0} sizes={i === 0 ? "300px" : "150px"} style={{ background: g.colors[i] }} />
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

export async function PhotoOfTheWeek() {
  const { photoOfTheWeek } = await getSite();
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
