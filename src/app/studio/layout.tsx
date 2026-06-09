import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio",
  description: "Chi siamo e come lavoriamo. Studio Vetrina è uno studio di web design di Roma che cura la presenza online delle piccole attività con gusto, ordine e orgoglio.",
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
