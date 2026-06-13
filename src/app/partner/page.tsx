"use client";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/StaggerCards";
import Link from "next/link";
import { motion } from "framer-motion";
import { DURATA, fadeUp, riveloMascherato, riveloLinea } from "@/lib/motion";

const STEP = [
  {
    n: "01",
    titolo: "Iscriviti",
    desc: "Registrati in un minuto e ricevi il tuo codice personale, il tuo link e il tuo QR.",
  },
  {
    n: "02",
    titolo: "Condividi",
    desc: "Passa il link o fai scansionare il QR alle attività che conosci e che meriterebbero una bella vetrina online.",
  },
  {
    n: "03",
    titolo: "Guadagna",
    desc: "Quando firmano e pagano il progetto, il 10% è tuo. Trasparente, automatico.",
  },
];

export default function PartnerPage() {
  return (
    <div>
      {/* Hero */}
      <section className="min-h-[80vh] bg-travertino alone-ocra flex items-center px-6 pt-32 pb-24">
        <motion.div
          className="max-w-6xl mx-auto w-full"
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={fadeUp(12, DURATA.base)}
            className="text-xs font-medium uppercase tracking-[0.2em] text-pietra mb-6"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Programma Partner
          </motion.p>
          <h1
            className="text-5xl md:text-6xl lg:text-[80px] font-medium text-inchiostro leading-[0.95] tracking-tight max-w-3xl mb-8"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <motion.span className="block" variants={riveloMascherato(0.12)}>
                Diventa partner.
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <motion.span className="block" variants={riveloMascherato(0.24)}>
                <em>Guadagna il 10%.</em>
              </motion.span>
            </span>
          </h1>
          <motion.p
            variants={fadeUp(16, 0.6, 0.55)}
            className="text-lg text-inchiostro/60 max-w-xl mb-10 leading-relaxed"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Conosci un&apos;attività che meriterebbe una bella vetrina online?
            Presentacela. Per ogni cliente che firma e paga, guadagni il 10%
            del progetto.
          </motion.p>
          <motion.div
            variants={fadeUp(14, DURATA.base, 0.75)}
            className="flex items-center gap-6 flex-wrap"
          >
            <Button href="/partner/registrati" variant="primary">
              Crea il tuo codice →
            </Button>
            <Link
              href="/partner/accedi"
              className="link-sottolineato text-sm text-inchiostro/60 hover:text-inchiostro transition-colors"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Hai già un codice? Accedi
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Come funziona */}
      <section className="bg-glass px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="mb-16">
            <h2
              className="text-3xl md:text-4xl font-medium text-inchiostro"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Come funziona
            </h2>
          </AnimatedSection>
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {STEP.map((s) => (
              <StaggerItem key={s.n}>
                <div className="bg-travertino border border-linea rounded-2xl p-8">
                  <p
                    className="text-5xl font-medium text-cotto/20"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {s.n}
                  </p>
                  {/* La "mensola": eco della cornice del marchio */}
                  <motion.div
                    className="h-px w-7 bg-ocra/60 origin-left my-4"
                    variants={riveloLinea()}
                    aria-hidden="true"
                  />
                  <h3
                    className="text-xl font-medium text-inchiostro mb-3"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {s.titolo}
                  </h3>
                  <p
                    className="text-sm text-inchiostro/60 leading-relaxed"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {s.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Esempio guadagno */}
      <section className="bg-inchiostro px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <p
              className="text-xs font-medium uppercase tracking-[0.2em] text-travertino/40 mb-8"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Quanto puoi guadagnare
            </p>
            <div className="flex flex-col gap-6">
              <p
                className="text-3xl md:text-4xl font-medium text-travertino"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Un progetto da{" "}
                <span className="text-ocra">€&nbsp;1.890</span>
                &nbsp;→ tu guadagni{" "}
                <span className="text-cotto">€&nbsp;189.</span>
              </p>
              <p
                className="text-3xl md:text-4xl font-medium text-travertino"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Presenta 5 attività in un anno&nbsp;→ fino a{" "}
                <span className="text-cotto">€&nbsp;945.</span>
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA finale */}
      <section className="bg-cotto vignetta-inchiostro px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <p
              className="text-xs font-medium uppercase tracking-[0.2em] text-travertino/60 mb-6"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Inizia adesso
            </p>
            <h2
              className="text-4xl md:text-5xl font-medium text-travertino leading-[1.05] mb-10 max-w-2xl"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Il miglior passaparola è quello che ti ripaga.
            </h2>
            <Button href="/partner/registrati" variant="ghost">
              Diventa partner →
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
