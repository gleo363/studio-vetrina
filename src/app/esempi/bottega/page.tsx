import type { Metadata } from "next";
import { BarraEsempi, ChiusuraEsempi } from "@/components/esempi/BarraEsempi";
import VetrinaBottega from "@/components/esempi/VetrinaBottega";

const FONT_BASE_CLASS = "__font-cormorant";
const FONT_SECONDARY_CLASS = "__font-mulish";

export const metadata: Metadata = {
  title: "Fiori di Trastevere · esempio per botteghe e negozi",
  description:
    "Vetrina dimostrativa di Studio Vetrina per botteghe e negozi: un fioraio di fantasia con il banco dei prodotti, la storia della famiglia, orari e contatti. Esempio, non un'attività reale.",
};

export default function EsempioBottegaPage() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Mulish:wght@400;600;700&display=swap');
        .${FONT_BASE_CLASS} { font-family: 'Cormorant Garamond', serif; }
        .${FONT_SECONDARY_CLASS} { font-family: 'Mulish', sans-serif; }
      `}</style>
      <BarraEsempi />
      <VetrinaBottega fontBase={FONT_BASE_CLASS} fontSecondary={FONT_SECONDARY_CLASS} />
      <ChiusuraEsempi />
    </>
  );
}
