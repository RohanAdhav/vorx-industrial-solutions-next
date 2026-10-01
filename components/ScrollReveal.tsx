"use client";
import { useEffect } from "react";

/** Reveals every `.reveal` element once as it scrolls into view. Renders nothing; the page itself stays a server component. */
export default function ScrollReveal() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".reveal");
    if (!("IntersectionObserver" in window)) { items.forEach((el) => el.classList.add("is-in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
