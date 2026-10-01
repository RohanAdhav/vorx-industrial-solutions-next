import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ScrollReveal from "@/components/ScrollReveal";
import { ADDRESS, EMAIL, PHONE_DISPLAY, PHONE_TEL, SITE_URL } from "@/lib/site";

const SERVICES = [
  { tag: "01 / Flooring", title: "Epoxy Flooring", text: "Hard-wearing, chemical-resistant systems for manufacturing, warehouse and commercial environments." },
  { tag: "02 / Flooring", title: "PU Flooring", text: "Durable systems for demanding thermal, hygiene and service conditions." },
  { tag: "03 / Control", title: "ESD Flooring", text: "Static-dissipative solutions for electronics, controlled areas and sensitive operations." },
  { tag: "04 / Protection", title: "Waterproofing & Coatings", text: "Polyurea and protective coating systems for roofs, decks and critical surfaces." },
];
const STEPS = [
  { title: "Site assessment", text: "We understand substrate condition, traffic, exposure and operating requirements." },
  { title: "System selection", text: "We recommend a build-up suited to performance, service life and budget." },
  { title: "Disciplined delivery", text: "Preparation, application and curing are managed around your site programme." },
  { title: "Handover", text: "A finished floor ready for the realities of your operation." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Vorx Industrial Solutions",
  url: SITE_URL,
  image: `${SITE_URL}/images/logo.webp`,
  email: EMAIL,
  telephone: "+91-22-4212-0051",
  description: "Mumbai-based industrial flooring contractor for epoxy, PU, ESD flooring, waterproofing and protective coating systems.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "A-Wing, 206, Byculla Service Industries, D.K. Marg, Vishwamangal Society, Dhaku Prabhuchi Wadi, Byculla East",
    addressLocality: "Mumbai", addressRegion: "Maharashtra", postalCode: "400033", addressCountry: "IN",
  },
  areaServed: [{ "@type": "City", name: "Mumbai" }, { "@type": "Country", name: "India" }],
  serviceType: ["Epoxy Flooring", "PU Flooring", "ESD Flooring", "Industrial Waterproofing", "Protective Coatings"],
  sameAs: ["https://www.instagram.com/vorxindustrial/", "https://www.facebook.com/vorxindustrial/"],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <SiteHeader />
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="wrap">
            <p className="eyebrow reveal">Industrial flooring &middot; protective systems</p>
            <h1 id="hero-title" className="reveal" style={{ "--d": ".08s" } as React.CSSProperties}>Build the floor your operation <em>depends on.</em></h1>
            <p className="hero-text reveal" style={{ "--d": ".16s" } as React.CSSProperties}>Vorx Industrial Solutions designs and delivers high-performance flooring and protective systems for facilities where hygiene, durability, safety and uptime matter.</p>
            <a className="btn btn-primary reveal" style={{ "--d": ".24s" } as React.CSSProperties} href="#solutions">
              Explore our solutions
              <svg className="down-arrow" viewBox="0 0 12 16" aria-hidden="true">
                <path d="M6 1V13M2 9L6 13L10 9" />
              </svg>
            </a>
            <ul className="hero-facts reveal" style={{ "--d": ".32s" } as React.CSSProperties}>
              <li><strong>Epoxy &amp; PU</strong><span>Seamless industrial floors</span></li>
              <li><strong>ESD Systems</strong><span>Static-control environments</span></li>
              <li><strong>Waterproofing</strong><span>Long-life protective solutions</span></li>
            </ul>
          </div>
        </section>

        <section className="section light" id="solutions" aria-labelledby="solutions-title">
          <div className="wrap">
            <div className="intro-row">
              <div className="reveal from-left">
                <p className="eyebrow teal">What we do</p>
                <h2 id="solutions-title">Technical flooring systems, selected around your site&mdash;not a generic specification.</h2>
              </div>
              <p className="intro-text reveal from-right">From first survey to substrate preparation and final handover, our team works to give factories, warehouses, pharmaceutical facilities and food-processing plants a resilient floor system.</p>
            </div>
            <ul className="svc-grid">
              {SERVICES.map((s, i) => (
                <li key={s.title} className={`svc reveal ${i % 2 ? "from-right" : "from-left"}`}>
                  <p className="svc-tag">{s.tag}</p>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section approach" id="approach" aria-labelledby="approach-title">
          <div className="wrap">
            <p className="eyebrow reveal">The Vorx approach</p>
            <h2 id="approach-title" className="reveal" style={{ "--d": ".06s" } as React.CSSProperties}>Clear engineering. Controlled execution.</h2>
            <ol className="steps">
              {STEPS.map((s, i) => (
                <li key={s.title} className="reveal" style={{ "--d": `${i * 0.08}s` } as React.CSSProperties}>
                  <span className="num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="cta" aria-labelledby="cta-title">
          <div className="wrap cta-inner">
            <h2 id="cta-title" className="reveal from-left">Mumbai industrial flooring contractor. Delivering projects across India.</h2>
            <p className="reveal from-right">Speak with our project team about a new build, refurbishment or specification requirement.</p>
          </div>
        </section>

        <section className="section contact" id="contact" aria-labelledby="contact-title">
          <div className="wrap contact-grid">
            <div className="reveal from-left">
              <p className="eyebrow">Start a conversation</p>
              <h2 id="contact-title">Tell us what your floor needs to withstand.</h2>
              <p className="contact-text">Share the location, area, use case and timeline. Our team will help you identify the right flooring or protective system.</p>
            </div>
            <div className="card reveal from-right">
              <h3>Project enquiry</h3>
              <p className="card-intro">For the quickest response, include your facility location, approximate area and intended application.</p>
              <a className="btn btn-primary" href={`mailto:${EMAIL}?subject=Project%20enquiry`}>Email the Vorx team &#8599;</a>
              <p className="card-lines">
                <b>Email:</b> <a href={`mailto:${EMAIL}`}>{EMAIL}</a><br />
                <b>Phone:</b> <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
              </p>
              <address className="card-lines" style={{ fontStyle: "normal" }}><b>Office:</b><br />{ADDRESS}</address>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <ScrollReveal />
    </>
  );
}
