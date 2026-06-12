"use client";
import { motion } from "framer-motion";
import { EASE_VETRINA, DURATA, VIEWPORT_ONCE } from "@/lib/motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  y = 40,
  duration = DURATA.rivelo,
}: AnimatedSectionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration, ease: EASE_VETRINA, delay }}
      viewport={VIEWPORT_ONCE}
    >
      {children}
    </motion.div>
  );
}
