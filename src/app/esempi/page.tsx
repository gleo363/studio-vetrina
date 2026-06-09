import type { Metadata } from "next";
import GalleriaEsempi from "@/components/esempi/GalleriaEsempi";

export const metadata: Metadata = {
  title: "Esempi · Studio Vetrina",
  description:
    "Quattro vetrine dimostrative, una per settore: ristorazione, saloni, botteghe e artigiani. Esempi costruiti da noi per mostrare cosa sappiamo fare, su misura.",
};

export default function EsempiPage() {
  return <GalleriaEsempi />;
}
