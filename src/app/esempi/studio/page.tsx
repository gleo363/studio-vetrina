import type { Metadata } from "next";
import { BarraEsempi, ChiusuraEsempi } from "@/components/esempi/BarraEsempi";
import VetrinaStudio from "@/components/esempi/VetrinaStudio";

// Font caricati via link diretto per compatibilità con Turbopack
const FONT_BASE_CLASS = "__font-archivo";
const FONT_SECONDARY_CLASS = "__font-mono";

export const metadata: Metadata = {
  title: "Falegnameria Marini · esempio per artigiani e professionisti",
  description:
    "Vetrina dimostrativa di Studio Vetrina per artigiani e professionisti: una falegnameria di fantasia con i lavori scelti, le competenze e la richiesta di preventivo. Esempio, non un'attività reale.",
};

export default function EsempioStudioPage() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@200;300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .${FONT_BASE_CLASS} { font-family: 'Archivo', sans-serif; }
        .${FONT_SECONDARY_CLASS} { font-family: 'IBM Plex Mono', monospace; }
      `}</style>
      <BarraEsempi />
      <VetrinaStudio fontBase={FONT_BASE_CLASS} fontSecondary={FONT_SECONDARY_CLASS} />
      <ChiusuraEsempi />
    </>
  );
}
