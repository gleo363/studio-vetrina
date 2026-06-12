"use client";
import { MotionConfig } from "framer-motion";

/**
 * Rispetta prefers-reduced-motion a livello globale:
 * framer-motion disattiva le animazioni di transform e mantiene
 * le dissolvenze di opacità. I motion value legati via `style`
 * (parallasse, cursore) e la mini-API animate() non sono coperti:
 * lì servono guardie useReducedMotion() locali.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
