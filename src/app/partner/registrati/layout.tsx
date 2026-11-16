import { metadatiLocalizzati } from "@/lib/i18n/metadata";

export const generateMetadata = metadatiLocalizzati({
  it: {
    title: "Diventa partner",
    description:
      "Registrati al Programma Partner di Studio Vetrina. Guadagna il 10% su ogni cliente che ci presenti.",
  },
  en: {
    title: "Become a partner",
    description:
      "Join the Studio Vetrina Partner Program and earn 10% on every client you introduce.",
  },
});

export default function RegistratiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
