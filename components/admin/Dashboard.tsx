"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { DashboardData, TrackerRow } from "@/lib/admin/dashboard";
import { Icon } from "./icons";

// ---------- Search in the top bar ----------

export function AdminSearch({ items }: { items: DashboardData["search"] }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return items.filter((i) => i.label.toLowerCase().includes(term)).slice(0, 8);
  }, [q, items]);

  return (
    <div className="d-search">
      <Icon name="search" size={17} />
      <input
        type="search"
        placeholder="Search…"
        aria-label="Search sections, articles and photos"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && setQ("")}
      />
      {q.trim() && (
        <div className="d-search-results" role="listbox">
          {results.length ? (
            results.map((r, i) => (
              <Link key={`${r.href}-${i}`} href={r.href} role="option" aria-selected={false}>
                <span>{r.label}</span>
                <small>{r.hint}</small>
              </Link>
            ))
          ) : (
            <p className="d-search-empty">Nothing matches “{q.trim()}”.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- Articles per section ----------

const SQUIGGLE = "M1 12h7l2-5 3 10 3-14 3 13 2-4h6l2-3 3 6h6";

export function SectionChart({ sections }: { sections: DashboardData["sections"] }) {
  const [metric, setMetric] = useState<"articles" | "minutes">("articles");
  const values = sections.map((s) => s[metric]);
  const max = Math.max(...values, 0);
  const total = values.reduce((a, b) => a + b, 0);
  const peak = values.indexOf(max);
  const [hover, setHover] = useState<number | null>(null);
  const active = hover ?? peak;

  // A tidy scale above the highest bar, with five gridlines.
  const step = Math.max(1, Math.ceil((max * 1.2) / 4));
  const top = step * 4;
  const ticks = [4, 3, 2, 1, 0].map((n) => n * step);
  const unit = metric === "articles" ? "articles" : "min";
  const show = (v: number) => (metric === "articles" ? `${v} ${v === 1 ? "article" : "articles"}` : `${v} min`);

  return (
    <section className="d-card d-chart" aria-labelledby="chart-title">
      <div className="d-chart-head">
        <h2 id="chart-title">Articles by section</h2>
        <label className="d-select">
          <span className="sr-only">Show</span>
          <select value={metric} onChange={(e) => setMetric(e.target.value as typeof metric)}>
            <option value="articles">Articles</option>
            <option value="minutes">Reading time</option>
          </select>
          <Icon name="chevronDown" size={16} />
        </label>
        <div className="d-chart-total">
          <strong>{total}</strong>
          <span>{unit} (total)</span>
          <svg width="40" height="20" viewBox="0 0 48 20" aria-hidden="true">
            <path d={SQUIGGLE} fill="none" stroke="#B9BBE6" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="d-plot">
        <div className="d-axis" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} style={{ bottom: `calc(30px + (100% - 30px) * ${t / top})` }}>
              {t}
            </span>
          ))}
        </div>
        <div className="d-bars">
          {max > 0 && (
            <div className="d-max" style={{ bottom: `calc(30px + (100% - 30px) * ${max / top})` }} aria-hidden="true">
              <span>max</span>
            </div>
          )}
          {sections.map((s, i) => {
            const v = values[i];
            const isActive = i === active && v > 0;
            return (
              <div
                key={s.slug}
                className={`d-bar-col${isActive ? " active" : ""}`}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <div className="d-bar-track">
                  <div className={`d-bar${v === 0 ? " is-empty" : ""}`} style={{ height: v ? `${(v / top) * 100}%` : "34px" }}>
                    <span className="d-bar-pill">
                      {v ? (
                        <>
                          {v}
                          <span className="d-bar-unit"> {show(v).replace(/^\d+ /, "")}</span>
                        </>
                      ) : (
                        "-"
                      )}
                    </span>
                  </div>
                </div>
                <Link href={`/${s.slug}`} target="_blank" className="d-bar-label" title={`${s.label}: ${show(v)}`}>
                  {s.short}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------- Content tracker ----------

const TZ = "Africa/Nairobi";
const dateFmt = new Intl.DateTimeFormat("en-US", { month: "numeric", day: "numeric", year: "2-digit", timeZone: TZ });
const timeFmt = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: TZ });

function Ring({ value }: { value: number }) {
  const r = 9;
  const c = 2 * Math.PI * r;
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r={r} fill="none" stroke="#E6E6EE" strokeWidth="4" />
      <circle
        cx="12"
        cy="12"
        r={r}
        fill="none"
        stroke="#CC3D63"
        strokeWidth="4"
        strokeDasharray={`${(value / 100) * c} ${c}`}
        transform="rotate(-90 12 12)"
      />
    </svg>
  );
}

type Filter = "all" | "ready" | "todo";

export function ContentTracker({ rows, edited }: { rows: TrackerRow[]; edited: number }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [menu, setMenu] = useState<string | null>(null);

  const shown = rows.filter(
    (r) =>
      r.title.toLowerCase().includes(q.trim().toLowerCase()) &&
      (filter === "all" || (filter === "ready" ? r.placeholders === 0 : r.placeholders > 0)),
  );
  const allChecked = shown.length > 0 && shown.every((r) => selected.has(r.id));
  const toggle = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section className="d-tracker" id="tracker" aria-labelledby="tracker-title">
      <div className="d-tracker-head">
        <h2 id="tracker-title">Content tracker</h2>
        {edited > 0 && <span className="d-chip-new">+{edited} edited</span>}
        <div className="d-tracker-tools">
          <label className="d-mini-search">
            <Icon name="search" size={16} />
            <input type="search" placeholder="Search…" aria-label="Search sections" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <label className="d-select">
            <span className="sr-only">Show</span>
            <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
              <option value="all">All</option>
              <option value="ready">Ready</option>
              <option value="todo">Needs text</option>
            </select>
            <Icon name="chevronDown" size={16} />
          </label>
        </div>
      </div>

      <div className="d-table-wrap">
        <table className="d-table">
          <thead>
            <tr>
              <th className="d-check">
                <input
                  type="checkbox"
                  aria-label="Select all"
                  checked={allChecked}
                  onChange={() => setSelected(allChecked ? new Set() : new Set(shown.map((r) => r.id)))}
                />
              </th>
              <th>Name</th>
              <th>Progress</th>
              <th>Last edited</th>
              <th>Time</th>
              <th>Status</th>
              <th>Contents</th>
              <th>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => {
              const date = r.edited ? new Date(r.edited) : null;
              return (
                <tr key={r.id} className={selected.has(r.id) ? "selected" : undefined}>
                  <td className="d-check">
                    <input type="checkbox" aria-label={`Select ${r.title}`} checked={selected.has(r.id)} onChange={() => toggle(r.id)} />
                  </td>
                  <td>
                    <Link href={r.href} className="d-name">
                      <strong>{r.title}</strong> <span>{r.note}</span>
                    </Link>
                  </td>
                  <td>
                    <span className="d-progress">
                      <Ring value={r.progress} />
                      {r.progress}%
                    </span>
                  </td>
                  <td>{date ? dateFmt.format(date) : "—"}</td>
                  <td>{date ? timeFmt.format(date) : "Original"}</td>
                  <td>
                    {r.placeholders === 0 ? (
                      <span className="d-status ok">
                        <Icon name="check" size={16} /> Ready
                      </span>
                    ) : (
                      <span className="d-status todo" title={`${r.placeholders} placeholder${r.placeholders === 1 ? "" : "s"} to replace`}>
                        <Icon name="ban" size={16} /> {r.placeholders} to fill
                      </span>
                    )}
                  </td>
                  <td>{r.items}</td>
                  <td className="d-more">
                    <button
                      type="button"
                      className="a-icon-btn"
                      aria-label={`More for ${r.title}`}
                      aria-expanded={menu === r.id}
                      onClick={() => setMenu(menu === r.id ? null : r.id)}
                    >
                      <Icon name="more" size={20} strokeWidth={2.6} />
                    </button>
                    {menu === r.id && (
                      <div className="d-row-menu" role="menu">
                        <Link href={r.href} role="menuitem">
                          <Icon name="pen" size={15} /> Edit
                        </Link>
                        <a href={r.view} target="_blank" rel="noreferrer" role="menuitem">
                          <Icon name="external" size={15} /> View on site
                        </a>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {!shown.length && (
              <tr>
                <td colSpan={8} className="d-empty">
                  No sections match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
