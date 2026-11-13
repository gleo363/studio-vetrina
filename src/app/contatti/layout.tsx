import { metadatiLocalizzati } from "@/lib/i18n/metadata";

export const generateMetadata = metadatiLocalizzati({
  it: {
    title: "Contatti",
    description:
      "Raccontaci la tua attività. Studio Vetrina risponde entro 24 ore e ti propone un sito su misura per la tua realtà a Roma.",
  },
  en: {
    title: "Contact",
    description:
      "Tell us about your business. Studio Vetrina replies within 24 hours with a plan for a website made to measure.",
  },
});

export default function ContattiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
