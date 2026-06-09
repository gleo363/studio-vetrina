import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/layout/SiteChrome";
import CustomCursor from "@/components/ui/CustomCursor";
import GoogleAnalytics from "@/components/GoogleAnalytics";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://studio-vetrina.vercel.app"),
  title: {
    default: "Studio Vetrina · Siti web su misura per Roma",
    template: "%s | Studio Vetrina",
  },
  description:
    "Studio Vetrina è uno studio di web design di Roma. Curiamo la presenza online delle piccole attività con la stessa attenzione con cui un negoziante cura la sua vetrina: con gusto, ordine e un po' di orgoglio.",
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "/",
    siteName: "Studio Vetrina",
    title: "Studio Vetrina · Siti web su misura per Roma",
    description:
      "Siti web su misura per le piccole attività di Roma. Design curato, consegna in 21 giorni.",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Studio Vetrina" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Vetrina · Siti web su misura per Roma",
    description: "Siti web su misura per le piccole attività di Roma.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-travertino text-inchiostro">
        <GoogleAnalytics />
        <CustomCursor />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
