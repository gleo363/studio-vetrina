import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perché sceglierci",
  description: "Scopri perché le piccole attività di Roma scelgono Studio Vetrina. Prezzi chiari, consegna in 21 giorni, design su misura — senza sorprese.",
};

export default function PercheSceglierciLayout({ children }: { children: React.ReactNode }) {
  return children;
}
