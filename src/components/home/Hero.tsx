"use client";
import Link from "next/link";
import { useScroll, useTransform, motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";

export default function Hero() {
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 500], [0, -120]);
  const titleOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const watermarkY = useTransform(scrollY, [0, 600], [0, 60]);

  return (
    <section className="relative h-svh min-h-[640px] bg-travertino flex items-center overflow-hidden">
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 w-full pt-20"
        style={{ y: titleY, opacity: titleOpacity }}
      >
        <p
          className="text-xs font-medium uppercase tracking-[0.2em] text-pietra mb-8"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Studio Vetrina · Roma
        </p>

        <h1
          className="text-[clamp(56px,9vw,108px)] font-medium text-inchiostro leading-[0.92] mb-7 tracking-tight"
          style={{
            fontFamily: "var(--font-fraunces)",
            fontOpticalSizing: "auto",
          } as React.CSSProperties}
        >
          La tua vetrina<br />sul mondo.
        </h1>

        <p
          className="text-xl md:text-2xl text-pietra mb-12 max-w-lg leading-snug"
          style={{
            fontFamily: "var(--font-fraunces)",
            fontStyle: "italic",
          }}
        >
          Siti web su misura per le piccole attività di Roma.
        </p>

        <div className="flex flex-wrap gap-4 items-center">
          <Button href="/contatti" variant="primary" className="text-base px-7 py-4">
            Apriamo la tua vetrina →
          </Button>
          <Link
            href="/lavori"
            className="text-sm font-medium text-inchiostro underline underline-offset-4 decoration-inchiostro/30 hover:decoration-inchiostro transition-all duration-200"
            style={{ fontFamily: "var(--font-inter)" }}
            data-cursor="pointer"
          >
            Guarda i nostri lavori
          </Link>
        </div>
      </motion.div>

      {/* Watermark decorativo */}
      <motion.div
        className="absolute bottom-0 right-0 pointer-events-none select-none"
        style={{ y: watermarkY, opacity: 0.065 }}
      >
        <Logo variant="color" size={240} />
      </motion.div>
    </section>
  );
}
