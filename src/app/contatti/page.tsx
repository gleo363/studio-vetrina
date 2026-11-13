"use client";

import { useActionState, useState } from "react";
import { motion } from "framer-motion";
import { Coffee } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { inviaContatto } from "@/app/actions/segnalazioni";
import { EASE_VETRINA, DURATA, fadeUp, riveloMascherato } from "@/lib/motion";
import { useTesti } from "@/components/providers/LinguaProvider";

const EMAIL = "studiovetrinaweb@gmail.com";

const TESTI = {
  it: {
    eyebrow: "Contatti",
    titolo: "Raccontaci la tua attività: al resto pensiamo noi.",
    ricevuto: "Messaggio ricevuto.",
    ricevutoTesto: "Ti ricontatteremo entro 24 ore. Nel frattempo, preparati il caffè.",
    nome: "Nome",
    attività: "Attività",
    email: "Email",
    telefono: "Telefono",
    messaggio: "Messaggio",
    phNome: "Mario Rossi",
    phAttività: "Trattoria da Mario",
    phEmail: "mario@trattoria.it",
    phTelefono: "+39 06 1234567",
    phMessaggio: "Raccontaci la tua attività e cosa vorresti dal tuo sito…",
    invio: "Invio in corso…",
    invia: "Apriamo la tua vetrina →",
    copiata: "Copiata!",
    doveSiamo: "Dove siamo",
    città: "Roma, Italia",
    risposta: "Rispondiamo entro 24 ore. Nei casi urgenti, scrivi direttamente via email.",
  },
  en: {
    eyebrow: "Contact",
    titolo: "Tell us about your business. We'll take care of the rest.",
    ricevuto: "Message received.",
    ricevutoTesto: "We'll get back to you within 24 hours. In the meantime, put the coffee on.",
    nome: "Name",
    attività: "Business",
    email: "Email",
    telefono: "Phone",
    messaggio: "Message",
    phNome: "Jane Smith",
    phAttività: "Jane's Bakery",
    phEmail: "jane@janesbakery.com",
    phTelefono: "+1 555 123 4567",
    phMessaggio: "Tell us about your business and what you'd like your website to do…",
    invio: "Sending…",
    invia: "Let's dress your window →",
    copiata: "Copied!",
    doveSiamo: "Where we are",
    città: "Rome, Italy",
    risposta: "We reply within 24 hours. If it's urgent, email us directly.",
  },
};

export default function ContattiPage() {
  const [state, action, pending] = useActionState(inviaContatto, null);
  const [copied, setCopied] = useState(false);
  const t = useTesti(TESTI);

  function copyEmail() {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="min-h-screen bg-travertino pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div className="mb-16" initial="hidden" animate="visible">
          <motion.p
            variants={fadeUp(12, DURATA.base)}
            className="text-xs font-medium uppercase tracking-[0.2em] text-pietra mb-4"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {t.eyebrow}
          </motion.p>
          <h1
            className="text-4xl md:text-5xl lg:text-[60px] font-medium text-inchiostro leading-[0.95] tracking-tight max-w-2xl"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
              <motion.span className="block" variants={riveloMascherato(0.12)}>
                {t.titolo}
              </motion.span>
            </span>
          </h1>
        </motion.div>

        <div className="grid md:grid-cols-[1fr_320px] gap-16">
          {/* Form */}
          <AnimatedSection delay={0.1}>
            {state?.successo ? (
              <motion.div
                className="bg-glass border border-linea rounded-2xl p-12 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: DURATA.base, ease: EASE_VETRINA }}
              >
                <Coffee
                  size={48}
                  strokeWidth={1.5}
                  className="text-cotto mx-auto mb-5"
                  aria-hidden="true"
                />
                <h2
                  className="text-2xl font-medium text-inchiostro mb-3"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {t.ricevuto}
                </h2>
                <p
                  className="text-pietra text-sm"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {t.ricevutoTesto}
                </p>
              </motion.div>
            ) : (
              <form action={action} className="flex flex-col gap-5">
                {/* honeypot — non visibile agli utenti, intercetta i bot */}
                <div style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} aria-hidden="true">
                  <input name="website" type="text" autoComplete="off" tabIndex={-1} />
                </div>
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
                      {t.nome}
                    </label>
                    <input
                      id="nome"
                      name="nome"
                      type="text"
                      required
                      placeholder={t.phNome}
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
                      {t.attività}
                    </label>
                    <input
                      id="attivita"
                      name="attivita"
                      type="text"
                      required
                      placeholder={t.phAttività}
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
                      {t.email}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder={t.phEmail}
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
                      {t.telefono}
                    </label>
                    <input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      placeholder={t.phTelefono}
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
                    {t.messaggio}
                  </label>
                  <textarea
                    id="messaggio"
                    name="messaggio"
                    rows={6}
                    required
                    placeholder={t.phMessaggio}
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
                  {pending ? t.invio : t.invia}
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
                  {t.email}
                </p>
                <button
                  onClick={copyEmail}
                  className="text-left text-inchiostro font-medium hover:text-cotto transition-colors cursor-pointer"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                  data-cursor="pointer"
                >
                  {EMAIL}
                  <span
                    className={`ml-2 text-xs font-medium transition-opacity duration-300 ${copied ? "opacity-100 text-cotto" : "opacity-0"}`}
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {t.copiata}
                  </span>
                </button>
              </div>

              <div>
                <p
                  className="text-xs font-medium text-pietra uppercase tracking-wider mb-3"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {t.doveSiamo}
                </p>
                <p
                  className="text-inchiostro font-medium"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {t.città}
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
                  href="https://www.instagram.com/studiovetrina.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-inchiostro font-medium hover:text-cotto transition-colors"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  @studiovetrina.it
                </a>
              </div>

              <div className="border-t border-inchiostro/10 pt-8">
                <p
                  className="text-sm text-pietra leading-relaxed italic"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {t.risposta}
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
