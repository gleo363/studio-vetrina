import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reimposta password",
  description: "Reimposta la password del tuo account partner Studio Vetrina.",
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
