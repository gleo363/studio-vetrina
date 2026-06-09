"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Le vetrine dimostrative (/esempi/<vetrina>) hanno un'identità propria:
// header e footer di Studio Vetrina vengono nascosti solo lì.
// La galleria /esempi resta in brand Vetrina, con header e footer normali.
function isVetrinaDimostrativa(pathname: string) {
  return /^\/esempi\/.+/.test(pathname);
}

export function SiteHeader() {
  const pathname = usePathname();
  if (isVetrinaDimostrativa(pathname)) return null;
  return <Header />;
}

export function SiteFooter() {
  const pathname = usePathname();
  if (isVetrinaDimostrativa(pathname)) return null;
  return <Footer />;
}
