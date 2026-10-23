"use client";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerCards";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { EASE_VETRINA, DURATA } from "@/lib/motion";

// Bozza dei testi di Assistenza e Rinnovo: da rivedere prima della pubblicazione.
const pacchetti: {
  nome: string;
  descrizione: string;
  voci: string[];
  extraTitolo?: string;
  extra?: string[];
  evidenziata: boolean;
}[] = [
  {
    nome: "Assistenza",
    descrizione: "Per chi ha già un sito online e vuole che resti sempre in ordine.",
    voci: [
      "Modifiche a testi, foto e pagine",
      "Aggiornamenti e controlli di sicurezza",
      "Verifica di funzionamento e velocità",
      "Risposta alle tue richieste",
      "Una persona di riferimento",
    ],
    evidenziata: false,
  },
  {
    nome: "Vetrina da zero",
    descrizione: "Il tuo sito nasce da una pagina bianca, costruito attorno alla tua attività.",
    voci: [
      "Hosting e un anno di dominio",
      "Supporto per un mese",
      "Ottimizzazione SEO",
      "Design personalizzato",
    ],
    extraTitolo: "In base alle tue necessità aggiungiamo anche:",
    extra: [
      "Prenotazioni integrate",
      "Blog integrato",
      "Aree riservate",
      "Integrazioni personalizzate",
      "...e molto altro ancora!",
    ],
    evidenziata: true,
  },
  {
    nome: "Rinnovo",
    descrizione: "Per chi ha già un sito che non rappresenta più la sua attività.",
    voci: [
      "Nuovo design su misura",
      "Testi e immagini rinnovati",
      "Contenuti esistenti mantenuti",
      "SEO rivista per non perdere posizioni",
      "Sito veloce e curato su ogni schermo",
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

                  {p.extra && (
                    <>
                      <motion.li
                        variants={voceItem}
                        className={`text-sm pt-3 mt-1 border-t ${
                          p.evidenziata
                            ? "text-travertino/60 border-travertino/15"
                            : "text-pietra border-linea"
                        }`}
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {p.extraTitolo}
                      </motion.li>
                      {p.extra.map((voce) => (
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
                          <span
                            className={p.evidenziata ? "text-travertino/80" : "text-pietra"}
                          >
                            {voce}
                          </span>
                        </motion.li>
                      ))}
                    </>
                  )}
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
