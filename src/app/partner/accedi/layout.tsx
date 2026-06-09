import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accedi all'area partner",
  description: "Accedi alla tua area partner di Studio Vetrina per monitorare le segnalazioni e i tuoi guadagni.",
};

export default function AccediLayout({ children }: { children: React.ReactNode }) {
  return children;
}
