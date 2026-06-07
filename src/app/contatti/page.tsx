"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { inviaContatto } from "@/app/actions/segnalazioni";

export default function ContattiPage() {
  const [state, action, pending] = useActionState(inviaContatto, null);

  return (
    <div className="min-h-screen bg-travertino pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="mb-16">
          <p
            className="text-xs font-medium uppercase tracking-[0.2em] text-pietra mb-4"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Contatti
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-[60px] font-medium text-inchiostro leading-[0.95] tracking-tight max-w-2xl"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Raccontaci la tua attività — al resto pensiamo noi.
          </h1>
        </AnimatedSection>

        <div className="grid md:grid-cols-[1fr_320px] gap-16">
          {/* Form */}
          <AnimatedSection delay={0.1}>
            {state?.successo ? (
              <motion.div
                className="bg-glass rounded-2xl p-12 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-5xl mb-4">☕</p>
                <h2
                  className="text-2xl font-medium text-inchiostro mb-3"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  Messaggio ricevuto.
                </h2>
                <p
                  className="text-pietra text-sm"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Ti ricontatteremo entro 24 ore. Nel frattempo, preparati il caffè.
                </p>
              </motion.div>
            ) : (
              <form action={action} className="flex flex-col gap-5">
                {state?.errore && (
                  <div className="bg-[#fdf0ed] border border-cotto/20 rounded-xl px-4 py-3">
                    <p
                      className="text-sm text-cotto"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {state.errore}
                    </p>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="nome"
                      className="block text-xs font-medium text-pietra mb-2 uppercase tracking-wider"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Nome
                    </label>
                    <input
                      id="nome"
                      name="nome"
                      type="text"
                      required
                      placeholder="Mario Rossi"
                      className="w-full bg-glass border border-inchiostro/10 rounded-xl px-4 py-3.5 text-sm text-inchiostro placeholder:text-pietra/50 outline-none focus:border-inchiostro/30 transition-colors"
                      style={{ fontFamily: "var(--font-inter)" }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="attivita"
                      className="block text-xs font-medium text-pietra mb-2 uppercase tracking-wider"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Attività
                    </label>
                    <input
                      id="attivita"
                      name="attivita"
                      type="text"
                      required
                      placeholder="Trattoria da Mario"
                      className="w-full bg-glass border border-inchiostro/10 rounded-xl px-4 py-3.5 text-sm text-inchiostro placeholder:text-pietra/50 outline-none focus:border-inchiostro/30 transition-colors"
                      style={{ fontFamily: "var(--font-inter)" }}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-medium text-pietra mb-2 uppercase tracking-wider"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="mario@trattoria.it"
                      className="w-full bg-glass border border-inchiostro/10 rounded-xl px-4 py-3.5 text-sm text-inchiostro placeholder:text-pietra/50 outline-none focus:border-inchiostro/30 transition-colors"
                      style={{ fontFamily: "var(--font-inter)" }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="telefono"
                      className="block text-xs font-medium text-pietra mb-2 uppercase tracking-wider"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Telefono
                    </label>
                    <input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      placeholder="+39 06 1234567"
                      className="w-full bg-glass border border-inchiostro/10 rounded-xl px-4 py-3.5 text-sm text-inchiostro placeholder:text-pietra/50 outline-none focus:border-inchiostro/30 transition-colors"
                      style={{ fontFamily: "var(--font-inter)" }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="messaggio"
                    className="block text-xs font-medium text-pietra mb-2 uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    Messaggio
                  </label>
                  <textarea
                    id="messaggio"
                    name="messaggio"
                    rows={6}
                    required
                    placeholder="Raccontaci la tua attività e cosa vorresti dal tuo sito…"
                    className="w-full bg-glass border border-inchiostro/10 rounded-xl px-4 py-3.5 text-sm text-inchiostro placeholder:text-pietra/50 outline-none focus:border-inchiostro/30 transition-colors resize-none"
                    style={{ fontFamily: "var(--font-inter)" }}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={pending}
                  className="self-start inline-flex items-center gap-2 bg-cotto text-travertino rounded-[10px] px-7 py-4 text-sm font-medium cursor-pointer disabled:opacity-60"
                  style={{ fontFamily: "var(--font-inter)" }}
                  whileHover={pending ? {} : { scale: 1.03, backgroundColor: "#a8431f" }}
                  whileTap={pending ? {} : { scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  data-cursor="pointer"
                >
                  {pending ? "Invio in corso…" : "Apriamo la tua vetrina →"}
                </motion.button>
              </form>
            )}
          </AnimatedSection>

          {/* Aside info */}
          <AnimatedSection delay={0.2}>
            <div className="flex flex-col gap-8">
              <div>
                <p
                  className="text-xs font-medium text-pietra uppercase tracking-wider mb-3"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Email
                </p>
                <a
                  href="mailto:ciao@vetrina.it"
                  className="text-inchiostro font-medium hover:text-cotto transition-colors"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                  data-cursor="pointer"
                >
                  ciao@vetrina.it
                </a>
              </div>

              <div>
                <p
                  className="text-xs font-medium text-pietra uppercase tracking-wider mb-3"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Dove siamo
                </p>
                <p
                  className="text-inchiostro font-medium"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  Roma, Italia
                </p>
              </div>

              <div>
                <p
                  className="text-xs font-medium text-pietra uppercase tracking-wider mb-3"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Instagram
                </p>
                <a
                  href="https://instagram.com/studiovetrina"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-inchiostro font-medium hover:text-cotto transition-colors"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                  data-cursor="pointer"
                >
                  @studiovetrina
                </a>
              </div>

              <div className="border-t border-inchiostro/10 pt-8">
                <p
                  className="text-sm text-pietra leading-relaxed italic"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  Rispondiamo entro 24 ore. Nei casi urgenti, scrivi direttamente via email.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
