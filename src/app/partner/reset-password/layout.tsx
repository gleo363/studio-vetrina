import { metadatiLocalizzati } from "@/lib/i18n/metadata";

export const generateMetadata = metadatiLocalizzati({
  it: {
    title: "Reimposta password",
    description:
      "Reimposta la password del tuo account partner Studio Vetrina.",
  },
  en: {
    title: "Reset password",
    description:
      "Reset the password for your Studio Vetrina partner account.",
  },
});

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
