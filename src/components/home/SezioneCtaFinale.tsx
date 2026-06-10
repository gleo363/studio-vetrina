"use client";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function SezioneCtaFinale() {
  return (
    // Lo sfondo rosso è sempre dipinto: il reveal vive solo sul contenuto,
    // così uno scroll veloce non lascia mai un buco color travertino.
    <section className="bg-cotto px-6 py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-medium text-travertino leading-[1.05] mb-8 max-w-2xl mx-auto"
          style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}
          initial={{ opacity: 0, y: 40, clipPath: "inset(0 0 100% 0)" }}
          whileInView={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true, amount: 0.4 }}
        >
          Ogni attività merita la sua vetrina.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            <a
              href="/contatti"
              className="inline-flex items-center gap-2 bg-travertino text-inchiostro rounded-[10px] px-8 py-4 text-base font-medium hover:bg-glass transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Parliamone davanti a un caffè →
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
