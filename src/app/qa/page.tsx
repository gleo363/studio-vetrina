"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerCards";
import Button from "@/components/ui/Button";
import { EASE_VETRINA as ease } from "@/lib/motion";

// Bozza: testi da rivedere prima della pubblicazione.
const domande = [
  {
    domanda: "Quanto costa un sito?",
    risposta:
      "Il prezzo dipende da cosa ti serve, e lo definiamo insieme prima di iniziare. Nessuna sorpresa.",
  },
  {
    domanda: "Quanto tempo ci vuole?",
    risposta:
      "In genere consegniamo in 21 giorni dall'avvio del progetto, a patto di ricevere in tempo i materiali che ci servono.",
  },
  {
    domanda: "Cosa devo fornirti?",
    risposta:
      "Poco: le informazioni sulla tua attività, il logo se ce l'hai e qualche foto. Ai testi e al resto pensiamo noi.",
  },
  {
    domanda: "Il sito è davvero mio?",
    risposta:
      "Sì. Non vivi su una piattaforma altrui: il sito è tuo e non sparisce se smetti di pagare un abbonamento.",
  },
  {
    domanda: "Cosa succede dopo la consegna?",
    risposta:
      "Resti in contatto con una persona che ti risponde. Se hai bisogno di modifiche o di far crescere il sito nel tempo, ne parliamo.",
  },
  {
    domanda: "Come funziona il programma partner?",
    risposta:
      "Se conosci attività che hanno bisogno di un sito, puoi segnalarcele come partner. Trovi tutti i dettagli nella pagina Partner.",
  },
];

export default function QaPage() {
  const [aperta, setAperta] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-travertino">
      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-travertino pt-36 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <p
              className="text-xs font-medium uppercase tracking-[0.2em] text-pietra mb-6"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Q&amp;A
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-[64px] font-medium text-inchiostro leading-[0.92] tracking-tight mb-8 max-w-3xl"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Le domande che ci fanno più spesso.
            </h1>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── DOMANDE ──────────────────────────────────────────────────────── */}
      <section className="bg-travertino px-6 pb-28">
        <div className="max-w-3xl mx-auto">
          <StaggerContainer className="flex flex-col" stagger={0.06}>
            {domande.map((d, i) => {
              const èAperta = aperta === i;
              return (
                <StaggerItem key={d.domanda}>
                  <div className="border-b border-linea">
                    <h2>
                      <button
                        type="button"
                        className="w-full flex items-center justify-between gap-6 py-6 text-left"
                        aria-expanded={èAperta}
                        aria-controls={`qa-risposta-${i}`}
                        id={`qa-domanda-${i}`}
                        onClick={() => setAperta(èAperta ? null : i)}
                      >
                        <span
                          className="text-xl md:text-2xl font-medium text-inchiostro"
                          style={{ fontFamily: "var(--font-fraunces)" }}
                        >
                          {d.domanda}
                        </span>
                        <motion.span
                          className="text-2xl text-cotto shrink-0"
                          animate={{ rotate: èAperta ? 45 : 0 }}
                          transition={{ duration: 0.25, ease }}
                          aria-hidden="true"
                        >
                          +
                        </motion.span>
                      </button>
                    </h2>
                    <AnimatePresence initial={false}>
                      {èAperta && (
                        <motion.div
                          id={`qa-risposta-${i}`}
                          role="region"
                          aria-labelledby={`qa-domanda-${i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease }}
                          className="overflow-hidden"
                        >
                          <p
                            className="pb-6 text-base md:text-lg leading-relaxed text-pietra max-w-2xl"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            {d.risposta}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          <AnimatedSection delay={0.2} className="mt-16">
            <p
              className="text-lg text-pietra mb-6"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Non trovi la risposta che cerchi?
            </p>
            <Button href="/contatti" variant="primary">
              Scrivici →
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
