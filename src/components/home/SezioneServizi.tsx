"use client";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerCards";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { EASE_VETRINA, DURATA } from "@/lib/motion";

const pacchetti = [
  {
    nome: "Vetrina Essenziale",
    prezzo: "€ 990",
    descrizione: "Il punto di partenza perfetto per chi vuole farsi trovare online.",
    voci: [
      "Fino a 5 pagine su misura",
      "Design personalizzato",
      "Hosting incluso",
      "Ottimizzazione SEO di base",
      "Supporto 3 mesi",
    ],
    evidenziata: false,
  },
  {
    nome: "Vetrina Completa",
    prezzo: "€ 1.890",
    descrizione: "Per chi vuole una presenza online completa e strumenti per crescere.",
    voci: [
      "Fino a 10 pagine su misura",
      "Blog integrato",
      "Prenotazioni online",
      "SEO avanzata",
      "Supporto 6 mesi",
    ],
    evidenziata: true,
  },
  {
    nome: "Vetrina su Misura",
    prezzo: "Su misura",
    descrizione: "Soluzioni complesse per chi ha esigenze specifiche o vuole crescere.",
    voci: [
      "E-commerce",
      "Portali e aree riservate",
      "Integrazioni personalizzate",
      "App web",
      "Supporto dedicato",
    ],
    evidenziata: false,
  },
];

// Le voci del listino "si compongono" una alla volta dentro la card.
const vociContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.2 },
  },
};

const voceItem = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATA.breve, ease: EASE_VETRINA },
  },
};

export default function SezioneServizi() {
  return (
    <section className="bg-travertino px-6 py-28">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="mb-16 max-w-xl">
          <h2
            className="text-3xl md:text-4xl lg:text-[44px] font-medium leading-[1.1] text-inchiostro"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Tre pacchetti, zero sorprese.
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-3 gap-6 items-start">
          {pacchetti.map((p) => (
            <StaggerItem key={p.nome}>
              <motion.div
                className={`rounded-2xl p-8 h-full flex flex-col cursor-default ${
                  p.evidenziata
                    ? "bg-inchiostro text-travertino ring-2 ring-cotto"
                    : "bg-glass text-inchiostro border border-linea"
                }`}
                variants={
                  p.evidenziata
                    ? {
                        hidden: { scale: 0.985 },
                        visible: {
                          scale: 1,
                          transition: { duration: DURATA.rivelo, ease: EASE_VETRINA },
                        },
                      }
                    : undefined
                }
                whileHover={{
                  y: -6,
                  boxShadow: p.evidenziata
                    ? "0 24px 48px -16px rgba(191,77,44,0.35)"
                    : "0 24px 48px -16px rgba(27,26,24,0.18)",
                }}
                transition={{ duration: 0.3, ease: EASE_VETRINA }}
              >
                {p.evidenziata && (
                  <span
                    className="text-xs font-medium text-cotto uppercase tracking-widest mb-4 block"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Più scelto
                  </span>
                )}
                <h3
                  className="text-2xl font-medium mb-2"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {p.nome}
                </h3>
                <p
                  className={`text-sm leading-relaxed mb-6 ${
                    p.evidenziata ? "text-travertino/60" : "text-pietra"
                  }`}
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {p.descrizione}
                </p>

                <p
                  className="text-4xl font-medium mb-8"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {p.prezzo}
                </p>

                <motion.ul
                  className="flex-1 flex flex-col gap-3 mb-8"
                  variants={vociContainer}
                >
                  {p.voci.map((voce) => (
                    <motion.li
                      key={voce}
                      variants={voceItem}
                      className="flex items-start gap-2.5 text-sm"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      <Check
                        size={16}
                        strokeWidth={2.5}
                        className={`mt-0.5 shrink-0 ${
                          p.evidenziata ? "text-ocra" : "text-cotto"
                        }`}
                        aria-hidden="true"
                      />
                      <span className={p.evidenziata ? "text-travertino/80" : "text-pietra"}>
                        {voce}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>

                <Button
                  href="/contatti"
                  variant={p.evidenziata ? "primary" : "ghost"}
                  className={`w-full justify-center ${
                    !p.evidenziata ? "border-inchiostro/20" : ""
                  }`}
                >
                  Parliamone →
                </Button>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
