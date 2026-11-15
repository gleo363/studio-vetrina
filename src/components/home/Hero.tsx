"use client";
import {
  cubicBezier,
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Button from "@/components/ui/Button";
import { EASE_VETRINA, DURATA, riveloMascherato, fadeUp } from "@/lib/motion";
import { TEMPI } from "@/components/home/vetrina/sequenza";

const easeUscita = cubicBezier(...EASE_VETRINA);

interface HeroProps {
  /** Progresso della sezione "La vetrina che si accende" (0 → 1). */
  progresso: MotionValue<number>;
  /** Riporta in cima alla sezione (focus da tastiera dopo che il testo è sparito). */
  richiama: () => void;
}

/**
 * Hero sopra il primo fotogramma della scena: entra una volta al caricamento e
 * sparisce nel primo 10% dello scroll della sezione (opacità e leggero salto in alto).
 */
export default function Hero({ progresso, richiama }: HeroProps) {
  const riduciMovimento = useReducedMotion();
  // Con prefers-reduced-motion i range collassano: testo fermo e visibile,
  // stile iniziale identico tra server e client.
  const opacity = useTransform(
    progresso,
    [0, TEMPI.titoloFine],
    riduciMovimento ? [1, 1] : [1, 0],
    { ease: easeUscita }
  );
  const y = useTransform(
    progresso,
    [0, TEMPI.titoloFine],
    riduciMovimento ? [0, 0] : [0, -32],
    { ease: easeUscita }
  );
  const pointerEvents = useTransform(opacity, (v) => (v < 0.05 ? "none" : "auto"));

  return (
    <div
      className="absolute inset-0 z-30 flex items-center portrait:items-start"
      onFocusCapture={richiama}
    >
      <motion.div
        aria-hidden="true"
        className="velatura-vetrina pointer-events-none absolute inset-0"
        style={{ opacity }}
      />
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 w-full pt-20 portrait:pt-28"
        style={{ y, opacity, pointerEvents }}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={fadeUp(12, DURATA.base)}
          className="text-xs font-medium uppercase tracking-[0.2em] text-travertino/70 mb-8"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Studio Vetrina · Roma
        </motion.p>

        <h1
          className="text-[clamp(56px,9vw,108px)] font-medium text-travertino leading-[0.92] mb-7 tracking-tight"
          style={{
            fontFamily: "var(--font-fraunces)",
            fontOpticalSizing: "auto",
          } as React.CSSProperties}
        >
          {/* Ogni riga entra "nella cornice": maschera overflow-hidden. */}
          <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <motion.span className="block" variants={riveloMascherato(0.15)}>
              La tua vetrina
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <motion.span className="block" variants={riveloMascherato(0.27)}>
              sul mondo.
            </motion.span>
          </span>
        </h1>

        <motion.p
          variants={fadeUp(16, 0.6, 0.65)}
          className="text-xl md:text-2xl text-travertino/80 mb-12 max-w-lg leading-snug"
          style={{
            fontFamily: "var(--font-fraunces)",
            fontStyle: "italic",
          }}
        >
          Siti web su misura per le piccole attività.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4 items-center"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08, delayChildren: 0.85 },
            },
          }}
        >
          <motion.div variants={fadeUp(14, DURATA.base)}>
            <Button href="/contatti" variant="primary" className="text-base px-7 py-4">
              Apriamo la tua vetrina →
            </Button>
          </motion.div>
          <motion.div variants={fadeUp(14, DURATA.base)}>
            <Button href="/esempi" variant="ghost-chiaro" className="text-base px-7 py-4">
              Guarda gli esempi
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
