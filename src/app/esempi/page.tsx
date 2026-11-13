import GalleriaEsempi from "@/components/esempi/GalleriaEsempi";
import { metadatiLocalizzati } from "@/lib/i18n/metadata";

export const generateMetadata = metadatiLocalizzati({
  it: {
    title: "Esempi · Studio Vetrina",
    description:
      "Quattro vetrine dimostrative, una per settore: ristorazione, saloni, botteghe e artigiani. Esempi costruiti da noi per mostrare cosa sappiamo fare, su misura.",
  },
  en: {
    title: "Our work · Studio Vetrina",
    description:
      "Four sample websites, one for each kind of business: a restaurant, a salon, a shop and a workshop. Built by us to show what made to measure really looks like.",
  },
});

export default function EsempiPage() {
  return <GalleriaEsempi />;
}
