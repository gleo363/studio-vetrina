import Link from "next/link";

/**
 * Barra discreta in stile Vetrina, sopra ogni vetrina dimostrativa.
 * Il visitatore sa sempre dove si trova.
 */
export function BarraEsempi() {
  return (
    <div className="bg-inchiostro px-6 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <Link
          href="/esempi"
          className="text-xs text-travertino/70 hover:text-travertino transition-colors"
          style={{ fontFamily: "var(--font-inter)" }}
          data-cursor="pointer"
        >
          ← Torna agli esempi
        </Link>
        <span
          className="text-xs text-travertino/40 text-right"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Una vetrina di Studio Vetrina · attività di fantasia
        </span>
      </div>
    </div>
  );
}

/**
 * Banda di chiusura in stile Vetrina, sotto ogni vetrina dimostrativa.
 */
export function ChiusuraEsempi() {
  return (
    <div className="bg-inchiostro px-6 py-12">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <p
            className="text-travertino text-lg mb-1"
            style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}
          >
            Ti piacerebbe una vetrina così per la tua attività?
          </p>
          <p
            className="text-travertino/40 text-xs"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Questa è una vetrina dimostrativa di Studio Vetrina. L&apos;attività è
            di fantasia, il mestiere no.
          </p>
        </div>
        <div className="flex items-center gap-6 shrink-0">
          <Link
            href="/esempi"
            className="text-sm text-travertino/60 hover:text-travertino transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
            data-cursor="pointer"
          >
            ← Torna agli esempi
          </Link>
          <Link
            href="/contatti"
            className="inline-flex items-center gap-2 bg-cotto text-travertino rounded-[10px] px-5 py-2.5 text-sm font-medium hover:bg-[#a8431f] transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
            data-cursor="pointer"
          >
            Parliamone →
          </Link>
        </div>
      </div>
    </div>
  );
}
