import type { Metadata } from "next";
import { BarraEsempi, ChiusuraEsempi } from "@/components/esempi/BarraEsempi";
import VetrinaRistorante from "@/components/esempi/VetrinaRistorante";

export const metadata: Metadata = {
  title: "Osteria del Vicolo · esempio per la ristorazione",
  description:
    "Vetrina dimostrativa di Studio Vetrina per il settore ristorazione: una trattoria romana di fantasia con menù, orari e prenotazione del tavolo. Esempio, non un'attività reale.",
};

export default function EsempioRistorantePage() {
  return (
    <>
      <BarraEsempi />
      <VetrinaRistorante />
      <ChiusuraEsempi />
    </>
  );
}
