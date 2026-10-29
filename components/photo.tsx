import Link from "next/link";
import { type Gallery, photoOfTheWeek } from "@/lib/site";

export function GalleryGrid({ items }: { items: Gallery[] }) {
  return (
    <div className="article-grid">
      {items.map((g) => (
        <Link key={g.slug} href={`/photography/gallery/${g.slug}`} className="article-card">
          <div className="gallery-cover">
            {g.colors.slice(0, 4).map((c, i) => (
              <span key={i} style={{ background: c }} />
            ))}
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
      <div className="container potw-inner">
        <span className="placeholder-note light potw-note">[FULL-WIDTH PHOTO: your best photo this week]</span>
        <span className="potw-label">PHOTO OF THE WEEK · {photoOfTheWeek.county.toUpperCase()}</span>
        <h2 className="potw-title">{photoOfTheWeek.title}</h2>
        <p className="potw-text">{photoOfTheWeek.text}</p>
      </div>
    </section>
  );
}
