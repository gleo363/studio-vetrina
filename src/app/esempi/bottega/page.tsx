import type { Metadata } from "next";
import { BarraEsempi, ChiusuraEsempi } from "@/components/esempi/BarraEsempi";
import VetrinaBottega from "@/components/esempi/VetrinaBottega";

export const metadata: Metadata = {
  title: "Fiori di Trastevere · esempio per botteghe e negozi",
  description:
    "Vetrina dimostrativa di Studio Vetrina per botteghe e negozi: un fioraio di fantasia con il banco dei prodotti, la storia della famiglia, orari e contatti. Esempio, non un'attività reale.",
};

export default function EsempioBottegaPage() {
  return (
    <>
      <BarraEsempi />
      <VetrinaBottega />
      <ChiusuraEsempi />
    </>
  );
}
