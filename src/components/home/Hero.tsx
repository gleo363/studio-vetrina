"use client";
import {
  useScroll,
  useTransform,
  useReducedMotion,
  motion,
} from "framer-motion";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import {
  EASE_VETRINA,
  DURATA,
  riveloMascherato,
  fadeUp,
} from "@/lib/motion";

export default function Hero() {
  const riduciMovimento = useReducedMotion();
  const { scrollY } = useScroll();
  // Con prefers-reduced-motion i range collassano (parallasse ferma):
  // lo stile iniziale resta identico tra server e client, niente
  // mismatch di hydration.
  const titleY = useTransform(
    scrollY,
    [0, 500],
    riduciMovimento ? [0, 0] : [0, -120]
  );
  const titleOpacity = useTransform(
    scrollY,
    [0, 300],
    riduciMovimento ? [1, 1] : [1, 0]
  );
  const watermarkY = useTransform(
    scrollY,
    [0, 600],
    riduciMovimento ? [0, 0] : [0, 60]
  );

  return (
    <section className="relative h-svh min-h-[640px] bg-travertino alone-ocra flex items-center overflow-hidden">
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 w-full pt-20"
        style={{ y: titleY, opacity: titleOpacity }}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={fadeUp(12, DURATA.base)}
          className="text-xs font-medium uppercase tracking-[0.2em] text-pietra mb-8"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Studio Vetrina · Roma
        </motion.p>

        <h1
          className="text-[clamp(56px,9vw,108px)] font-medium text-inchiostro leading-[0.92] mb-7 tracking-tight"
          style={{
            fontFamily: "var(--font-fraunces)",
            fontOpticalSizing: "auto",
          } as React.CSSProperties}
        >
          {/* Ogni riga entra "nella cornice": maschera overflow-hidden. */}
          <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <motion.span className="block" variants={riveloMascherato(0.15)}>
              La tua vetrina
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <motion.span className="block" variants={riveloMascherato(0.27)}>
              sul mondo.
            </motion.span>
          </span>
        </h1>

        <motion.p
          variants={fadeUp(16, 0.6, 0.65)}
          className="text-xl md:text-2xl text-pietra mb-12 max-w-lg leading-snug"
          style={{
            fontFamily: "var(--font-fraunces)",
            fontStyle: "italic",
          }}
        >
          Siti web su misura per le piccole attività di Roma.
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4 items-center"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08, delayChildren: 0.85 },
            },
          }}
        >
          <motion.div variants={fadeUp(14, DURATA.base)}>
            <Button href="/contatti" variant="primary" className="text-base px-7 py-4">
              Apriamo la tua vetrina →
            </Button>
          </motion.div>
          <motion.div variants={fadeUp(14, DURATA.base)}>
            <Button href="/esempi" variant="ghost" className="text-base px-7 py-4">
              Guarda gli esempi
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Watermark decorativo: solo dissolvenza, mai trasformazioni sul marchio. */}
      <motion.div
        className="absolute bottom-0 right-0 pointer-events-none select-none"
        style={{ y: watermarkY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.065 }}
        transition={{ duration: DURATA.scena, ease: EASE_VETRINA, delay: 0.3 }}
      >
        <Logo variant="color" size={240} />
      </motion.div>
    </section>
  );
}
