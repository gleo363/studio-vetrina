import { metadatiLocalizzati } from "@/lib/i18n/metadata";

export const generateMetadata = metadatiLocalizzati({
  it: {
    title: "Studio",
    description:
      "Chi siamo e come lavoriamo. Studio Vetrina è uno studio di web design di Roma che cura la presenza online di ogni attività con gusto, ordine e orgoglio.",
  },
  en: {
    title: "Studio",
    description:
      "Who we are and how we work. Studio Vetrina is a web design studio in Rome that looks after businesses online with taste, order and pride.",
  },
});

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
