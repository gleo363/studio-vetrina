import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contatti",
  description: "Raccontaci la tua attività. Studio Vetrina risponde entro 24 ore e ti propone un sito su misura per la tua realtà a Roma.",
};

export default function ContattiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
