import type { Metadata } from "next";
import { BarraEsempi, ChiusuraEsempi } from "@/components/esempi/BarraEsempi";
import VetrinaStudio from "@/components/esempi/VetrinaStudio";

export const metadata: Metadata = {
  title: "Falegnameria Marini · esempio per artigiani e professionisti",
  description:
    "Vetrina dimostrativa di Studio Vetrina per artigiani e professionisti: una falegnameria di fantasia con i lavori scelti, le competenze e la richiesta di preventivo. Esempio, non un'attività reale.",
};

export default function EsempioStudioPage() {
  return (
    <>
      <BarraEsempi />
      <VetrinaStudio />
      <ChiusuraEsempi />
    </>
  );
}
