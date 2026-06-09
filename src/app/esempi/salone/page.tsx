import type { Metadata } from "next";
import { BarraEsempi, ChiusuraEsempi } from "@/components/esempi/BarraEsempi";
import VetrinaSalone from "@/components/esempi/VetrinaSalone";

export const metadata: Metadata = {
  title: "Atelier Sofia · esempio per saloni e centri estetici",
  description:
    "Vetrina dimostrativa di Studio Vetrina per saloni e centri estetici: un salone di fantasia con listino servizi, lavori e prenotazione dell'appuntamento. Esempio, non un'attività reale.",
};

export default function EsempioSalonePage() {
  return (
    <>
      <BarraEsempi />
      <VetrinaSalone />
      <ChiusuraEsempi />
    </>
  );
}
