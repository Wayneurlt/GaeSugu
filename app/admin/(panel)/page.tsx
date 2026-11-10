import Link from "next/link";
import { AdminSearch, ContentTracker, NeedsTextMenu, SectionChart } from "@/components/admin/Dashboard";
import { Icon, SolidIcon } from "@/components/admin/icons";
import { dashboardData } from "@/lib/admin/dashboard";

const thumb = (file: string, width: number) => `/api/admin/media?file=${encodeURIComponent(file)}&w=${width}`;

const STORAGE = {
  database: { label: "Database", text: "Connected to the database. Everything you save is live on the site straight away." },
  github: { label: "GitHub", text: "Saving commits to GitHub; the live site updates about 1–2 minutes later, once Vercel has rebuilt it." },
  local: { label: "This computer", text: "You are editing the files on this computer. Commit and push them to publish." },
} as const;

function Stat({
  icon,
  label,
  value,
  of,
  unit,
  tone,
  href,
}: {
  icon: "article" | "image" | "ready";
  label: string;
  value: number;
  of?: number;
  unit?: string;
  tone: string;
  href: string;
}) {
  return (
    <Link href={href} className={`d-stat ${tone}`}>
      <span className="d-stat-icon">
        <SolidIcon name={icon} />
      </span>
      <span className="d-stat-text">
        <span className="d-stat-label">{label}</span>
        <span className="d-stat-value">
          {value}
          {of !== undefined && <span className="d-stat-of">/{of}</span>}
          {unit && <small>{unit}</small>}
        </span>
      </span>
    </Link>
  );
}

export default async function Dashboard() {
  const data = await dashboardData();
  const storage = STORAGE[data.storage.mode];

  return (
    <div className="d-page">
      <header className="d-top">
        <h1>Welcome, Admin!</h1>
        <AdminSearch items={data.search} />
        <div className="d-top-right">
          <NeedsTextMenu rows={data.rows} />
          <details className="d-top-chip d-storage">
            <summary title="Where your edits are saved">
              <Icon name="database" size={18} />
              <span>{storage.label}</span>
              <Icon name="chevronDown" size={16} />
            </summary>
            <p className="d-pop">{data.storage.ready ? storage.text : "Saving is switched off until the database is connected."}</p>
          </details>
          <a href="/" target="_blank" rel="noreferrer" className="d-btn-dark">
            <Icon name="external" size={17} strokeWidth={2} /> View site
          </a>
        </div>
      </header>

      <div className="d-stats">
        <Stat icon="article" label="Articles published" value={data.stats.articles} unit="articles" tone="t1" href="/admin/edit/articles" />
        <Stat icon="image" label="Photo library" value={data.stats.photos} unit="photos" tone="t2" href="/admin/photos" />
        <Stat icon="ready" label="Sections ready" value={data.stats.ready} of={data.stats.total} tone="t3" href="#tracker" />
      </div>

      <div className="d-grid">
        <SectionChart sections={data.sections} />

        <section className="d-card d-team" aria-labelledby="latest-title">
          <div className="d-team-head">
            <h2 id="latest-title">Latest articles</h2>
            <Link href="/admin/edit/articles">See all</Link>
          </div>
          <ul>
            {data.latest.map((a) => (
              <li key={a.slug}>
                <span className="d-face" style={{ background: a.bg }}>
                  {a.file ? <img src={thumb(a.file, 96)} alt="" /> : a.title[0]}
                </span>
                <a href={`/articles/${a.slug}`} target="_blank" rel="noreferrer" className="d-team-text">
                  <strong>{a.title}</strong>
                  <span>
                    {a.section} · {a.minutes} min
                  </span>
                </a>
                <Link href={`/admin/edit/articles?item=${a.slug}`} className="a-icon-btn" aria-label={`Edit ${a.title}`} title="Edit">
                  <Icon name="pen" size={17} />
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/admin/edit/articles?new=1" className="d-btn-outline">
            <Icon name="plus" size={18} strokeWidth={2} /> Add article
          </Link>
        </section>
      </div>

      <ContentTracker rows={data.rows} edited={data.edited} />
    </div>
  );
}
