"use client";
import { motion } from "framer-motion";
import { EASE_VETRINA, DURATA } from "@/lib/motion";
import { useTesti } from "@/components/providers/LinguaProvider";

const TESTI = {
  it: { titolo: "Ogni attività merita la sua vetrina.", cta: "Parliamone davanti a un caffè" },
  en: { titolo: "Every business deserves a window worth stopping for.", cta: "Let's talk over coffee" },
};

export default function SezioneCtaFinale() {
  const t = useTesti(TESTI);
  return (
    // Lo sfondo rosso è sempre dipinto: il reveal vive solo sul contenuto,
    // così uno scroll veloce non lascia mai un buco color travertino.
    <section className="bg-cotto vignetta-inchiostro px-6 py-32 overflow-hidden">
      {/* Il trigger vive sul contenitore: l'osservatore di Chrome tiene
          conto del clip-path del target, quindi un h2 clippato al 100%
          non raggiungerebbe mai la soglia di visibilità. */}
      <motion.div
        className="max-w-6xl mx-auto text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.h2
          className="text-4xl md:text-5xl lg:text-6xl font-medium text-travertino leading-[1.05] mb-8 max-w-2xl mx-auto"
          style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}
          variants={{
            hidden: { opacity: 0, y: 40, clipPath: "inset(0 0 100% 0)" },
            visible: {
              opacity: 1,
              y: 0,
              clipPath: "inset(0 0 0% 0)",
              transition: { duration: 0.9, ease: EASE_VETRINA },
            },
          }}
        >
          {t.titolo}
        </motion.h2>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: DURATA.rivelo,
                delay: 0.25,
                ease: EASE_VETRINA,
              },
            },
          }}
        >
          <motion.div
            className="inline-flex"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: DURATA.micro, ease: EASE_VETRINA }}
          >
            <a
              href="/contatti"
              className="inline-flex items-center gap-2 bg-travertino text-inchiostro rounded-[10px] px-8 py-4 text-base font-medium hover:bg-glass transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {t.cta}
              <span className="freccia" aria-hidden="true">
                →
              </span>
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
