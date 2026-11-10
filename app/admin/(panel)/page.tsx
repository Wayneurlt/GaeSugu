import Link from "next/link";
import { AdminSearch, ContentTracker, SectionChart } from "@/components/admin/Dashboard";
import { Icon, type IconName } from "@/components/admin/icons";
import { dashboardData } from "@/lib/admin/dashboard";

const thumb = (file: string, width: number) => `/api/admin/media?file=${encodeURIComponent(file)}&w=${width}`;

const STORAGE = {
  database: { label: "Database", text: "Connected to the database. Everything you save is live on the site straight away." },
  github: { label: "GitHub", text: "Saving commits to GitHub; the live site updates about 1–2 minutes later, once Vercel has rebuilt it." },
  local: { label: "This computer", text: "You are editing the files on this computer. Commit and push them to publish." },
} as const;

function Stat({ icon, label, value, of, unit, tone }: { icon: IconName; label: string; value: number; of?: number; unit?: string; tone: string }) {
  return (
    <div className={`d-stat ${tone}`}>
      <span className="d-stat-icon">
        <Icon name={icon} size={20} strokeWidth={2} />
      </span>
      <div>
        <p className="d-stat-label">{label}</p>
        <p className="d-stat-value">
          {value}
          {of !== undefined && <span className="d-stat-of">/{of}</span>}
          {unit && <small>{unit}</small>}
        </p>
      </div>
    </div>
  );
}

export default async function Dashboard() {
  const data = await dashboardData();
  const storage = STORAGE[data.storage.mode];
  const todo = data.rows.filter((r) => r.placeholders > 0).length;

  return (
    <div className="d-page">
      <header className="d-top">
        <h1>Welcome, Admin!</h1>
        <AdminSearch items={data.search} />
        <div className="d-top-right">
          <Link href="#tracker" className="d-top-chip" title={`${todo} sections still have placeholder text`}>
            <Icon name="bell" size={18} />
            <span>+{todo}</span>
          </Link>
          <details className="d-top-chip d-storage">
            <summary title="Where your edits are saved">
              <Icon name="database" size={17} />
              <span>{storage.label}</span>
              <Icon name="chevronDown" size={16} />
            </summary>
            <p className="d-pop">{data.storage.ready ? storage.text : "Saving is switched off until the database is connected."}</p>
          </details>
          <a href="/" target="_blank" rel="noreferrer" className="d-btn-dark">
            <Icon name="external" size={17} /> View site
          </a>
        </div>
      </header>

      <div className="d-stats">
        <Stat icon="article" label="Articles published" value={data.stats.articles} unit={`${data.stats.readingMinutes} min read`} tone="t1" />
        <Stat icon="image" label="Photo library" value={data.stats.photos} unit="photos" tone="t2" />
        <Stat icon="sparkle" label="Sections ready" value={data.stats.ready} of={data.stats.total} tone="t3" />
      </div>

      <div className="d-grid">
        <SectionChart sections={data.sections} />

        <section className="d-card d-team" aria-labelledby="team-title">
          <div className="d-team-head">
            <h2 id="team-title">Founders</h2>
            <Link href="/admin/edit/about">See all</Link>
          </div>
          <ul>
            {data.founders.map((f) => (
              <li key={f.name}>
                <span className="d-face" style={{ background: f.bg }}>
                  {f.file ? <img src={thumb(f.file, 96)} alt="" /> : f.name[0]}
                  <i aria-hidden="true" />
                </span>
                <span className="d-team-text">
                  <strong>{f.name}</strong>
                  <span>{f.role.replace(/^Co-founder · /, "")}</span>
                </span>
                <a href={`mailto:${data.email}`} className="a-icon-btn" aria-label={`Email ${f.name}`}>
                  <Icon name="mail" size={17} />
                </a>
              </li>
            ))}
          </ul>
          <Link href="/admin/edit/about" className="d-btn-outline">
            <Icon name="plus" size={17} strokeWidth={2.2} /> Add founder
          </Link>
        </section>
      </div>

      <ContentTracker rows={data.rows} edited={data.edited} />
    </div>
  );
}
