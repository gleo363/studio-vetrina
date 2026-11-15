/**
 * Scarica e decodifica i fotogrammi della scena.
 * - I file compressi (blob) si tengono tutti: sono pochi MB.
 * - Le bitmap decodificate solo in una finestra attorno al fotogramma corrente,
 *   perché a 1920 px ognuna pesa ~8 MB in memoria.
 * - Il fotogramma 0 è l'immagine di copertina già a schermo: non si riscarica.
 */
import { ordineCaricamento, piuVicinoCaricato, type DatiSequenza } from "./sequenza";

const CONCORRENZA = 6;

export type Sorgente = ImageBitmap | HTMLImageElement;

export class Caricatore {
  private readonly blob = new Map<number, Blob>();
  private readonly bitmap = new Map<number, ImageBitmap>();
  private readonly inDecodifica = new Set<number>();
  private readonly pronti = new Set<number>();
  private readonly controllo = new AbortController();
  private corrente = 0;
  private chiuso = false;

  constructor(
    private readonly base: string,
    private readonly dati: DatiSequenza,
    private readonly copertina: HTMLImageElement,
    private readonly finestra: number,
    private readonly quandoPronto: () => void
  ) {}

  private url(i: number) {
    return `${this.base}${String(i + 1).padStart(4, "0")}.${this.dati.estensione}`;
  }

  private copertinaPronta() {
    return this.copertina.complete && this.copertina.naturalWidth > 0;
  }

  /** Avvia i download. Con `partenza` > 0 (pagina ricaricata a metà) si parte dai vicini. */
  avvia(partenza: number) {
    const { fotogrammi: n, primaClip } = this.dati;
    const ordine = (
      partenza > 0
        ? ordineCaricamento(n, [0, primaClip, n - 1], partenza)
        : ordineCaricamento(n, [0, primaClip, n - 1])
    ).filter((i) => i !== 0);
    let prossimo = 0;
    const lavora = async () => {
      while (!this.chiuso && prossimo < ordine.length) {
        const i = ordine[prossimo++];
        try {
          const r = await fetch(this.url(i), {
            signal: this.controllo.signal,
            priority: "low",
          } as RequestInit);
          if (!r.ok) continue;
          this.blob.set(i, await r.blob());
          if (Math.abs(i - this.corrente) <= this.finestra) this.decodifica(i);
        } catch {
          if (this.chiuso) return;
        }
      }
    };
    for (let k = 0; k < CONCORRENZA; k++) void lavora();
  }

  private decodifica(i: number) {
    if (this.chiuso || this.bitmap.has(i) || this.inDecodifica.has(i)) return;
    const b = this.blob.get(i);
    if (!b) return;
    this.inDecodifica.add(i);
    createImageBitmap(b)
      .then((bmp) => {
        this.inDecodifica.delete(i);
        if (this.chiuso || Math.abs(i - this.corrente) > this.finestra) {
          bmp.close();
          return;
        }
        this.bitmap.set(i, bmp);
        this.pronti.add(i);
        this.quandoPronto();
      })
      .catch(() => this.inDecodifica.delete(i));
  }

  /** Sposta la finestra di decodifica sul fotogramma i: prima i più vicini. */
  imposta(i: number) {
    this.corrente = i;
    for (const [j, bmp] of this.bitmap) {
      if (Math.abs(j - i) > this.finestra) {
        bmp.close();
        this.bitmap.delete(j);
        this.pronti.delete(j);
      }
    }
    for (let d = 0; d <= this.finestra; d++) {
      this.decodifica(i + d);
      if (d) this.decodifica(i - d);
    }
  }

  /** Il fotogramma disegnabile più vicino a i, oppure null se non c'è niente di pronto. */
  sorgente(i: number): { indice: number; immagine: Sorgente } | null {
    const disponibili = this.copertinaPronta() ? new Set([...this.pronti, 0]) : this.pronti;
    const j = piuVicinoCaricato(i, disponibili);
    if (j < 0) return null;
    return { indice: j, immagine: j === 0 ? this.copertina : this.bitmap.get(j)! };
  }

  chiudi() {
    this.chiuso = true;
    this.controllo.abort();
    for (const bmp of this.bitmap.values()) bmp.close();
    this.bitmap.clear();
    this.pronti.clear();
    this.blob.clear();
  }
}
