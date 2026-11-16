import { metadatiLocalizzati } from "@/lib/i18n/metadata";

export const generateMetadata = metadatiLocalizzati({
  it: {
    title: "Accedi all'area partner",
    description:
      "Accedi alla tua area partner di Studio Vetrina per monitorare le segnalazioni e i tuoi guadagni.",
  },
  en: {
    title: "Partner login",
    description:
      "Log in to your Studio Vetrina partner area to follow your referrals and earnings.",
  },
});

export default function AccediLayout({ children }: { children: React.ReactNode }) {
  return children;
}
