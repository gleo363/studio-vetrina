"use client";
import { useEffect, useRef } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerCards";
import { EASE_VETRINA, DURATA, riveloLinea } from "@/lib/motion";
import { useTesti } from "@/components/providers/LinguaProvider";

interface StatConfig {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  staticDisplay?: string;
}

const stats: StatConfig[] = [
  { value: 4.2, decimals: 1, suffix: "M" },
  { value: 76, suffix: "%" },
  { value: 0, staticDisplay: "€0" },
  { value: 8, suffix: "″" },
];

const TESTI = {
  it: {
    titolo:
      "Il 68% delle attività locali in Italia non ha un sito. O ce l'ha, ma fa più danno che bene.",
    etichette: [
      "attività in Italia senza una presenza online adeguata",
      "dei consumatori giudica un'azienda dal suo sito",
      "guadagni online senza un sito web",
      "secondi per perdere un visitatore",
    ],
    separatoreDecimale: ",",
  },
  en: {
    titolo:
      "68% of local businesses in Italy have no website. Or they have one that does more harm than good.",
    etichette: [
      "businesses in Italy without a proper online presence",
      "of customers judge a business by its website",
      "earned online without a website",
      "seconds to lose a visitor",
    ],
    separatoreDecimale: ".",
  },
};

function CountUp({
  config,
  separatoreDecimale,
}: {
  config: StatConfig;
  separatoreDecimale: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const riduciMovimento = useReducedMotion();

  useEffect(() => {
    if (!inView || config.staticDisplay) return;

    const formatta = (v: number) => {
      const formatted =
        config.decimals && config.decimals > 0
          ? v.toFixed(config.decimals).replace(".", separatoreDecimale)
          : Math.floor(v).toString();
      return (config.prefix ?? "") + formatted + (config.suffix ?? "");
    };

    // animate() non è coperto da MotionConfig: guardia esplicita.
    if (riduciMovimento) {
      if (ref.current) ref.current.textContent = formatta(config.value);
      return;
    }

    const controls = animate(0, config.value, {
      duration: DURATA.scena,
      ease: EASE_VETRINA,
      onUpdate(v) {
        if (!ref.current) return;
        ref.current.textContent = formatta(v);
      },
    });
    return () => controls.stop();
  }, [inView, config, riduciMovimento, separatoreDecimale]);

  if (config.staticDisplay) {
    return <span ref={ref}>{config.staticDisplay}</span>;
  }

  return (
    <span ref={ref}>
      {config.prefix ?? ""}0{config.suffix ?? ""}
    </span>
  );
}

export default function SezioneProblema() {
  const t = useTesti(TESTI);
  return (
    <section className="bg-inchiostro alone-cotto text-travertino px-6 py-28">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="mb-20 max-w-3xl">
          <h2
            className="text-3xl md:text-4xl lg:text-[44px] font-medium leading-[1.1] text-travertino"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            {t.titolo}
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((stat, i) => (
            <StaggerItem key={i}>
              <div className="border border-travertino/10 rounded-2xl p-6 md:p-8 h-full">
                <p
                  className="text-5xl md:text-6xl font-medium text-ocra tabular-nums"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  <CountUp config={stat} separatoreDecimale={t.separatoreDecimale} />
                </p>
                {/* La "mensola": eco della cornice del marchio */}
                <motion.div
                  className="h-px w-7 bg-ocra/60 origin-left my-3"
                  variants={riveloLinea()}
                  aria-hidden="true"
                />
                <p
                  className="text-sm text-travertino/50 leading-snug"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {t.etichette[i]}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
