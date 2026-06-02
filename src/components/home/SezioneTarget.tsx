"use client";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerCards";
import { motion } from "framer-motion";

const categorie = [
  {
    emoji: "🍕",
    nome: "Ristoranti e bar",
    bisogno: "Essere trovati su Google e mostrare il menu online.",
  },
  {
    emoji: "💇",
    nome: "Saloni e centri estetici",
    bisogno: "Prenotazioni online e calendario sempre aggiornato.",
  },
  {
    emoji: "🛍️",
    nome: "Boutique e negozi",
    bisogno: "Una presenza digitale all'altezza del negozio fisico.",
  },
  {
    emoji: "🔧",
    nome: "Artigiani e professionisti",
    bisogno: "Credibilità online per acquisire nuovi clienti.",
  },
];

export default function SezioneTarget() {
  return (
    <section className="bg-glass px-6 py-28">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="mb-16">
          <h2
            className="text-3xl md:text-4xl lg:text-[44px] font-medium leading-[1.1] text-inchiostro max-w-xl"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Le attività che danno anima a Roma.
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categorie.map((cat) => (
            <StaggerItem key={cat.nome}>
              <motion.div
                className="bg-travertino rounded-2xl p-7 h-full cursor-default"
                whileHover={{
                  y: -6,
                  boxShadow: "0 24px 48px -16px rgba(27,26,24,0.18)",
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-4xl mb-5 block">{cat.emoji}</span>
                <h3
                  className="text-lg font-medium text-inchiostro mb-3"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {cat.nome}
                </h3>
                <p
                  className="text-sm text-pietra leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {cat.bisogno}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
