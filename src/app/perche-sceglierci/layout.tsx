import { metadatiLocalizzati } from "@/lib/i18n/metadata";

export const generateMetadata = metadatiLocalizzati({
  it: {
    title: "Perché sceglierci",
    description:
      "Perché tante attività scelgono Studio Vetrina: prezzi chiari, consegna in 21 giorni, design su misura e nessuna sorpresa.",
  },
  en: {
    title: "Why us",
    description:
      "Why businesses choose Studio Vetrina: clear prices, delivery in 21 days, design made to measure and no surprises.",
  },
});

export default function PercheSceglierciLayout({ children }: { children: React.ReactNode }) {
  return children;
}
