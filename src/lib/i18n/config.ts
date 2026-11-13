/**
 * Lingue del sito. Nessuna dipendenza da Next: importabile ovunque
 * (server, client, proxy).
 *
 * Regola di scelta: il cookie vince sempre (scelta esplicita); senza cookie
 * si guarda la lingua del browser: italiano → "it", tutto il resto → "en".
 */
export const LINGUE = ["en", "it"] as const;
export type Lingua = (typeof LINGUE)[number];

export const LINGUA_PREDEFINITA: Lingua = "en";
export const COOKIE_LINGUA = "vetrina_lingua";

/** Testi co-locati nel componente: una chiave per lingua. */
export type Testi<T> = Record<Lingua, T>;

export function èLingua(valore: unknown): valore is Lingua {
  return typeof valore === "string" && (LINGUE as readonly string[]).includes(valore);
}

/**
 * Legge l'header Accept-Language (es. "it-IT,it;q=0.9,en-US;q=0.8")
 * e restituisce la lingua supportata con la priorità più alta.
 */
export function linguaDaAcceptLanguage(header: string | null | undefined): Lingua {
  if (!header) return LINGUA_PREDEFINITA;

  const preferenze = header
    .split(",")
    .map((parte, indice) => {
      const [tag, ...parametri] = parte.trim().split(";");
      const q = parametri
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="));
      const peso = q ? Number.parseFloat(q.slice(2)) : 1;
      return {
        lingua: tag.toLowerCase().split("-")[0],
        peso: Number.isFinite(peso) ? peso : 0,
        indice,
      };
    })
    .filter((p) => p.lingua && p.peso > 0)
    .sort((a, b) => b.peso - a.peso || a.indice - b.indice);

  const trovata = preferenze.find((p) => èLingua(p.lingua));
  return trovata ? (trovata.lingua as Lingua) : LINGUA_PREDEFINITA;
}

/** Locale completo per Intl e Open Graph. */
export const LOCALE_INTL: Record<Lingua, string> = {
  en: "en-US",
  it: "it-IT",
};

export const LOCALE_OG: Record<Lingua, string> = {
  en: "en_US",
  it: "it_IT",
};
