"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { navSections } from "@/lib/nav";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenSection(null);
  };

  // Lock page scroll and allow Escape to close while the menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="site-header">
        <button
          type="button"
          className="hamburger"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
        <Link href="/" aria-label="Gae Sugu home">
          <Logo size={44} />
        </Link>
        <Link href="/support" className="header-support">
          Support
        </Link>
      </header>

      {menuOpen && (
        <div className="menu" role="dialog" aria-modal="true" aria-label="Main menu">
          <div className="menu-inner">
            <div className="menu-top">
              <button type="button" className="icon-btn" aria-label="Close menu" onClick={closeMenu}>
                <svg width="28" height="28" viewBox="0 0 30 30" aria-hidden="true">
                  <path d="M4 4 L26 26 M26 4 L4 26" stroke="var(--ink)" strokeWidth="1.6" />
                </svg>
              </button>
              <Logo size={32} />
              <button type="button" className="icon-btn icon-btn--end" aria-label="Search">
                <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" fill="none" stroke="var(--ink)" strokeWidth="1.8" />
                  <path d="M17 17 L24 24" stroke="var(--ink)" strokeWidth="1.8" />
                </svg>
              </button>
            </div>

            <nav aria-label="Main" className="menu-nav">
              {navSections.map((s) => {
                const open = openSection === s.id;
                return (
                  <div key={s.id} className="menu-section">
                    <button
                      type="button"
                      className="menu-toggle"
                      aria-expanded={open}
                      onClick={() => setOpenSection(open ? null : s.id)}
                    >
                      <span>{s.label}</span>
                      <span className={`chevron-wrap${open ? " is-open" : ""}`}>
                        <svg width="24" height="24" viewBox="0 0 26 26" aria-hidden="true">
                          <path d="M4 9 L13 18 L22 9" fill="none" stroke="var(--ink)" strokeWidth="1.8" />
                        </svg>
                      </span>
                    </button>
                    {open && (
                      <div className="menu-panel">
                        {s.children.map((c) => (
                          <Link key={c.label} href={c.href} onClick={closeMenu} className="menu-link">
                            {c.label}
                          </Link>
                        ))}
                        {s.latest.length > 0 && (
                          <>
                            <Link href={s.viewAllHref} onClick={closeMenu} className="menu-link">
                              View all {s.label}
                            </Link>
                            <span className="menu-latest-label">Latest—</span>
                            {s.latest.map((l) => (
                              <Link key={l.href + l.title} href={l.href} onClick={closeMenu} className="menu-latest">
                                <span className="menu-thumb" style={{ background: l.color }} />
                                <span className="menu-latest-title">{l.title}</span>
                              </Link>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="menu-cta">
              <Link href="/support" onClick={closeMenu} className="btn btn-solid">
                BUY US A COFFEE
              </Link>
              <Link href="/support" onClick={closeMenu} className="btn btn-outline">
                DONATE
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
