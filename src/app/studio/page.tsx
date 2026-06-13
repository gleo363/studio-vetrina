"use client";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerCards";
import { motion } from "framer-motion";
import {
  EASE_VETRINA,
  DURATA,
  fadeUp,
  riveloMascherato,
  riveloLinea,
} from "@/lib/motion";

const valori = [
  "Accogliente",
  "Curato",
  "Chiaro",
  "Orgoglioso del mestiere",
  "Romano",
];

const processo = [
  {
    step: "01",
    titolo: "Ascolto",
    tempo: "Giorno 1–2",
    descrizione:
      "Parliamo. Ci racconti la tua attività, i tuoi clienti, cosa ti piace e cosa non ti piace. Nessuna fretta.",
  },
  {
    step: "02",
    titolo: "Proposta",
    tempo: "Giorno 3–5",
    descrizione:
      "Ti presentiamo una proposta visiva: palette, font, struttura delle pagine. Niente codice ancora, prima vogliamo che tu dica sì.",
  },
  {
    step: "03",
    titolo: "Costruzione",
    tempo: "Giorno 6–18",
    descrizione:
      "Costruiamo il sito, pagina per pagina. Ogni due giorni ti aggiorniamo con un link di anteprima. Cambiamenti inclusi.",
  },
  {
    step: "04",
    titolo: "Consegna",
    tempo: "Giorno 19–21",
    descrizione:
      "Il sito va online. Ti insegniamo come aggiornarlo. Restiamo disponibili per i primi tre mesi.",
  },
];

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-travertino">
      {/* Hero */}
      <section className="pt-36 pb-24 px-6 alone-ocra">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={fadeUp(12, DURATA.base)}
            className="text-xs font-medium uppercase tracking-[0.2em] text-pietra mb-6"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Chi siamo
          </motion.p>
          <h1
            className="text-4xl md:text-5xl lg:text-[64px] font-medium text-inchiostro leading-[0.92] tracking-tight mb-12"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <motion.span className="block" variants={riveloMascherato(0.12)}>
                Siamo a Roma.
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <motion.span className="block" variants={riveloMascherato(0.24)}>
                Facciamo siti.
              </motion.span>
            </span>
          </h1>
          <motion.p
            variants={fadeUp(16, 0.6, 0.55)}
            className="text-lg md:text-xl text-pietra leading-relaxed max-w-2xl"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Studio Vetrina è uno studio di web design di Roma. Curiamo la
            presenza online delle piccole attività con la stessa attenzione
            con cui un negoziante cura la sua vetrina: con gusto, ordine e un
            po&apos; di orgoglio. Niente paroloni, niente inglese inutile:
            solo siti su misura, belli e facili da usare.
          </motion.p>
        </motion.div>
      </section>

      {/* Valori */}
      <section className="bg-glass px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="mb-12">
            <h2
              className="text-2xl md:text-3xl font-medium text-inchiostro"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Quello in cui crediamo.
            </h2>
          </AnimatedSection>

          <StaggerContainer className="flex flex-wrap gap-3">
            {valori.map((v) => (
              <StaggerItem key={v}>
                <motion.span
                  className="inline-block border border-inchiostro/15 rounded-full px-5 py-2.5 text-sm font-medium text-inchiostro bg-travertino cursor-default"
                  style={{ fontFamily: "var(--font-inter)" }}
                  whileHover={{
                    backgroundColor: "#1B1A18",
                    color: "#F3EEE4",
                    borderColor: "#1B1A18",
                  }}
                  transition={{ duration: 0.25, ease: EASE_VETRINA }}
                >
                  {v}
                </motion.span>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Processo */}
      <section className="bg-travertino px-6 py-28">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="mb-16">
            <h2
              className="text-3xl md:text-4xl font-medium text-inchiostro"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Come lavoriamo.
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-2 gap-8">
            {processo.map((p) => (
              <StaggerItem key={p.step}>
                <div className="pt-6 relative">
                  {/* La "mensola" che si disegna da sinistra */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-0.5 bg-inchiostro/10 origin-left"
                    variants={riveloLinea()}
                    aria-hidden="true"
                  />
                  <div className="flex items-baseline justify-between mb-4">
                    <span
                      className="text-sm font-medium text-pietra"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {p.step}
                    </span>
                    <span
                      className="text-xs text-cotto font-medium"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {p.tempo}
                    </span>
                  </div>
                  <h3
                    className="text-2xl font-medium text-inchiostro mb-3"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {p.titolo}
                  </h3>
                  <p
                    className="text-sm text-pietra leading-relaxed"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {p.descrizione}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
