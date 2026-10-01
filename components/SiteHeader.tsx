"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <header className="site-header" id="top">
      <div className="wrap">
        <div className="header-inner">
          <Logo href="#top" label="Vorx Industrial Solutions, back to top" />

          <button
            ref={btn}
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="site-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav
            id="site-nav"
            className={`site-nav${open ? " open" : ""}`}
            aria-label="Main"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("a")) setOpen(false);
            }}
          >
            <div className="nav-links">
              <a
                href="#solutions"
                className={activeSection === "solutions" ? "active" : ""}
              >
                Solutions
              </a>

              <a
                href="#approach"
                className={activeSection === "approach" ? "active" : ""}
              >
                Approach
              </a>

              <Link href="/floor-visualiser">Floor visualiser</Link>

              <a
                href="#contact"
                className={activeSection === "contact" ? "active" : ""}
              >
                Contact
              </a>
            </div>

            <Link
              className="btn btn-primary btn-sm"
              href="/floor-visualiser"
            >
              Visualise a floor &#8599;
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}