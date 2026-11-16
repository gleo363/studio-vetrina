"use client";
/**
 * Sequenza a fotogrammi "La vetrina che si accende" (caricata con next/dynamic, solo in home).
 * Il canvas disegna il fotogramma deciso dallo scroll ammorbidito (spring); nello schermo del
 * laptop una copia viva di SezioneProblema viene proiettata con matrix3d e poi ingrandita fino
 * a coincidere con la finestra. Nessun setState per fotogramma: solo ref e un rAF per cambio.
 */
import { useEffect, useRef, useState, type RefObject } from "react";
import { useSpring, type MotionValue } from "framer-motion";
import SezioneProblema from "@/components/home/SezioneProblema";
import SezioneSoluzione from "@/components/home/SezioneSoluzione";
import datiDesktop from "./dati/desktop.json";
import datiMobile from "./dati/mobile.json";
import { Caricatore, type Sorgente } from "./caricatore";
import {
  indiceFotogramma,
  angoliPerProgresso,
  progressoZoom,
  fotogrammaDaMostrare,
  opacitaCopia,
  type DatiSequenza,
} from "./sequenza";
import {
  adattaCopertura,
  fotogrammaInFinestra,
  matrice3d,
  angoliZoom,
  altezzaFascia,
  trasformaZoom,
  quasiFinestra,
  riempimenti,
  type Quad,
  type Rett,
} from "./geometria";

export type Formato = "desktop" | "mobile";

const DATI: Record<Formato, DatiSequenza> = {
  desktop: datiDesktop as unknown as DatiSequenza,
  mobile: datiMobile as unknown as DatiSequenza,
};

/** Fotogrammi decodificati tenuti in memoria attorno a quello corrente. */
const FINESTRA: Record<Formato, number> = { desktop: 6, mobile: 12 };

interface Props {
  progresso: MotionValue<number>;
  copertina: RefObject<HTMLImageElement | null>;
  formato: Formato;
  /** Il browser decodifica AVIF (deciso una volta, prima del primo montaggio). */
  avif: boolean;
}

function ultimoQuad(dati: DatiSequenza): Quad | null {
  const chiavi = Object.keys(dati.angoli).map(Number);
  if (!chiavi.length) return null;
  return dati.angoli[String(Math.max(...chiavi))];
}

function misureSorgente(img: Sorgente): [number, number] {
  return img instanceof HTMLImageElement
    ? [img.naturalWidth, img.naturalHeight]
    : [img.width, img.height];
}

