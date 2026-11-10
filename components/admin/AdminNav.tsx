"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/Logo";
import { Icon, type IconName } from "./icons";

type Item = { href: string; label: string; icon: IconName; action?: { href: string; label: string } };

const main: Item[] = [
  { href: "/admin", label: "Dashboard", icon: "home" },
  { href: "/admin/photos", label: "Photo library", icon: "image" },
  { href: "/admin/edit/articles", label: "Articles", icon: "article", action: { href: "/admin/edit/articles?new=1", label: "Add an article" } },
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
  const [flyout, setFlyout] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const pagesRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close the Pages fly-out and the account menu on navigation, outside clicks and Escape.
  useEffect(() => {
    setFlyout(false);
    setUserOpen(false);
    setDrawer(false);
  }, [pathname]);

  // Phones: the menu slides in over the page; Escape closes it and the page behind does not scroll.
  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("a-no-scroll");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("a-no-scroll");
    };
  }, [drawer]);
  useEffect(() => {
    if (!flyout && !userOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!pagesRef.current?.contains(e.target as Node)) setFlyout(false);
      if (!userRef.current?.contains(e.target as Node)) setUserOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFlyout(false);
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [flyout, userOpen]);

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
      <Link href={item.href} aria-current={current(item.href)} data-tip={item.label} aria-label={collapsed ? item.label : undefined}>
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
    <>
      <div className="a-mobilebar">
        <Link href="/admin" className="a-brand" aria-label="Gae Sugu admin, dashboard">
          <span className="a-brand-mark">
            <LogoMark size={24} accent="#FFFFFF" ink="#17181F" horizon="#17181F" />
          </span>
          <span className="a-brand-name">gae sugu</span>
        </Link>
        <button type="button" className="a-icon-btn a-menu-btn" aria-label="Open the menu" aria-expanded={drawer} aria-controls="admin-sidebar" onClick={() => setDrawer(true)}>
          <Icon name="menuOpen" size={22} />
        </button>
      </div>
      {drawer && <div className="a-drawer-shade" aria-hidden="true" onClick={() => setDrawer(false)} />}
      <aside id="admin-sidebar" className={`a-side${collapsed ? " collapsed" : ""}${drawer ? " open" : ""}`}>
        <div className="a-side-top">
          <Link href="/admin" className="a-brand" aria-label="Gae Sugu admin, dashboard">
            <span className="a-brand-mark">
              <LogoMark size={24} accent="#FFFFFF" ink="#17181F" horizon="#17181F" />
            </span>
            <span className="a-brand-name">gae sugu</span>
          </Link>
          <button type="button" className="a-icon-btn a-drawer-close" aria-label="Close the menu" onClick={() => setDrawer(false)}>
            <Icon name="close" />
          </button>
          <button
            type="button"
            className="a-icon-btn a-collapse"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand the sidebar" : "Collapse the sidebar"}
            aria-pressed={collapsed}
            data-tip={collapsed ? "Expand" : undefined}
          >
            <Icon name="sidebar" />
          </button>
        </div>

        <nav className="a-nav" aria-label="Admin">
          {main.map(link)}
          <hr className="a-nav-sep" />
          {site.map(link)}

          <div className="a-nav-row" ref={pagesRef}>
            <button
              type="button"
              className={`a-nav-group${inPages ? " has-current" : ""}`}
              aria-expanded={collapsed ? flyout : pagesOpen}
              onClick={() => (collapsed ? setFlyout((o) => !o) : setPagesOpen((o) => !o))}
              data-tip={flyout ? undefined : "Pages"}
              aria-label={collapsed ? "Pages" : undefined}
            >
              <Icon name="pages" />
              <span className="a-nav-text">Pages</span>
              <span className="a-nav-caret">
                <Icon name={pagesOpen ? "chevronUp" : "chevronDown"} size={16} />
              </span>
            </button>
            {collapsed && flyout && (
              <div className="a-flyout" role="menu" aria-label="Pages">
                <span className="a-flyout-title">Pages</span>
                {pages.map((p) => (
                  <Link key={p.href} href={p.href} role="menuitem" aria-current={current(p.href)}>
                    {p.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {pagesOpen && !collapsed && (
            <div className="a-nav-sub">
              {pages.map((p) => (
                <Link key={p.href} href={p.href} aria-current={current(p.href)}>
                  {p.label}
                </Link>
              ))}
            </div>
          )}

          <div className="a-nav-row">
            <Link href="/admin/edit/articles?new=1" className="a-nav-new" data-tip="New article" aria-label={collapsed ? "New article" : undefined}>
              <Icon name="plus" />
              <span className="a-nav-text">New article</span>
            </Link>
          </div>
          <hr className="a-nav-sep" />
          {more.map(link)}
        </nav>

        <div className="a-user" ref={userRef}>
          <button
            type="button"
            className="a-user-btn"
            aria-expanded={userOpen}
            aria-label={collapsed ? "Account" : undefined}
            data-tip={userOpen ? undefined : "Account"}
            onClick={() => setUserOpen((o) => !o)}
          >
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
    </>
  );
}
