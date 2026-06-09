import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lavori",
  description: "I progetti realizzati da Studio Vetrina per le piccole attività di Roma. Siti web su misura, curati nel design e pensati per i clienti.",
};

export default function LavoriLayout({ children }: { children: React.ReactNode }) {
  return children;
}
