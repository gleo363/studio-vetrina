"use client";
import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { impostaLingua } from "@/app/actions/lingua";
import { useLingua } from "@/components/providers/LinguaProvider";
import { LINGUE, type Lingua } from "@/lib/i18n/config";

const ETICHETTE: Record<Lingua, { breve: string; estesa: string }> = {
  en: { breve: "EN", estesa: "English" },
  it: { breve: "IT", estesa: "Italiano" },
};

interface SelettoreLinguaProps {
  /** "scuro" su fondo chiaro (header), "chiaro" su fondo inchiostro (footer). */
  tono?: "scuro" | "chiaro";
  /** Dimensione: "sm" in barra, "lg" nel menu mobile. */
  misura?: "sm" | "lg";
  className?: string;
}

/**
 * EN · IT — stesso linguaggio dei link di navigazione: Inter, sottolineatura
 * che si disegna da sinistra, voce attiva a piena opacità.
 */
export default function SelettoreLingua({
  tono = "scuro",
  misura = "sm",
  className = "",
}: SelettoreLinguaProps) {
  const lingua = useLingua();
  const router = useRouter();
  const [inCorso, startTransition] = useTransition();
  const [linguaMostrata, impostaLinguaMostrata] = useOptimistic(lingua);

  const scegli = (nuova: Lingua) => {
    if (nuova === linguaMostrata) return;
    startTransition(async () => {
      impostaLinguaMostrata(nuova);
      await impostaLingua(nuova);
      router.refresh();
    });
  };

  const colori =
    tono === "chiaro"
      ? { attivo: "text-travertino", riposo: "text-travertino/45 hover:text-travertino", divisore: "bg-travertino/25" }
      : { attivo: "text-inchiostro", riposo: "text-inchiostro/45 hover:text-inchiostro", divisore: "bg-inchiostro/20" };

  const testo = misura === "lg" ? "text-sm" : "text-xs";

  return (
    <div
      role="group"
      aria-label={lingua === "it" ? "Lingua" : "Language"}
      aria-busy={inCorso}
      className={`flex items-center gap-2.5 ${className}`}
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {LINGUE.map((l, i) => {
        const attiva = l === linguaMostrata;
        return (
          <span key={l} className="flex items-center gap-2.5">
            {i > 0 && <span className={`block w-px h-3 ${colori.divisore}`} aria-hidden="true" />}
            <button
              type="button"
              onClick={() => scegli(l)}
              lang={l}
              title={ETICHETTE[l].estesa}
              aria-label={ETICHETTE[l].estesa}
              aria-pressed={attiva}
              data-attivo={attiva ? "true" : undefined}
              data-cursor="pointer"
              className={`link-sottolineato ${testo} font-medium tracking-[0.14em] uppercase leading-none py-1 cursor-pointer transition-colors duration-200 ${
                attiva ? colori.attivo : colori.riposo
              }`}
            >
              {ETICHETTE[l].breve}
            </button>
          </span>
        );
      })}
    </div>
  );
}
