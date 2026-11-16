import { BarraEsempi, ChiusuraEsempi } from "@/components/esempi/BarraEsempi";
import VetrinaSalone from "@/components/esempi/VetrinaSalone";
import { metadatiLocalizzati } from "@/lib/i18n/metadata";

const FONT_BASE_CLASS = "__font-manrope";
const FONT_SECONDARY_CLASS = "__font-playfair";

export const generateMetadata = metadatiLocalizzati({
  it: {
    title: "Atelier Sofia · esempio per saloni e centri estetici",
    description:
      "Vetrina dimostrativa di Studio Vetrina per saloni e centri estetici: un salone di fantasia con listino servizi, lavori e prenotazione dell'appuntamento. Esempio, non un'attività reale.",
  },
  en: {
    title: "Atelier Sofia · hair and beauty example",
    description:
      "A Studio Vetrina sample site for hair and beauty salons: a fictional salon with a price list, past work and appointment booking. An example, not a real business.",
  },
});

export default function EsempioSalonePage() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;800&family=Playfair+Display:ital,wght@1,400;1,500&display=swap');
        .${FONT_BASE_CLASS} { font-family: 'Manrope', sans-serif; }
        .${FONT_SECONDARY_CLASS} { font-family: 'Playfair Display', serif; }
      `}</style>
      <BarraEsempi />
      <VetrinaSalone fontBase={FONT_BASE_CLASS} fontSecondary={FONT_SECONDARY_CLASS} />
      <ChiusuraEsempi />
    </>
  );
}
