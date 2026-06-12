"use client";
import { motion } from "framer-motion";
import { ContainerScroll } from "@/components/ui/ContainerScroll";
import { riveloMascherato, fadeUp, VIEWPORT_ONCE } from "@/lib/motion";

function MockupSito() {
  return (
    <div className="h-full w-full bg-[#F9F5EE] flex flex-col overflow-hidden font-sans">
      {/* Navbar mockup */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-black/8 bg-white/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#BF4D2C]" />
          <div className="w-20 h-2.5 rounded-full bg-[#1B1A18]/80" />
        </div>
        <div className="hidden md:flex items-center gap-5">
          <div className="w-10 h-2 rounded-full bg-[#1B1A18]/20" />
          <div className="w-12 h-2 rounded-full bg-[#1B1A18]/20" />
          <div className="w-16 h-2 rounded-full bg-[#1B1A18]/20" />
          <div className="w-20 h-6 rounded-md bg-[#BF4D2C]" />
        </div>
      </div>

      {/* Hero mockup */}
      <div className="px-6 md:px-12 py-8 md:py-10 bg-gradient-to-br from-[#F3EEE4] to-[#FBF9F3] shrink-0">
        <div className="w-24 h-2 rounded-full bg-[#8A8578]/40 mb-4" />
        <div className="w-64 h-7 rounded-lg bg-[#1B1A18]/80 mb-2" />
        <div className="w-48 h-7 rounded-lg bg-[#1B1A18]/60 mb-5" />
        <div className="w-80 h-3 rounded-full bg-[#8A8578]/30 mb-2" />
        <div className="w-64 h-3 rounded-full bg-[#8A8578]/20 mb-7" />
        <div className="flex gap-3">
          <div className="w-32 h-8 rounded-[8px] bg-[#BF4D2C]" />
          <div className="w-28 h-8 rounded-[8px] border border-[#1B1A18]/20" />
        </div>
      </div>

      {/* Griglia servizi mockup */}
      <div className="flex-1 px-6 md:px-12 py-6 bg-white">
        <div className="w-32 h-3 rounded-full bg-[#1B1A18]/50 mb-6" />
        <div className="grid grid-cols-3 gap-3 h-24">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl bg-[#F3EEE4] p-3 flex flex-col gap-2">
              <div className="w-6 h-6 rounded-md bg-[#BF4D2C]/30" />
              <div className="w-full h-2 rounded-full bg-[#1B1A18]/20" />
              <div className="w-3/4 h-2 rounded-full bg-[#1B1A18]/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TransizioneScroll() {
  return (
    <ContainerScroll
      titleComponent={
        <motion.div
          className="flex flex-col items-center gap-3"
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          <h2
            className="text-4xl md:text-6xl font-medium text-inchiostro leading-[0.95] tracking-tight"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <motion.span className="block" variants={riveloMascherato(0)}>
                Ogni attività
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <motion.span className="block" variants={riveloMascherato(0.12)}>
                ha una storia.
              </motion.span>
            </span>
          </h2>
          <motion.p
            variants={fadeUp(16, 0.6, 0.4)}
            className="text-xl md:text-2xl text-pietra mt-1"
            style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}
          >
            Il tuo sito deve saperla raccontare.
          </motion.p>
        </motion.div>
      }
    >
      <MockupSito />
    </ContainerScroll>
  );
}
