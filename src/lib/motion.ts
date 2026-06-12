import type { Variants } from "framer-motion";

/**
 * Token di movimento condivisi — unica fonte di verità.
 * Easing "Vetrina": ease-out naturale, mai linear.
 */
export const EASE_VETRINA = [0.25, 0.46, 0.45, 0.94] as const;

/** Scala durate (secondi): micro-interazioni → momenti scenici. */
export const DURATA = {
  micro: 0.2,
  breve: 0.35,
  base: 0.5,
  rivelo: 0.8,
  scena: 1.2,
} as const;

/** Viewport standard per i reveal allo scroll. */
export const VIEWPORT_ONCE = { once: true, margin: "-80px" } as const;

/** Comparsa morbida dal basso. */
export const fadeUp = (y = 24, duration = DURATA.base, delay = 0): Variants => ({
  hidden: { opacity: 0, y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration, ease: EASE_VETRINA, delay },
  },
});

/**
 * Reveal "nella cornice": il testo sale dentro un wrapper overflow-hidden.
 * Il wrapper è la vetrina, il contenuto entra in mostra.
 * Richiede un padding di sicurezza sul wrapper per i discendenti di Fraunces.
 */
export const riveloMascherato = (delay = 0): Variants => ({
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: DURATA.rivelo, ease: EASE_VETRINA, delay },
  },
});

/** Linea che si disegna da sinistra (motivo "mensola"). */
export const riveloLinea = (delay = 0): Variants => ({
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: DURATA.rivelo, ease: EASE_VETRINA, delay },
  },
});

/** Contenitore che orchestra i figli in sequenza. */
export const contenitoreStagger = (
  stagger = 0.1,
  delayChildren = 0
): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});
