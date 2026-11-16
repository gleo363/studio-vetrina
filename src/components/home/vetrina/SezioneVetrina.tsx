"use client";
/**
 * "La vetrina che si accende": sezione della home lunga 300 lvh che ingloba l'Hero.
 * - Lo stage resta fisso a schermo (sticky) per i 200 lvh utili; il progresso p va da 0 a 1.
 * - La copertina (primo fotogramma) è nell'HTML del server: è l'LCP e lo sfondo dell'Hero.
 * - La sequenza a fotogrammi si carica solo dopo il load, a riposo, e mai con reduced-motion.
 * - A p = 1 la copia di SezioneProblema coincide con quella vera (sotto, sovrapposta agli
 *   ultimi 100 lvh): lo stage si nasconde e resta il sito vero.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import Hero from "@/components/home/Hero";
import { TEMPI } from "./sequenza";
import type { Formato } from "./SequenzaVetrina";

const SequenzaVetrina = dynamic(() => import("./SequenzaVetrina"), { ssr: false });

const RITRATTO = "(orientation: portrait)";

export default function SezioneVetrina() {
  const sezione = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const copertina = useRef<HTMLImageElement>(null);
  const misure = useRef({ top: 0, corsa: 0 });
  const progresso = useMotionValue(0);
  const { scrollY } = useScroll();
  const [formato, setFormato] = useState<Formato | null>(null);

  const aggiorna = useCallback(
    (y: number) => {
      const { top, corsa } = misure.current;
      // corsa < 1: sezione alta quanto lo stage (reduced-motion), niente scena.
      const p = corsa < 1 ? 0 : Math.min(1, Math.max(0, (y - top) / corsa));
      progresso.set(p);
      const st = stage.current;
      if (st) st.style.visibility = corsa >= 1 && p >= 1 ? "hidden" : "";
    },
    [progresso]
  );

  useMotionValueEvent(scrollY, "change", aggiorna);

  useEffect(() => {
    const el = sezione.current;
    const st = stage.current;
    if (!el || !st) return;
    const misura = () => {
      misure.current = {
        top: el.getBoundingClientRect().top + window.scrollY,
        corsa: el.offsetHeight - st.offsetHeight,
      };
      aggiorna(window.scrollY);
    };
    const ro = new ResizeObserver(misura);
    ro.observe(el);
    ro.observe(st);
    misura();
    return () => ro.disconnect();
  }, [aggiorna]);

  // Avvio della sequenza: dopo il load e la copertina, a riposo; mai con reduced-motion,
  // con il risparmio dati attivo o senza AVIF (i fotogrammi sono AVIF).
  useEffect(() => {
    const movimento = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ritratto = window.matchMedia(RITRATTO);
    const connessione = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (movimento.matches || connessione?.saveData) return;
    let annullato = false;
    let idle = 0;
    const scegli = () => {
      // Il supporto AVIF si legge una volta sola, dalla copertina scelta dal browser:
      // dopo una rotazione currentSrc è vuoto finché non arriva l'altra copertina.
      if (!copertina.current?.currentSrc.endsWith(".avif")) return;
      setFormato(ritratto.matches ? "mobile" : "desktop");
    };
    const avvia = () => {
      if (annullato) return;
      if ("requestIdleCallback" in window) {
        idle = window.requestIdleCallback(scegli, { timeout: 2000 });
      } else {
        idle = Number(setTimeout(scegli, 200));
      }
    };
    const img = copertina.current;
    const dopoCopertina = () => {
      if (img && !img.complete) img.addEventListener("load", avvia, { once: true });
      else avvia();
    };
    if (document.readyState === "complete") dopoCopertina();
    else window.addEventListener("load", dopoCopertina, { once: true });
    // Rotazione del telefono: si passa all'altro insieme di fotogrammi.
    const cambio = () => setFormato((f) => (f ? (ritratto.matches ? "mobile" : "desktop") : f));
    ritratto.addEventListener("change", cambio);
    return () => {
      annullato = true;
      window.removeEventListener("load", dopoCopertina);
      img?.removeEventListener("load", avvia);
      ritratto.removeEventListener("change", cambio);
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(idle);
      clearTimeout(idle);
    };
  }, []);

  // Le sezioni vere sotto la scena devono essere già "entrate" (contatori finiti) quando la
  // copia nello schermo lascia il posto a loro. Al primo scroll, con la scena ancora davanti
  // (p < 0,5), le si porta per un attimo dentro la finestra, coperte dallo stage opaco: le loro
  // animazioni d'entrata partono ora, come quelle della copia. Un transform non sposta il
  // layout (niente CLS); farlo solo dopo il primo scroll lascia fuori il suo titolo dall'LCP.
  const sezioniPreparate = useRef(false);
  useEffect(() => {
    if (!formato || sezioniPreparate.current) return;
    let id = 0;
    let dopo: HTMLElement | null = null;
    const prova = (v: number) => {
      if (sezioniPreparate.current || v <= 0) return;
      sezioniPreparate.current = true;
      // Non disiscriversi durante la notifica: framer-motion salterebbe l'iscritto
      // successivo (lo spring della sequenza) e il canvas resterebbe fermo.
      queueMicrotask(via);
      if (v >= 0.5) return;
      dopo = document.querySelector<HTMLElement>("[data-dopo-scena]");
      if (!dopo) return;
      dopo.style.transform = `translateY(${-dopo.getBoundingClientRect().top}px)`;
      id = window.setTimeout(() => {
        if (dopo) dopo.style.transform = "";
      }, 400);
    };
    const via = progresso.on("change", prova);
    return () => {
      via();
      clearTimeout(id);
      if (dopo) dopo.style.transform = "";
    };
  }, [formato, progresso]);

  // Il focus da tastiera su un pulsante dell'Hero già sparito riporta in cima alla sezione.
  const richiama = useCallback(() => {
    if (progresso.get() > TEMPI.titoloFine) {
      window.scrollTo({ top: misure.current.top, behavior: "smooth" });
    }
  }, [progresso]);

  const grana = useTransform(progresso, [TEMPI.zoomInizio, 1], [1, 0]);

  return (
    <section
      ref={sezione}
      data-scena-vetrina=""
      // La sezione si sovrappone agli ultimi 100 lvh di SezioneProblema: solo lo stage
      // riceve il puntatore, così dopo il passaggio la pagina vera resta cliccabile.
      className="pointer-events-none relative z-10 h-[300lvh] motion-reduce:h-svh"
    >
      <div
        ref={stage}
        data-stage-vetrina=""
        className="pointer-events-auto sticky top-0 h-lvh overflow-hidden bg-inchiostro [contain:strict] motion-reduce:h-svh"
      >
        <picture>
          <source media={RITRATTO} type="image/avif" srcSet="/vetrina-copertina/mobile.avif" />
          <source media={RITRATTO} type="image/webp" srcSet="/vetrina-copertina/mobile.webp" />
          <source type="image/avif" srcSet="/vetrina-copertina/desktop.avif" />
          {/* Immagine decorativa già ottimizzata (AVIF/WebP a misura): next/image non serve.
              Senza fetchPriority alta: copre tutta la finestra, quindi Chrome non la conta come
              LCP (l'LCP è il titolo dell'Hero, già visibile nell'HTML); Chrome la alza comunque
              a High quando è nella finestra, ma senza scavalcare CSS e font. */}
          <img
            ref={copertina}
            src="/vetrina-copertina/desktop.webp"
            alt=""
            aria-hidden="true"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>

        {formato && (
          <SequenzaVetrina
            key={formato}
            progresso={progresso}
            copertina={copertina}
            formato={formato}
            avif
          />
        )}

        <Hero progresso={progresso} richiama={richiama} />

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-40"
          style={{ opacity: grana }}
        >
          <div className="grana-vetrina absolute inset-0" />
        </motion.div>
      </div>
    </section>
  );
}
