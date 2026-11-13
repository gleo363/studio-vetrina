import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/layout/SiteChrome";
import MotionProvider from "@/components/providers/MotionProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import CookieConsent from "@/components/CookieConsent";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/site";
import LinguaProvider from "@/components/providers/LinguaProvider";
import { getLingua } from "@/lib/i18n/server";
import { LOCALE_OG } from "@/lib/i18n/config";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

const META = {
  it: {
    titolo: "Studio Vetrina · Siti web su misura per Roma",
    descrizione:
      "Studio Vetrina è uno studio di web design di Roma. Curiamo la presenza online di ogni attività con la stessa attenzione con cui un negoziante cura la sua vetrina: con gusto, ordine e un po' di orgoglio.",
    ogDescrizione:
      "Siti web su misura per le attività che tengono ai dettagli. Pensati a Roma, consegnati in 21 giorni.",
    twDescrizione: "Siti web su misura, pensati a Roma.",
  },
  en: {
    titolo: "Studio Vetrina · Websites made to measure, from Rome",
    descrizione:
      "Studio Vetrina is a web design studio based in Rome. We look after your business online the way a shopkeeper looks after their window: with taste, order and a bit of pride.",
    ogDescrizione:
      "Websites made to measure for businesses that care about the details. Designed in Rome, delivered in 21 days.",
    twDescrizione: "Websites made to measure, designed in Rome.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const lingua = await getLingua();
  const m = META[lingua];
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: m.titolo,
      template: "%s | Studio Vetrina",
    },
    description: m.descrizione,
    openGraph: {
      type: "website",
      locale: LOCALE_OG[lingua],
      alternateLocale: LOCALE_OG[lingua === "it" ? "en" : "it"],
      url: "/",
      siteName: "Studio Vetrina",
      title: m.titolo,
      description: m.ogDescrizione,
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Studio Vetrina" }],
    },
    twitter: {
      card: "summary_large_image",
      title: m.titolo,
      description: m.twDescrizione,
      images: ["/opengraph-image.png"],
    },
    icons: {
      icon: [
        { url: "/vetrina-mark.svg", type: "image/svg+xml" },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lingua = await getLingua();
  return (
    <html
      lang={lingua}
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-travertino text-inchiostro">
        <LinguaProvider lingua={lingua}>
          <MotionProvider>
            <CookieConsent />
            <CustomCursor />
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </MotionProvider>
        </LinguaProvider>
        <Analytics />
      </body>
    </html>
  );
}
