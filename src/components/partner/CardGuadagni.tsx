"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface CardGuadagniProps {
  maturate: number;
  inAttesa: number;
  liquidate: number;
}

function useCountUp(target: number, duration = 1.2) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    function step(now: number) {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * ease));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    }
    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration]);

  return value;
}

function Voce({
  label,
  valore,
  delay,
}: {
  label: string;
  valore: number;
  delay: number;
}) {
  const animato = useCountUp(valore);

  return (
    <motion.div
      className="bg-glass rounded-2xl p-6 flex flex-col gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <p
        className="text-xs font-medium text-pietra uppercase tracking-wider"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {label}
      </p>
      <p
        className="text-3xl font-medium text-inchiostro"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        € {animato.toLocaleString("it-IT")}
      </p>
    </motion.div>
  );
}

export default function CardGuadagni({
  maturate,
  inAttesa,
  liquidate,
}: CardGuadagniProps) {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <Voce label="Commissioni maturate" valore={maturate} delay={0} />
      <Voce label="In attesa (firmate)" valore={inAttesa} delay={0.1} />
      <Voce label="Già liquidate" valore={liquidate} delay={0.2} />
    </div>
  );
}
