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
import { Caricatore } from "./caricatore";
import {
  TEMPI,
  indiceFotogramma,
  angoliPerProgresso,
  progressoZoom,
  type DatiSequenza,
} from "./sequenza";
import {
  adattaCopertura,
  fotogrammaInFinestra,
  matrice3d,
  angoliZoom,
  altezzaFascia,
  trasformaZoom,
  type Quad,
} from "./geometria";

export type Formato = "desktop" | "mobile";

const DATI: Record<Formato, DatiSequenza> = {
  desktop: datiDesktop as unknown as DatiSequenza,
  mobile: datiMobile as unknown as DatiSequenza,
};

/** Fotogrammi decodificati tenuti in memoria attorno a quello corrente. */
const FINESTRA: Record<Formato, number> = { desktop: 8, mobile: 12 };

/** La copia compare nello schermo in s 0,85 → 0,90. */
const DISSOLVENZA_COPIA = 0.05;

interface Props {
  progresso: MotionValue<number>;
  copertina: RefObject<HTMLImageElement | null>;
  formato: Formato;
}

function ultimoQuad(dati: DatiSequenza): Quad | null {
  const chiavi = Object.keys(dati.angoli).map(Number);
  if (!chiavi.length) return null;
  return dati.angoli[String(Math.max(...chiavi))];
}

export default function SequenzaVetrina({ progresso, copertina, formato }: Props) {
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
    // Senza supporto AVIF il browser ha scelto la copertina WebP: resta l'immagine statica.
    if (dati.estensione === "avif" && !img.currentSrc.endsWith(".avif")) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const ultimo = ultimoQuad(dati);
    let vw = 0;
    let vh = 0;
    let dpr = 1;
    let cop = adattaCopertura(dati.larghezza, dati.altezza, 1, 1);
    let schermoFinale: Quad | null = null;
    let disegnato = -1;
    let raf = 0;

    const caricatore = new Caricatore(
      `/sequenza-vetrina/${formato}/`,
      dati,
      img,
      FINESTRA[formato],
      () => pianifica()
    );

    function aggiornaCopia(sv: number, t: number) {
      let quad: Quad | null = null;
      let h = vh;
      let opacita = 0;
      if (t > 0 && schermoFinale) {
        quad = angoliZoom(t, schermoFinale, vw, vh);
        h = altezzaFascia(t, schermoFinale, vw, vh);
        opacita = 1;
      } else {
        const q = angoliPerProgresso(sv, dati);
        if (q) {
          quad = fotogrammaInFinestra(q, cop);
          h = altezzaFascia(0, quad, vw, vh);
          opacita = Math.min(1, Math.max(0, (sv - TEMPI.schermoInizio) / DISSOLVENZA_COPIA));
        }
      }
      if (!quad || t >= 1) {
        // All'identità: prima dello schermo (invisibile) e alla fine dello zoom (nitida).
        inv!.style.transform = "";
        inv!.style.height = `${vh}px`;
        inv!.style.opacity = t >= 1 ? "1" : "0";
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
      raf = 0;
      const sv = s.get();
      const pv = progresso.get();
      const i = indiceFotogramma(sv, dati.fotogrammi, dati.primaClip);
      caricatore.imposta(i);
      const src = caricatore.sorgente(i);
      if (src && src.indice !== disegnato) {
        ctx!.drawImage(
          src.immagine,
          0,
          0,
          dati.larghezza,
          dati.altezza,
          cop.dx * dpr,
          cop.dy * dpr,
          dati.larghezza * cop.scala * dpr,
          dati.altezza * cop.scala * dpr
        );
        disegnato = src.indice;
        cv!.dataset.fotogramma = String(src.indice);
      }
      const t = progressoZoom(pv);
      if (t > 0 && schermoFinale) {
        const z = trasformaZoom(t, schermoFinale, vw);
        cv!.style.transform = `matrix(${z.k},0,0,${z.k},${z.tx},${z.ty})`;
      } else {
        cv!.style.transform = "";
      }
      aggiornaCopia(sv, t);
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
      schermoFinale = ultimo ? fotogrammaInFinestra(ultimo, cop) : null;
      disegnato = -1;
      pianifica();
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
      cv.style.transform = "";
      cv.removeAttribute("data-fotogramma");
    };
  }, [formato, progresso, s, copertina]);

  return (
    <>
      <canvas
        ref={canvas}
        aria-hidden="true"
        className="absolute inset-0 z-[1] h-full w-full origin-top-left"
      />
      <div
        ref={involucro}
        aria-hidden="true"
        inert
        className="pointer-events-none absolute left-0 top-0 z-[2] w-full origin-top-left overflow-hidden opacity-0"
        style={{ height: "100lvh" }}
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
