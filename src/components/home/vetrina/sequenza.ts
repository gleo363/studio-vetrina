/**
 * Tempi e indici della scena "La vetrina che si accende".
 * Funzioni pure, testate con `npm test`.
 *
 * p = progresso grezzo dello scroll (0 → 1 sui 200 lvh utili della sezione).
 * s = lo stesso progresso ammorbidito dallo spring: decide fotogramma e angoli.
 */
import type { Quad } from "./geometria";

export const TEMPI = {
  /** Titolo, sottotitolo e pulsanti dell'Hero spariscono in p 0 → 0,10. */
  titoloFine: 0.1,
  /** Clip 1 (saracinesca) su s 0 → 0,45. */
  clip1Fine: 0.45,
  /** La copia di SezioneProblema compare nello schermo da s 0,85. */
  schermoInizio: 0.85,
  /** Clip 2 (carrellata) fino a s 0,92, poi ultimo fotogramma fermo. */
  fotogrammiFine: 0.92,
  /** Zoom dentro lo schermo su p 0,92 → 1. */
  zoomInizio: 0.92,
} as const;

export interface DatiSequenza {
  fotogrammi: number;
  /** Quanti fotogrammi appartengono alla clip 1. */
  primaClip: number;
  larghezza: number;
  altezza: number;
  estensione: "avif" | "webp";
  /** Angoli dello schermo (coordinate del fotogramma) per indice, da s 0,85. */
  angoli: Record<string, Quad>;
}

const limita = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/** Posizione continua nella sequenza (0 … n−1) per un progresso s. */
export function posizioneFotogramma(s: number, n: number, n1: number): number {
  const x = limita(s);
  if (x <= TEMPI.clip1Fine) return (x / TEMPI.clip1Fine) * n1;
  if (x >= TEMPI.fotogrammiFine) return n - 1;
  const u = (x - TEMPI.clip1Fine) / (TEMPI.fotogrammiFine - TEMPI.clip1Fine);
  return n1 + u * (n - 1 - n1);
}

export function indiceFotogramma(s: number, n: number, n1: number): number {
  return Math.round(posizioneFotogramma(s, n, n1));
}

/** Angoli dello schermo per il progresso s, interpolati tra due fotogrammi. */
export function angoliPerProgresso(s: number, dati: DatiSequenza): Quad | null {
  if (s < TEMPI.schermoInizio) return null;
  const chiavi = Object.keys(dati.angoli)
    .map(Number)
    .sort((a, b) => a - b);
  if (chiavi.length === 0) return null;
  const f = posizioneFotogramma(s, dati.fotogrammi, dati.primaClip);
  if (f <= chiavi[0]) return dati.angoli[String(chiavi[0])];
  const ultimo = chiavi[chiavi.length - 1];
  if (f >= ultimo) return dati.angoli[String(ultimo)];
  let i = 0;
  while (chiavi[i + 1] < f) i++;
  const a = chiavi[i];
  const b = chiavi[i + 1];
  const t = (f - a) / (b - a);
  const qa = dati.angoli[String(a)];
  const qb = dati.angoli[String(b)];
  return qa.map((p, j) => [
    p[0] + (qb[j][0] - p[0]) * t,
    p[1] + (qb[j][1] - p[1]) * t,
  ]) as Quad;
}

/**
 * Ordine in cui scaricare i fotogrammi. Senza partenza: prima le chiavi,
 * poi i punti medi per bisezione (la sequenza si "infittisce" ovunque).
 * Con partenza (pagina ricaricata a metà): prima i vicini, alternando avanti e indietro.
 */
export function ordineCaricamento(
  n: number,
  chiavi: number[],
  partenza?: number
): number[] {
  if (partenza !== undefined) {
    const c = Math.round(limita(partenza, 0, n - 1));
    const out = [c];
    for (let d = 1; out.length < n; d++) {
      if (c - d >= 0) out.push(c - d);
      if (c + d < n) out.push(c + d);
    }
    return out;
  }
  const visti = new Set<number>();
  const out: number[] = [];
  const aggiungi = (i: number) => {
    if (i >= 0 && i < n && !visti.has(i)) {
      visti.add(i);
      out.push(i);
    }
  };
  chiavi.forEach(aggiungi);
  const ordinate = [...visti].sort((a, b) => a - b);
  let intervalli: [number, number][] = [];
  for (let i = 0; i + 1 < ordinate.length; i++) {
    intervalli.push([ordinate[i], ordinate[i + 1]]);
  }
  while (intervalli.length) {
    const prossimi: [number, number][] = [];
    for (const [a, b] of intervalli) {
      if (b - a < 2) continue;
      const m = Math.floor((a + b) / 2);
      aggiungi(m);
      prossimi.push([a, m], [m, b]);
    }
    intervalli = prossimi;
  }
  for (let i = 0; i < n; i++) aggiungi(i);
  return out;
}

/** Il fotogramma pronto più vicino a i (a parità, il precedente); −1 se nessuno. */
export function piuVicinoCaricato(i: number, pronti: ReadonlySet<number>): number {
  if (pronti.size === 0) return -1;
  if (pronti.has(i)) return i;
  let migliore = -1;
  let distanza = Infinity;
  for (const j of pronti) {
    const d = Math.abs(j - i);
    if (d < distanza || (d === distanza && j < migliore)) {
      migliore = j;
      distanza = d;
    }
  }
  return migliore;
}

/** La copia compare nello schermo in s 0,85 → 0,90. */
const DISSOLVENZA_COPIA = 0.05;
/** Se lo spring è ancora indietro quando parte lo zoom, la copia entra nel primo 15% dello zoom. */
const INGRESSO_IN_ZOOM = 0.15;

/**
 * Fotogramma da disegnare. Lo zoom segue p (grezzo), i fotogrammi s (spring): con uno scroll
 * svelto s resta indietro, quindi durante lo zoom si mostra sempre l'ultimo fotogramma, quello
 * su cui sono misurati gli angoli usati dallo zoom.
 */
export function fotogrammaDaMostrare(s: number, p: number, n: number, n1: number): number {
  return progressoZoom(p) > 0 ? n - 1 : indiceFotogramma(s, n, n1);
}

/** Opacità della copia di SezioneProblema nello schermo. */
export function opacitaCopia(s: number, p: number): number {
  const daSpring = limita((s - TEMPI.schermoInizio) / DISSOLVENZA_COPIA);
  const daZoom = limita(progressoZoom(p) / INGRESSO_IN_ZOOM);
  return Math.max(daSpring, daZoom);
}

/**
 * Quale fotogramma pronto disegnare per l'indice voluto i, sapendo che a schermo c'è già
 * `attuale` (−1 se niente). Restituisce −1 per lasciare il canvas com'è: mai sostituire
 * il fotogramma a schermo con uno più lontano da i (per esempio la copertina a metà scena).
 */
export function sceltaFotogramma(i: number, pronti: ReadonlySet<number>, attuale: number): number {
  const j = piuVicinoCaricato(i, pronti);
  if (j < 0 || j === attuale) return -1;
  if (attuale >= 0 && Math.abs(j - i) >= Math.abs(attuale - i)) return -1;
  return j;
}

/** Avanzamento dello zoom (0 → 1) su p 0,92 → 1, con ingresso e uscita morbidi. */
export function progressoZoom(p: number): number {
  const u = limita((p - TEMPI.zoomInizio) / (1 - TEMPI.zoomInizio));
  return u * u * (3 - 2 * u);
}
