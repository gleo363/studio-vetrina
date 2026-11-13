"use client";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerCards";
import { motion } from "framer-motion";
import { EASE_VETRINA } from "@/lib/motion";
import { useTesti } from "@/components/providers/LinguaProvider";

const TESTI = {
  it: {
    titolo: "Curiamo la tua presenza online come tu curi la tua vetrina.",
    cards: [
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
          "In tre settimane il tuo sito è online, ottimizzato, e pronto a lavorare per te. Ti offriamo supporto per i primi 30 giorni.",
      },
    ],
  },
  en: {
    titolo: "We look after your business online the way you look after your shop window.",
    cards: [
      {
        numero: "01",
        titolo: "We listen",
        testo:
          "Every business has a story. Before we open an editor, we open our ears. We get to know who you are, where you want to go and who you want to reach.",
      },
      {
        numero: "02",
        titolo: "We design",
        testo:
          "Made to measure, never a template. Every detail is there to reflect who you are and to speak to your customers in their own language.",
      },
      {
        numero: "03",
        titolo: "We deliver",
        testo:
          "Three weeks later your site is live, fast and ready to work for you. And we stay close for the first 30 days.",
      },
    ],
  },
};

export default function SezioneSoluzione() {
  const t = useTesti(TESTI);
  return (
    <section className="bg-travertino px-6 py-28">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="mb-16 max-w-2xl">
          <h2
            className="text-3xl md:text-4xl lg:text-[44px] font-medium leading-[1.1] text-inchiostro"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            {t.titolo}
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-3 gap-6">
          {t.cards.map((card) => (
            <StaggerItem key={card.numero}>
              <motion.div
                className="group bg-glass border border-linea rounded-2xl p-8 h-full cursor-default"
                whileHover={{
                  y: -6,
                  boxShadow: "0 24px 48px -16px rgba(27,26,24,0.18)",
                }}
                transition={{ duration: 0.3, ease: EASE_VETRINA }}
              >
                <span
                  className="text-sm font-medium text-pietra block mb-6 transition-colors duration-300 group-hover:text-cotto"
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
