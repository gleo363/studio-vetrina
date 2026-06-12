"use client";
import { useEffect, useRef } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerCards";
import { EASE_VETRINA, DURATA, riveloLinea } from "@/lib/motion";

interface StatConfig {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  staticDisplay?: string;
}

const stats: StatConfig[] = [
  {
    value: 4.2,
    decimals: 1,
    suffix: "M",
    label: "piccole imprese senza presenza online adeguata",
  },
  {
    value: 76,
    suffix: "%",
    label: "dei consumatori giudica un'azienda dal suo sito",
  },
  {
    value: 0,
    staticDisplay: "€0",
    label: "guadagni online senza un sito web",
  },
  {
    value: 8,
    suffix: "″",
    label: "secondi per perdere un visitatore",
  },
];

function CountUp({ config }: { config: StatConfig }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const riduciMovimento = useReducedMotion();

  useEffect(() => {
    if (!inView || config.staticDisplay) return;

    const formatta = (v: number) => {
      const formatted =
        config.decimals && config.decimals > 0
          ? v.toFixed(config.decimals).replace(".", ",")
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
  }, [inView, config, riduciMovimento]);

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
  return (
    <section className="bg-inchiostro alone-cotto text-travertino px-6 py-28">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="mb-20 max-w-3xl">
          <h2
            className="text-3xl md:text-4xl lg:text-[44px] font-medium leading-[1.1] text-travertino"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Il 68% delle piccole attività italiane non ha un sito. O ce l'ha,
            ma fa più danno che bene.
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
                  <CountUp config={stat} />
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
                  {stat.label}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
