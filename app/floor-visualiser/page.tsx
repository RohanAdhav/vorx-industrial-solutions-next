import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import SiteFooter from "@/components/SiteFooter";
import Visualiser from "@/components/Visualiser";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Floor Visualiser",
  description: "Upload a photo of your floor, mark the area and preview an epoxy coating colour before the work begins.",
  alternates: { canonical: "/floor-visualiser" },
  openGraph: { url: "/floor-visualiser", title: "Floor Visualiser | Vorx Industrial Solutions", description: "Preview epoxy flooring colours on your own floor photo." },
};

const jsonLd = {
  "@context": "https://schema.org", "@type": "WebApplication", name: "Vorx Floor Visualiser",
  url: `${SITE_URL}/floor-visualiser`, applicationCategory: "DesignApplication", operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  publisher: { "@type": "Organization", name: "Vorx Industrial Solutions", url: SITE_URL },
};

export default function FloorVisualiserPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="site-header">
        <div className="wrap">
          <div className="header-inner">
            <Logo href="/" label="Vorx Industrial Solutions, home" />
            <Link className="back-link" href="/">&larr; Back to Vorx</Link>
          </div>
        </div>
      </header>
      <main id="main" className="wrap">
        <section className="viz-hero">
          <p className="eyebrow">Vorx floor visualiser</p>
          <h1>See the finish before the work begins.</h1>
          <p className="viz-lead">Upload a photo, mark the concrete floor area, then preview it with a full epoxy coat. This is a visual guide for discussion&mdash;final system and shade should be confirmed against site conditions and physical samples.</p>
        </section>
        <Visualiser />
      </main>
      <SiteFooter />
    </>
  );
}
