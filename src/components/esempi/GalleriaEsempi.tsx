"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerCards";

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

interface Vetrina {
  href: string;
  nome: string;
  settore: string;
  descrizione: string;
  // Mini-anteprima stilizzata: i colori della vetrina, non del brand
  anteprima: {
    sfondo: string;
    primario: string;
    testo: string;
    accento: string;
    serif: boolean;
  };
}

const vetrine: Vetrina[] = [
  {
    href: "/esempi/ristorante",
    nome: "Osteria del Vicolo",
    settore: "Ristorazione",
    descrizione:
      "Una trattoria romana che fa venire fame ancora prima di sedersi: menù, orari e tavolo prenotato in due tocchi.",
    anteprima: {
      sfondo: "#FAF2E2",
      primario: "#D8501C",
      testo: "#2E1F14",
      accento: "#E8B04B",
      serif: true,
    },
  },
  {
    href: "/esempi/salone",
    nome: "Atelier Sofia",
    settore: "Saloni e centri estetici",
    descrizione:
      "Parrucchieri e trattamenti estetici con listino chiaro e prenotazione dell'appuntamento direttamente dalla pagina.",
    anteprima: {
      sfondo: "#FFFFFF",
      primario: "#1C1C1E",
      testo: "#1C1C1E",
      accento: "#A06CD5",
      serif: false,
    },
  },
  {
    href: "/esempi/bottega",
    nome: "Fiori di Trastevere",
    settore: "Botteghe e negozi",
    descrizione:
      "Una bottega di fiori con la vetrina dei prodotti in bella mostra, la storia della famiglia e gli orari sempre aggiornati.",
    anteprima: {
      sfondo: "#F7F5F0",
      primario: "#7C8B6F",
      testo: "#2F3A2C",
      accento: "#C94F4F",
      serif: true,
    },
  },
  {
    href: "/esempi/studio",
    nome: "Falegnameria Marini",
    settore: "Artigiani e professionisti",
    descrizione:
      "Un laboratorio artigiano che si presenta con i lavori fatti, le competenze e un modulo per chiedere un preventivo.",
    anteprima: {
      sfondo: "#161412",
      primario: "#F5F3EF",
      testo: "#F5F3EF",
      accento: "#B08968",
      serif: false,
    },
  },
];

/** Miniatura astratta del sito: piccola gerarchia di blocchi nei colori della vetrina. */
function Anteprima({ v }: { v: Vetrina }) {
  const { sfondo, primario, testo, accento, serif } = v.anteprima;
  return (
    <div
      className="relative w-full aspect-[4/3] rounded-xl overflow-hidden p-4 flex flex-col gap-2.5"
      style={{ backgroundColor: sfondo }}
      aria-hidden="true"
    >
      {/* barra di navigazione finta */}
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-semibold tracking-wide leading-none"
          style={{
            color: testo,
            fontFamily: serif ? "Georgia, serif" : "var(--font-inter)",
          }}
        >
          {v.nome.split(" ")[0]}
        </span>
        <span className="flex gap-1">
          <span className="w-4 h-1 rounded-full" style={{ backgroundColor: `${testo}55` }} />
          <span className="w-4 h-1 rounded-full" style={{ backgroundColor: `${testo}55` }} />
          <span className="w-4 h-1 rounded-full" style={{ backgroundColor: accento }} />
        </span>
      </div>
      {/* titolo gigante finto */}
      <div className="flex flex-col gap-1.5 mt-1">
        <span className="h-3.5 w-3/4 rounded-sm" style={{ backgroundColor: primario }} />
        <span className="h-3.5 w-1/2 rounded-sm" style={{ backgroundColor: primario }} />
      </div>
      {/* blocco visivo + righe di contenuto */}
      <div className="flex gap-2 flex-1 mt-1">
        <div
          className="w-1/2 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${accento} 0%, ${primario} 100%)`,
          }}
        />
        <div className="w-1/2 flex flex-col gap-1.5 justify-center">
          <span className="h-1.5 w-full rounded-full" style={{ backgroundColor: `${testo}40` }} />
          <span className="h-1.5 w-5/6 rounded-full" style={{ backgroundColor: `${testo}40` }} />
          <span className="h-1.5 w-4/6 rounded-full" style={{ backgroundColor: `${testo}40` }} />
          <span
            className="h-4 w-16 rounded-full mt-1.5"
            style={{ backgroundColor: accento }}
          />
        </div>
      </div>
    </div>
  );
}

