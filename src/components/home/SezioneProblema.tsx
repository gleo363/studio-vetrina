"use client";
import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerCards";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

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

  useEffect(() => {
    if (!inView || config.staticDisplay) return;
    const controls = animate(0, config.value, {
      duration: 1.6,
      ease,
      onUpdate(v) {
        if (!ref.current) return;
        const formatted =
          config.decimals && config.decimals > 0
            ? v.toFixed(config.decimals).replace(".", ",")
            : Math.floor(v).toString();
        ref.current.textContent =
          (config.prefix ?? "") + formatted + (config.suffix ?? "");
      },
    });
    return () => controls.stop();
  }, [inView, config]);

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
    <section className="bg-inchiostro text-travertino px-6 py-28">
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
                  className="text-5xl md:text-6xl font-medium text-ocra mb-3 tabular-nums"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  <CountUp config={stat} />
                </p>
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
