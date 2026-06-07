"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function CopiaCodiceClient({ link }: { link: string }) {
  const [copiato, setCopiato] = useState(false);

  async function copia() {
    await navigator.clipboard.writeText(link);
    setCopiato(true);
    setTimeout(() => setCopiato(false), 2000);
  }

  return (
    <div className="flex flex-col gap-3">
      <p
        className="text-sm text-inchiostro/60 font-mono break-all"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {link}
      </p>
      <motion.button
        onClick={copia}
        className="self-start text-xs font-medium text-pietra hover:text-inchiostro transition-colors uppercase tracking-wider"
        style={{ fontFamily: "var(--font-inter)" }}
        whileTap={{ scale: 0.97 }}
        data-cursor="pointer"
      >
        {copiato ? "✓ Copiato!" : "Copia link →"}
      </motion.button>
    </div>
  );
}
