"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerCards";
import Button from "@/components/ui/Button";
import { EASE_VETRINA as ease } from "@/lib/motion";
import { useTesti } from "@/components/providers/LinguaProvider";

// Bozza: testi da rivedere prima della pubblicazione.
const TESTI = {
  it: {
    eyebrow: "Q&A",
    titolo: "Le domande che ci fanno più spesso.",
    nonTrovi: "Non trovi la risposta che cerchi?",
    cta: "Scrivici →",
    domande: [
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
    ],
  },
  en: {
    eyebrow: "FAQ",
    titolo: "The questions we get asked most.",
    nonTrovi: "Can't find what you're looking for?",
    cta: "Write to us →",
    domande: [
      {
        domanda: "How much does a website cost?",
        risposta:
          "It depends on what you need, and we agree on the price together before we start. No surprises.",
      },
      {
        domanda: "How long does it take?",
        risposta:
          "We usually deliver within 21 days of kicking off, as long as we get the material we need from you on time.",
      },
      {
        domanda: "What do I need to give you?",
        risposta:
          "Not much: some information about your business, your logo if you have one and a few photos. We take care of the writing and everything else.",
      },
      {
        domanda: "Is the site really mine?",
        risposta:
          "Yes. You're not living on someone else's platform: the site belongs to you, and it won't vanish if you stop paying for a subscription.",
      },
      {
        domanda: "What happens after launch?",
        risposta:
          "You keep a direct line to a real person who gets back to you. If you need changes, or want the site to grow over time, we talk it through.",
      },
      {
        domanda: "How does the partner program work?",
        risposta:
          "If you know businesses that need a website, you can refer them to us as a partner. You'll find all the details on the Partners page.",
      },
    ],
  },
};

export default function QaPage() {
  const [aperta, setAperta] = useState<number | null>(null);
  const t = useTesti(TESTI);

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
              {t.eyebrow}
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-[64px] font-medium text-inchiostro leading-[0.92] tracking-tight mb-8 max-w-3xl"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              {t.titolo}
            </h1>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── DOMANDE ──────────────────────────────────────────────────────── */}
      <section className="bg-travertino px-6 pb-28">
        <div className="max-w-3xl mx-auto">
          <StaggerContainer className="flex flex-col" stagger={0.06}>
            {t.domande.map((d, i) => {
              const èAperta = aperta === i;
              return (
                <StaggerItem key={i}>
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
              {t.nonTrovi}
            </p>
            <Button href="/contatti" variant="primary">
              {t.cta}
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
