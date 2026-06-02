"use client";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerCards";
import { motion } from "framer-motion";

const cards = [
  {
    numero: "01",
    titolo: "Ascoltiamo",
    testo:
      "Ogni attività ha una storia. Prima di aprire un editor, apriamo le orecchie. Capiamo chi sei, dove vuoi arrivare e chi vuoi raggiungere.",
  },
  {
    numero: "02",
    titolo: "Progettiamo",
    testo:
      "Design su misura, non template. Ogni pixel pensato per rispecchiare la tua identità e parlare ai tuoi clienti nel loro linguaggio.",
  },
  {
    numero: "03",
    titolo: "Consegniamo",
    testo:
      "In tre settimane il tuo sito è online, ottimizzato, e pronto a lavorare per te. Con supporto incluso per i primi tre mesi.",
  },
];

export default function SezioneSoluzione() {
  return (
    <section className="bg-travertino px-6 py-28">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="mb-16 max-w-2xl">
          <h2
            className="text-3xl md:text-4xl lg:text-[44px] font-medium leading-[1.1] text-inchiostro"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Curiamo la tua presenza online come tu curi la tua vetrina.
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <StaggerItem key={card.numero}>
              <motion.div
                className="bg-glass rounded-2xl p-8 h-full cursor-default"
                whileHover={{
                  y: -6,
                  boxShadow: "0 24px 48px -16px rgba(27,26,24,0.18)",
                }}
                transition={{ duration: 0.3 }}
              >
                <span
                  className="text-sm font-medium text-pietra block mb-6"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {card.numero}
                </span>
                <h3
                  className="text-2xl font-medium text-inchiostro mb-4"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {card.titolo}
                </h3>
                <p
                  className="text-sm text-pietra leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {card.testo}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