export default function SequenzaVetrina({ progresso, copertina, formato, avif }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const involucro = useRef<HTMLDivElement>(null);
  const [copiaMontata, setCopiaMontata] = useState(false);
  const s = useSpring(progresso, {
    stiffness: 170,
    damping: 32,
    mass: 0.6,
    restDelta: 0.0005,
  });

  // La copia di SezioneProblema si monta a riposo, subito: le sue animazioni d'entrata
  // partono (invisibili) e finiscono molto prima che compaia nello schermo.
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setCopiaMontata(true), { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => setCopiaMontata(true), 300);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const cv = canvas.current;
    const inv = involucro.current;
    const img = copertina.current;
    const stage = cv?.parentElement;
    if (!cv || !inv || !img || !stage) return;
    const dati = DATI[formato];
    if (dati.estensione === "avif" && !avif) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const ultimo = ultimoQuad(dati);
    let vw = 0;
    let vh = 0;
    let dpr = 1;
    let cop = adattaCopertura(dati.larghezza, dati.altezza, 1, 1);
    let schermoFinale: Quad | null = null;
    let disegnato = -1;
    let zoomDisegnato = -1;
    let daRidisegnare = true;
    let raf = 0;

    const caricatore = new Caricatore(
      `/sequenza-vetrina/${formato}/`,
      dati,
      img,
      FINESTRA[formato],
      () => pianifica()
    );

    /**
     * Disegna il fotogramma con lo zoom t. Le zone che il fotogramma non copre (sul telefono il
     * fondo, nelle finestre quasi quadrate i lati) si riempiono allungando il bordo del
     * fotogramma: la copertina sotto il canvas non deve mai vedersi.
     */
    function disegnaTela(immagine: Sorgente, t: number) {
      const W = cv!.width;
      const H = cv!.height;
      let k = 1;
      let tx = 0;
      let ty = 0;
      if (t > 0 && schermoFinale) ({ k, tx, ty } = trasformaZoom(t, schermoFinale, vw));
      const r: Rett = {
        x: (cop.dx * k + tx) * dpr,
        y: (cop.dy * k + ty) * dpr,
        w: dati.larghezza * cop.scala * k * dpr,
        h: dati.altezza * cop.scala * k * dpr,
      };
      const [sw, sh] = misureSorgente(immagine);
      ctx!.drawImage(immagine, 0, 0, sw, sh, r.x, r.y, r.w, r.h);
      const sx = (x: number) => Math.min(sw - 1, Math.max(0, ((x - r.x) / r.w) * sw));
      const sy = (y: number) => Math.min(sh - 1, Math.max(0, ((y - r.y) / r.h) * sh));
      for (const { lato, dest } of riempimenti(r, W, H)) {
        let src: [number, number, number, number];
        if (lato === "alto" || lato === "basso") {
          src = [sx(dest.x), lato === "alto" ? 0 : sh - 1, Math.max(1, (dest.w / r.w) * sw), 1];
        } else if (lato === "sinistra" || lato === "destra") {
          src = [lato === "sinistra" ? 0 : sw - 1, sy(dest.y), 1, Math.max(1, (dest.h / r.h) * sh)];
        } else {
          src = [lato.endsWith("Sinistra") ? 0 : sw - 1, lato.startsWith("alto") ? 0 : sh - 1, 1, 1];
        }
        ctx!.drawImage(immagine, ...src, dest.x, dest.y, dest.w, dest.h);
      }
    }

    function aggiornaCopia(sv: number, pv: number, t: number) {
      let quad: Quad | null = null;
      let h = vh;
      if (t > 0 && schermoFinale) {
        quad = angoliZoom(t, schermoFinale, vw, vh);
        h = altezzaFascia(t, schermoFinale, vw, vh);
      } else {
        const q = angoliPerProgresso(sv, dati);
        if (q) {
          quad = fotogrammaInFinestra(q, cop);
          h = altezzaFascia(0, quad, vw, vh);
        }
      }
      const opacita = quad ? opacitaCopia(sv, pv) : 0;
      const arrivata = quad !== null && t > 0 && quasiFinestra(quad, vw, vh);
      if (!quad || arrivata || opacita === 0) {
        // All'identità: prima dello schermo (invisibile) e a fine zoom, quando lo
        // scarto è sotto il mezzo pixel (testo nitido come quello della pagina vera).
        inv!.style.transform = "";
        inv!.style.height = `${vh}px`;
        inv!.style.opacity = arrivata ? "1" : "0";
        return;
      }
      inv!.style.height = `${h}px`;
      inv!.style.transform = `matrix3d(${matrice3d(
        [
          [0, 0],
          [vw, 0],
          [vw, h],
          [0, h],
        ],
        quad
      ).join(",")})`;
      inv!.style.opacity = String(opacita);
    }

    function disegna() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      const sv = s.get();
      const pv = progresso.get();
      const t = progressoZoom(pv);
      const i = fotogrammaDaMostrare(sv, pv, dati.fotogrammi, dati.primaClip);
      caricatore.imposta(i);
      // Canvas appena svuotato (resize) e fotogramma non più in memoria: si riparte dal più vicino.
      if (daRidisegnare && !caricatore.ancora(disegnato)) disegnato = -1;
      const nuovo = caricatore.sorgente(i, disegnato);
      let immagine: Sorgente | null = null;
      if (nuovo) {
        immagine = nuovo.immagine;
        disegnato = nuovo.indice;
        cv!.dataset.fotogramma = String(nuovo.indice);
      } else if (daRidisegnare || t !== zoomDisegnato) {
        immagine = caricatore.ancora(disegnato);
      }
      if (immagine) {
        disegnaTela(immagine, t);
        zoomDisegnato = t;
        daRidisegnare = false;
      }
      aggiornaCopia(sv, pv, t);
    }

    function pianifica() {
      if (!raf) raf = requestAnimationFrame(disegna);
    }

    function misura() {
      const r = stage!.getBoundingClientRect();
      vw = r.width;
      vh = r.height;
      cop = adattaCopertura(dati.larghezza, dati.altezza, vw, vh);
      // Oltre la risoluzione del fotogramma non serve disegnare: si risparmia riempimento.
      dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 1 / cop.scala));
      cv!.width = Math.round(vw * dpr);
      cv!.height = Math.round(vh * dpr);
      caricatore.impostaMisura(dati.larghezza * cop.scala * dpr, dati.altezza * cop.scala * dpr);
      schermoFinale = ultimo ? fotogrammaInFinestra(ultimo, cop) : null;
      daRidisegnare = true;
      // Subito, non al prossimo rAF: il canvas appena ridimensionato è vuoto.
      disegna();
    }

    const ro = new ResizeObserver(misura);
    ro.observe(stage);
    misura();
    caricatore.avvia(indiceFotogramma(progresso.get(), dati.fotogrammi, dati.primaClip));
    const via1 = s.on("change", pianifica);
    const via2 = progresso.on("change", pianifica);

    return () => {
      via1();
      via2();
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      caricatore.chiudi();
      cv.removeAttribute("data-fotogramma");
    };
  }, [formato, avif, progresso, s, copertina]);

  return (
    <>
      <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 z-[1] h-full w-full" />
      <div
        ref={involucro}
        aria-hidden="true"
        inert
        className="pointer-events-none absolute left-0 top-0 z-[2] w-full origin-top-left overflow-hidden opacity-0"
        // Dimensioni esplicite: il layout della copia resta isolato dal resto della pagina.
        style={{ height: "100lvh", contain: "strict" }}
      >
        {/* Dove SezioneProblema è più bassa della finestra, sotto si vede già
            SezioneSoluzione: la copia deve mostrare entrambe per coincidere al pixel. */}
        {copiaMontata && (
          <>
            <SezioneProblema />
            <SezioneSoluzione />
          </>
        )}
      </div>
    </>
  );
}
