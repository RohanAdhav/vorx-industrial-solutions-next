import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const TITLE = "Vorx Industrial Solutions | Industrial Flooring & Protective Systems";
const DESC = "Mumbai industrial flooring contractor delivering epoxy, PU and ESD flooring, waterproofing and protective coatings across India.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s | ${SITE_NAME}` },
  description: DESC,
  keywords: ["epoxy flooring contractor Mumbai", "PU flooring India", "ESD flooring Mumbai", "industrial flooring", "polyurea waterproofing", SITE_NAME],
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_IN", title: TITLE, description: DESC, url: "/" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#100e08", width: "device-width", initialScale: 1 };

// Adds the "js" class before first paint so scroll-reveal content never flashes (and stays visible without JS).
const JS_FLAG = "document.documentElement.classList.add('js')";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: JS_FLAG }} /></head>
      <body>
        <a className="skip-link" href="#main">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
