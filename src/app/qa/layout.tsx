import { metadatiLocalizzati } from "@/lib/i18n/metadata";

export const generateMetadata = metadatiLocalizzati({
  it: {
    title: "Q&A",
    description:
      "Le domande più frequenti su Studio Vetrina: costi, tempi di consegna, proprietà del sito e assistenza.",
  },
  en: {
    title: "FAQ",
    description:
      "The questions we hear most at Studio Vetrina: pricing, delivery times, who owns the site and support after launch.",
  },
});

export default function QaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
