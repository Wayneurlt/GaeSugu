"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/Logo";
import { Icon, type IconName } from "./icons";

type Item = { href: string; label: string; icon: IconName; action?: { href: string; label: string } };

const main: Item[] = [
  { href: "/admin", label: "Dashboard", icon: "home" },
  { href: "/admin/photos", label: "Photo library", icon: "image" },
  { href: "/admin/edit/articles", label: "Articles", icon: "article", action: { href: "/admin/edit/articles", label: "Add an article" } },
  { href: "/admin/edit/home", label: "Homepage", icon: "layout" },
];

const site: Item[] = [
  { href: "/admin/edit/photography", label: "Photography", icon: "camera" },
  { href: "/admin/edit/events", label: "Events", icon: "calendar" },
];

const pages = [
  { href: "/admin/edit/about", label: "About & founders" },
  { href: "/admin/edit/explore", label: "Regions & artefacts" },
  { href: "/admin/edit/pages", label: "Other pages" },
  { href: "/admin/edit/categories", label: "Sections & topics" },
];

const more: Item[] = [
  { href: "/admin/edit/nav", label: "Menu", icon: "menu" },
  { href: "/admin/edit/settings", label: "Settings", icon: "settings" },
];

const COLLAPSE_KEY = "gae-admin-collapsed";

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const inPages = pages.some((p) => p.href === pathname);
  const [pagesOpen, setPagesOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {}
  }, []);

  function toggleCollapsed() {
    setCollapsed((c) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, c ? "0" : "1");
      } catch {}
      return !c;
    });
  }

  async function signOut() {
    setLeaving(true);
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    window.location.assign("/admin/login");
  }

  const current = (href: string) => (pathname === href ? "page" : undefined);
  const link = (item: Item) => (
    <div key={item.href} className="a-nav-row">
      <Link href={item.href} aria-current={current(item.href)} title={collapsed ? item.label : undefined}>
        <Icon name={item.icon} />
        <span className="a-nav-text">{item.label}</span>
      </Link>
      {item.action && (
        <Link href={item.action.href} className="a-nav-action" aria-label={item.action.label} title={item.action.label}>
          <Icon name="plus" size={16} />
        </Link>
      )}
    </div>
  );

  return (
    <aside className={`a-side${collapsed ? " collapsed" : ""}`}>
      <div className="a-side-top">
        <Link href="/admin" className="a-brand" aria-label="Gae Sugu admin, dashboard">
          <span className="a-brand-mark">
            <LogoMark size={26} accent="#F2B544" ink="#17181F" horizon="#17181F" />
          </span>
          <span className="a-brand-name">gae sugu</span>
        </Link>
        <button
          type="button"
          className="a-icon-btn a-collapse"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand the sidebar" : "Collapse the sidebar"}
          aria-pressed={collapsed}
        >
          <Icon name="sidebar" />
        </button>
      </div>

      <nav className="a-nav" aria-label="Admin">
        {main.map(link)}
        <hr className="a-nav-sep" />
        {site.map(link)}

        <div className="a-nav-row">
          <button
            type="button"
            className={`a-nav-group${inPages ? " has-current" : ""}`}
            aria-expanded={pagesOpen}
            onClick={() => setPagesOpen((o) => !o)}
            title={collapsed ? "Pages" : undefined}
          >
            <Icon name="pages" />
            <span className="a-nav-text">Pages</span>
            <span className="a-nav-caret">
              <Icon name={pagesOpen ? "chevronUp" : "chevronDown"} size={16} />
            </span>
          </button>
        </div>
        {pagesOpen && (
          <div className="a-nav-sub">
            {pages.map((p) => (
              <Link key={p.href} href={p.href} aria-current={current(p.href)}>
                {p.label}
              </Link>
            ))}
          </div>
        )}

        <div className="a-nav-row">
          <Link href="/admin/edit/articles" className="a-nav-new" title={collapsed ? "New article" : undefined}>
            <Icon name="plus" />
            <span className="a-nav-text">New article</span>
          </Link>
        </div>
        <hr className="a-nav-sep" />
        {more.map(link)}
      </nav>

      <div className="a-user">
        <button type="button" className="a-user-btn" aria-expanded={userOpen} onClick={() => setUserOpen((o) => !o)}>
          <span className="a-avatar" aria-hidden="true">
            GS
          </span>
          <span className="a-user-text">
            <strong>Gae Sugu admin</strong>
            <span>{email}</span>
          </span>
          <Icon name="chevronUpDown" size={16} />
        </button>
        {userOpen && (
          <div className="a-user-menu" role="menu">
            <a href="/" target="_blank" rel="noreferrer" role="menuitem">
              <Icon name="external" size={16} /> View the site
            </a>
            <button type="button" role="menuitem" onClick={signOut} disabled={leaving}>
              <Icon name="logout" size={16} /> {leaving ? "Signing out…" : "Sign out"}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
