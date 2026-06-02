"use client";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function SezioneCtaFinale() {
  return (
    <motion.section
      className="bg-cotto px-6 py-32 overflow-hidden"
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      whileInView={{ clipPath: "inset(0% 0 0 0)" }}
      transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-medium text-travertino leading-[1.05] mb-8 max-w-2xl mx-auto"
          style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
        >
          Ogni attività merita la sua vetrina.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
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
    </motion.section>
  );
}
