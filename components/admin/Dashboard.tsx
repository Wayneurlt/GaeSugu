"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { DashboardData, TrackerRow } from "@/lib/admin/dashboard";
import { niceTop } from "@/lib/admin/chart";
import { Icon } from "./icons";

/** Closes a popup when the user clicks elsewhere or presses Escape. */
function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && close();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);
  return ref;
}

// ---------- A small dropdown, sized to its label ----------

function Dropdown<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

  // Opening moves focus to the chosen option; arrow keys, Home and End move between options.
  useEffect(() => {
    if (open) menu.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus();
  }, [open]);
  const onMenuKey = (e: React.KeyboardEvent) => {
    const items = [...(menu.current?.querySelectorAll<HTMLButtonElement>("button") ?? [])];
    const at = items.indexOf(document.activeElement as HTMLButtonElement);
    const go = (i: number) => items[(i + items.length) % items.length]?.focus();
    if (e.key === "ArrowDown") go(at + 1);
    else if (e.key === "ArrowUp") go(at - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(items.length - 1);
    else if (e.key === "Escape") {
      setOpen(false);
      button.current?.focus();
    } else if (e.key === "Tab") setOpen(false);
    else return;
    if (e.key !== "Tab") e.preventDefault();
  };

  return (
    <div className="d-drop" ref={ref}>
      <button
        ref={button}
        type="button"
        className="d-drop-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${current?.label}`}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {current?.label}
        <Icon name="chevronDown" size={16} />
      </button>
      {open && (
        <div className="d-drop-menu" role="listbox" aria-label={label} ref={menu} onKeyDown={onMenuKey}>
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              role="option"
              aria-selected={o.value === value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
                button.current?.focus();
              }}
            >
              {o.label}
              {o.value === value && <Icon name="tick" size={16} strokeWidth={2.2} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Sections still waiting for text (the bell) ----------

export function NeedsTextMenu({ rows }: { rows: TrackerRow[] }) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  const todo = rows.filter((r) => r.placeholders > 0).sort((a, b) => b.placeholders - a.placeholders);
  return (
    <div className="d-bell-wrap" ref={ref}>
      <button
        type="button"
        className="d-top-chip"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`${todo.length} sections still have placeholder text`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="d-bell">
          <Icon name="bell" size={19} />
          {todo.length > 0 && <i aria-hidden="true" />}
        </span>
        <span>+{todo.length}</span>
      </button>
      {open && (
        <div className="d-bell-menu" role="menu">
          <p className="d-bell-title">{todo.length ? "Still waiting for real text" : "Every section is written"}</p>
          {todo.map((r) => (
            <Link key={r.id} href={r.href} role="menuitem">
              <span>{r.title}</span>
              <small>{r.placeholders} to fill</small>
            </Link>
          ))}
          {todo.length > 0 && <p className="d-bell-note">Text in [square brackets] is a placeholder. Replace it in each editor.</p>}
        </div>
      )}
    </div>
  );
}

// ---------- Search in the top bar ----------

export function AdminSearch({ items }: { items: DashboardData["search"] }) {
  const [q, setQ] = useState("");
  const ref = useDismiss(Boolean(q), () => setQ(""));
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return items.filter((i) => i.label.toLowerCase().includes(term)).slice(0, 8);
  }, [q, items]);

  return (
    <div className="d-search" ref={ref}>
      <Icon name="search" size={18} />
      <input
        type="search"
        placeholder="Search…"
        aria-label="Search sections, articles and photos"
        value={q}
        onChange={(e) => setQ(e.target.value)}
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
const METRICS = [
  { value: "articles", label: "Articles" },
  { value: "minutes", label: "Reading time" },
] as const;
type Metric = (typeof METRICS)[number]["value"];

export function SectionChart({ sections }: { sections: DashboardData["sections"] }) {
  const [metric, setMetric] = useState<Metric>("articles");
  const [hover, setHover] = useState<number | null>(null);
  const values = sections.map((s) => s[metric]);
  const max = Math.max(...values, 0);
  const total = values.reduce((a, b) => a + b, 0);
  const active = hover !== null && values[hover] > 0 ? hover : values.indexOf(max);

  const top = niceTop(max);
  const ticks = [4, 3, 2, 1, 0].map((n) => (n * top) / 4);
  const unit = (v: number) => (metric === "articles" ? (v === 1 ? "article" : "articles") : "min");
  const at = (v: number) => `calc(var(--label-h) + (100% - var(--label-h)) * ${v / top})`;

  return (
    <section className="d-card d-chart" aria-labelledby="chart-title">
      <div className="d-chart-head">
        <h2 id="chart-title">Articles by section</h2>
        <span className="d-divider" aria-hidden="true" />
        <Dropdown label="Show" value={metric} options={[...METRICS]} onChange={setMetric} />
        <div className="d-chart-total">
          <strong>{total}</strong>
          <span>{metric === "articles" ? "articles" : "min"} (total)</span>
          <svg width="44" height="20" viewBox="0 0 48 20" aria-hidden="true">
            <path d={SQUIGGLE} fill="none" stroke="#B4B7E8" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="d-plot">
        <div className="d-axis" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} style={{ bottom: at(t) }}>
              {Number.isInteger(t) ? t : t.toFixed(1)}
            </span>
          ))}
        </div>
        <div className="d-bars" role="list">
          {max > 0 && (
            <div className="d-max" style={{ bottom: at(max) }} aria-hidden="true">
              <span>max</span>
            </div>
          )}
          {sections.map((s, i) => {
            const v = values[i];
            return (
              <div
                key={s.slug}
                role="listitem"
                className={`d-bar-col${i === active && v > 0 ? " active" : ""}`}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              >
                <div className="d-bar-track">
                  <div className={`d-bar${v === 0 ? " is-empty" : ""}`} style={{ height: v ? `${(v / top) * 100}%` : undefined }}>
                    <span className="d-bar-cap">
                      <span className="d-bar-pill">
                        {v ? (
                          <>
                            <b>{v}</b>
                            <span className="d-bar-unit"> {unit(v)}</span>
                          </>
                        ) : (
                          "-"
                        )}
                      </span>
                    </span>
                  </div>
                </div>
                <Link href={`/${s.slug}`} target="_blank" className="d-bar-label" title={`${s.label}: ${v} ${unit(v)}`}>
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
  const r = 8;
  const c = 2 * Math.PI * r;
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
      <circle cx="11" cy="11" r={r} fill="none" stroke="#F4DCE3" strokeWidth="3.2" />
      <circle
        cx="11"
        cy="11"
        r={r}
        fill="none"
        stroke="#CC3D63"
        strokeWidth="3.2"
        strokeLinecap={value > 0 && value < 100 ? "round" : "butt"}
        strokeDasharray={`${(value / 100) * c} ${c}`}
        transform="rotate(-90 11 11)"
      />
    </svg>
  );
}

const FILTERS = [
  { value: "all", label: "All" },
  { value: "ready", label: "Ready" },
  { value: "todo", label: "Needs text" },
] as const;
type Filter = (typeof FILTERS)[number]["value"];

function RowMenu({ row }: { row: TrackerRow }) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  return (
    <div className="d-more" ref={ref}>
      <button type="button" className="a-icon-btn" aria-label={`More for ${row.title}`} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name="more" size={20} strokeWidth={2.6} />
      </button>
      {open && (
        <div className="d-row-menu" role="menu">
          <Link href={row.href} role="menuitem">
            <Icon name="pen" size={15} /> Edit
          </Link>
          <a href={row.view} target="_blank" rel="noreferrer" role="menuitem">
            <Icon name="external" size={15} /> View on site
          </a>
        </div>
      )}
    </div>
  );
}

export function ContentTracker({ rows, edited }: { rows: TrackerRow[]; edited: number }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const shown = rows.filter(
    (r) =>
      r.title.toLowerCase().includes(q.trim().toLowerCase()) &&
      (filter === "all" || (filter === "ready" ? r.placeholders === 0 : r.placeholders > 0)),
  );
  const todo = rows.filter((r) => r.placeholders > 0).length;

  return (
    <section className="d-tracker" id="tracker" aria-labelledby="tracker-title">
      <div className="d-tracker-head">
        <h2 id="tracker-title">Content tracker</h2>
        <span className="d-chip-new">{edited > 0 ? `+${edited} edited` : `${todo} to finish`}</span>
        <div className="d-tracker-tools">
          <label className="d-mini-search">
            <Icon name="search" size={17} />
            <input type="search" placeholder="Search…" aria-label="Search sections" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <Dropdown label="Show" value={filter} options={[...FILTERS]} onChange={setFilter} />
        </div>
      </div>

      <div className="d-table-wrap">
        <table className="d-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>
                <span className="d-th-help" title="How much of this section's text is written. Text in [square brackets] is a placeholder still waiting for real words; for the photo library, how many photos have a description.">
                  Progress <span aria-hidden="true">ⓘ</span>
                </span>
              </th>
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
                <tr key={r.id}>
                  <td>
                    <Link href={r.href} className="d-name">
                      <strong>{r.title}</strong>
                      <span>{r.note}</span>
                    </Link>
                  </td>
                  <td>
                    <span className="d-progress">
                      <Ring value={r.progress} />
                      {r.progress}%
                    </span>
                  </td>
                  <td>{date ? dateFmt.format(date) : <span className="d-dim">Not yet</span>}</td>
                  <td>{date ? timeFmt.format(date) : <span className="d-dim">—</span>}</td>
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
                  <td className="d-more-cell">
                    <RowMenu row={r} />
                  </td>
                </tr>
              );
            })}
            {!shown.length && (
              <tr>
                <td colSpan={7} className="d-empty-row">
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
