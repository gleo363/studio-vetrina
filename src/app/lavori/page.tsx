"use client";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerCards";

const progetti = [
  {
    nome: "Trattoria da Enzo",
    categoria: "Ristorante",
    tag: "Next.js · SEO",
    gradiente: "from-[#BF4D2C] to-[#DA9A47]",
  },
  {
    nome: "Salone Milena",
    categoria: "Salone di bellezza",
    tag: "Prenotazioni online",
    gradiente: "from-[#8A8578] to-[#DA9A47]",
  },
  {
    nome: "Boutique Alma",
    categoria: "Negozio di abbigliamento",
    tag: "E-commerce",
    gradiente: "from-[#1B1A18] to-[#8A8578]",
  },
  {
    nome: "Studio Dott. Ferretti",
    categoria: "Studio dentistico",
    tag: "Next.js · Prenotazioni",
    gradiente: "from-[#DA9A47] to-[#F3EEE4]",
  },
  {
    nome: "Libreria Aperta",
    categoria: "Libreria indipendente",
    tag: "Blog · Catalogo",
    gradiente: "from-[#BF4D2C] to-[#1B1A18]",
  },
  {
    nome: "Falegnameria Rossi",
    categoria: "Artigiano del legno",
    tag: "Portfolio · SEO",
    gradiente: "from-[#8A8578] to-[#BF4D2C]",
  },
];

export default function LavoriPage() {
  return (
    <div className="min-h-screen bg-travertino pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="mb-16">
          <p
            className="text-xs font-medium uppercase tracking-[0.2em] text-pietra mb-4"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Portfolio
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-medium text-inchiostro leading-[0.95] tracking-tight"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            I nostri lavori.
          </h1>
        </AnimatedSection>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {progetti.map((p) => (
            <StaggerItem key={p.nome}>
              <motion.article
                className="group rounded-2xl overflow-hidden bg-glass cursor-default"
                whileHover={{
                  y: -6,
                  boxShadow: "0 24px 48px -16px rgba(27,26,24,0.2)",
                }}
                transition={{ duration: 0.3 }}
                data-cursor="pointer"
              >
                {/* Mockup placeholder */}
                <div
                  className={`h-52 bg-gradient-to-br ${p.gradiente} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-20 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20" />
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span
                      className="text-xs font-medium bg-white/20 backdrop-blur-sm text-white rounded-full px-3 py-1"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {p.tag}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <p
                    className="text-xs text-pietra mb-1 uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {p.categoria}
                  </p>
                  <h3
                    className="text-xl font-medium text-inchiostro mb-4"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {p.nome}
                  </h3>
                  <span
                    className="text-sm text-cotto font-medium underline underline-offset-4 decoration-cotto/30 group-hover:decoration-cotto transition-colors"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Vedi il sito →
                  </span>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
}