export default function GalleriaEsempi() {
  return (
    <div className="bg-travertino">
      {/* Hero */}
      <section className="px-6 pt-40 pb-20 md:pt-48 md:pb-24">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <p
              className="text-xs font-medium uppercase tracking-[0.2em] text-pietra mb-6"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Esempi
            </p>
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-medium text-inchiostro leading-[0.95] tracking-tight mb-8 max-w-3xl"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Quattro vetrine, quattro mondi.
            </h1>
            <p
              className="text-lg md:text-xl text-pietra max-w-2xl leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              In attesa dei primi lavori veri, abbiamo allestito quattro vetrine
              dimostrative, una per ciascuno dei settori che serviamo. Le
              attività sono di fantasia, la cura è quella vera: ogni vetrina ha
              colori, caratteri e atmosfera scelti su misura, perché è questo il
              nostro mestiere.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Schede */}
      <section className="px-6 pb-28">
        <div className="max-w-6xl mx-auto">
          <StaggerContainer className="grid sm:grid-cols-2 gap-6">
            {vetrine.map((v) => (
              <StaggerItem key={v.href}>
                <Link href={v.href} className="block h-full" data-cursor="pointer">
                  <motion.article
                    className="bg-glass rounded-2xl p-6 h-full flex flex-col"
                    whileHover={{
                      y: -6,
                      boxShadow: "0 24px 48px -16px rgba(27,26,24,0.18)",
                    }}
                    transition={{ duration: 0.3, ease }}
                  >
                    <Anteprima v={v} />
                    <div className="pt-6 flex flex-col flex-1">
                      <p
                        className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cotto mb-3"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {v.settore}
                      </p>
                      <h2
                        className="text-2xl font-medium text-inchiostro mb-3"
                        style={{ fontFamily: "var(--font-fraunces)" }}
                      >
                        {v.nome}
                      </h2>
                      <p
                        className="text-sm text-pietra leading-relaxed mb-5 flex-1"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {v.descrizione}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm font-medium text-inchiostro"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          Visita la vetrina →
                        </span>
                        <span
                          className="text-[10px] text-pietra/80"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          Vetrina dimostrativa · attività di fantasia
                        </span>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <AnimatedSection delay={0.2} className="mt-12">
            <p
              className="text-sm text-pietra max-w-xl leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Una precisazione onesta: queste attività non esistono. Le abbiamo
              inventate per mostrarti come lavoriamo, settore per settore. Quando
              arriveranno i primi clienti veri, questa pagina ospiterà i loro
              siti.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Chiusura / CTA */}
      <motion.section
        className="bg-cotto px-6 py-32 overflow-hidden"
        initial={{ clipPath: "inset(100% 0 0 0)" }}
        whileInView={{ clipPath: "inset(0% 0 0 0)" }}
        transition={{ duration: 1.0, ease }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-medium text-travertino leading-[1.05] mb-8 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease }}
            viewport={{ once: true }}
          >
            La tua vetrina sarà diversa da tutte queste. Sarà la tua.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/contatti"
                className="inline-flex items-center gap-2 bg-travertino text-inchiostro rounded-[10px] px-8 py-4 text-base font-medium hover:bg-glass transition-colors"
                style={{ fontFamily: "var(--font-inter)" }}
                data-cursor="pointer"
              >
                Apriamo la tua vetrina →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
