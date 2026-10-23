import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Q&A",
  description: "Le domande più frequenti su Studio Vetrina: costi, tempi di consegna, proprietà del sito e assistenza.",
};

export default function QaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
