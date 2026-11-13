"use client";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerCards";
import { motion } from "framer-motion";
import { EASE_VETRINA } from "@/lib/motion";
import { UtensilsCrossed, Scissors, ShoppingBag, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTesti } from "@/components/providers/LinguaProvider";

const ICONE: LucideIcon[] = [UtensilsCrossed, Scissors, ShoppingBag, Wrench];

const TESTI = {
  it: {
    titolo: "Le attività che danno anima a Roma.",
    categorie: [
      { nome: "Ristoranti e bar", bisogno: "Essere trovati su Google e mostrare il menu online." },
      { nome: "Saloni e centri estetici", bisogno: "Prenotazioni online e calendario sempre aggiornato." },
      { nome: "Boutique e negozi", bisogno: "Una presenza digitale all'altezza del negozio fisico." },
      { nome: "Artigiani e professionisti", bisogno: "Credibilità online per acquisire nuovi clienti." },
    ],
  },
  en: {
    titolo: "The businesses that give a city its character.",
    categorie: [
      { nome: "Restaurants and bars", bisogno: "Show up on Google and put the menu online." },
      { nome: "Hair and beauty salons", bisogno: "Online booking and a calendar that's always up to date." },
      { nome: "Boutiques and shops", bisogno: "An online presence that lives up to the shop itself." },
      { nome: "Trades and professionals", bisogno: "Credibility online that brings in new clients." },
    ],
  },
};

export default function SezioneTarget() {
  const t = useTesti(TESTI);
  const categorie = t.categorie.map((c, i) => ({ ...c, icon: ICONE[i] }));
  return (
    <section className="bg-glass px-6 py-28">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="mb-16">
          <h2
            className="text-3xl md:text-4xl lg:text-[44px] font-medium leading-[1.1] text-inchiostro max-w-xl"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            {t.titolo}
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categorie.map((cat, i) => (
            <StaggerItem key={i}>
              <motion.div
                className="group bg-travertino border border-linea rounded-2xl p-7 h-full cursor-default"
                whileHover={{
                  y: -6,
                  boxShadow: "0 24px 48px -16px rgba(27,26,24,0.18)",
                }}
                transition={{ duration: 0.3, ease: EASE_VETRINA }}
              >
                <cat.icon
                  size={32}
                  strokeWidth={1.5}
                  className="mb-5 text-inchiostro/70 transition-all duration-300 group-hover:text-cotto motion-safe:group-hover:-translate-y-0.5"
                />
                <h3
                  className="text-lg font-medium text-inchiostro mb-3"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {cat.nome}
                </h3>
                <p
                  className="text-sm text-pietra leading-relaxed"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {cat.bisogno}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
