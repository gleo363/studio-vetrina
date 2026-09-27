import type { Metadata } from "next";
import { BarraEsempi, ChiusuraEsempi } from "@/components/esempi/BarraEsempi";
import VetrinaRistorante from "@/components/esempi/VetrinaRistorante";

const FONT_BASE_CLASS = "__font-karla";
const FONT_SECONDARY_CLASS = "__font-anton";

export const metadata: Metadata = {
  title: "Osteria del Vicolo · esempio per la ristorazione",
  description:
    "Vetrina dimostrativa di Studio Vetrina per il settore ristorazione: una trattoria romana di fantasia con menù, orari e prenotazione del tavolo. Esempio, non un'attività reale.",
};

export default function EsempioRistorantePage() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Karla:wght@400;500;700&display=swap');
        .${FONT_BASE_CLASS} { font-family: 'Karla', sans-serif; }
        .${FONT_SECONDARY_CLASS} { font-family: 'Anton', sans-serif; }
      `}</style>
      <BarraEsempi />
      <VetrinaRistorante fontBase={FONT_BASE_CLASS} fontSecondary={FONT_SECONDARY_CLASS} />
      <ChiusuraEsempi />
    </>
  );
}
