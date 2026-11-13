"use client";
import Link from "next/link";
import SelettoreLingua from "@/components/ui/SelettoreLingua";
import { useTesti } from "@/components/providers/LinguaProvider";

const TESTI = {
  it: {
    torna: "← Torna agli esempi",
    firma: "Una vetrina di Studio Vetrina · attività di fantasia",
    domanda: "Ti piacerebbe una vetrina così per la tua attività?",
    nota: "Questa è una vetrina dimostrativa di Studio Vetrina. L'attività è di fantasia, il mestiere no.",
    cta: "Parliamone →",
  },
  en: {
    torna: "← Back to our work",
    firma: "A Studio Vetrina sample · fictional business",
    domanda: "Would you like a window like this for your business?",
    nota: "This is a sample site by Studio Vetrina. The business is made up; the craft isn't.",
    cta: "Let's talk →",
  },
};

/**
 * Barra discreta in stile Vetrina, sopra ogni vetrina dimostrativa.
 * Il visitatore sa sempre dove si trova.
 */
export function BarraEsempi() {
  const t = useTesti(TESTI);
  return (
    <div className="bg-inchiostro px-6 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <Link
          href="/esempi"
          className="text-xs text-travertino/70 hover:text-travertino transition-colors"
          style={{ fontFamily: "var(--font-inter)" }}
          data-cursor="pointer"
        >
          {t.torna}
        </Link>
        <div className="flex items-center gap-5">
          <span
            className="hidden sm:inline text-xs text-travertino/40 text-right"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {t.firma}
          </span>
          <SelettoreLingua tono="chiaro" />
        </div>
      </div>
    </div>
  );
}

/**
 * Banda di chiusura in stile Vetrina, sotto ogni vetrina dimostrativa.
 */
export function ChiusuraEsempi() {
  const t = useTesti(TESTI);
  return (
    <div className="bg-inchiostro px-6 py-12">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <p
            className="text-travertino text-lg mb-1"
            style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}
          >
            {t.domanda}
          </p>
          <p
            className="text-travertino/40 text-xs"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {t.nota}
          </p>
        </div>
        <div className="flex items-center gap-6 shrink-0">
          <Link
            href="/esempi"
            className="text-sm text-travertino/60 hover:text-travertino transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
            data-cursor="pointer"
          >
            {t.torna}
          </Link>
          <Link
            href="/contatti"
            className="inline-flex items-center gap-2 bg-cotto text-travertino rounded-[10px] px-5 py-2.5 text-sm font-medium hover:bg-[#a8431f] transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
            data-cursor="pointer"
          >
            {t.cta}
          </Link>
        </div>
      </div>
    </div>
  );
}
