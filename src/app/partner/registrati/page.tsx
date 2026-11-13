"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PasswordInput from "@/components/ui/PasswordInput";
import { registraPartner } from "@/app/actions/partner";
import Link from "next/link";
import { useTesti } from "@/components/providers/LinguaProvider";

const TESTI = {
  it: {
    eyebrow: "Programma Partner",
    titolo: "Crea il tuo account.",
    sottotitolo: "In un minuto ricevi il tuo codice personale e il tuo QR.",
    nome: "Nome",
    phNome: "Mario Rossi",
    phEmail: "mario@esempio.it",
    phPassword: "Almeno 8 caratteri",
    creazione: "Creazione in corso…",
    crea: "Crea il mio codice →",
    giàAccount: "Hai già un account?",
    accedi: "Accedi",
  },
  en: {
    eyebrow: "Partner Program",
    titolo: "Create your account.",
    sottotitolo: "In a minute you'll have your own code and QR.",
    nome: "Name",
    phNome: "Jane Smith",
    phEmail: "jane@example.com",
    phPassword: "At least 8 characters",
    creazione: "Creating your account…",
    crea: "Get my code →",
    giàAccount: "Already have an account?",
    accedi: "Log in",
  },
};

const inputCls =
  "w-full bg-glass border border-inchiostro/10 rounded-xl px-4 py-3.5 text-sm text-inchiostro placeholder:text-pietra/50 outline-none focus:border-inchiostro/30 transition-colors";
const labelCls =
  "block text-xs font-medium text-pietra mb-2 uppercase tracking-wider";

export default function RegistratiPage() {
  const [state, action, pending] = useActionState(registraPartner, null);
  const t = useTesti(TESTI);

  return (
    <div className="min-h-screen bg-travertino pt-32 pb-24 px-6">
      <div className="max-w-md mx-auto">
        <AnimatedSection className="mb-10">
          <p
            className="text-xs font-medium uppercase tracking-[0.2em] text-pietra mb-4"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {t.eyebrow}
          </p>
          <h1
            className="text-3xl md:text-4xl font-medium text-inchiostro mb-3"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            {t.titolo}
          </h1>
          <p
            className="text-sm text-inchiostro/60"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {t.sottotitolo}
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
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

            <div>
              <label
                htmlFor="nome"
                className={labelCls}
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
                className={inputCls}
                style={{ fontFamily: "var(--font-inter)" }}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className={labelCls}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder={t.phEmail}
                className={inputCls}
                style={{ fontFamily: "var(--font-inter)" }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className={labelCls}
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Password
              </label>
              <PasswordInput
                id="password"
                name="password"
                required
                minLength={8}
                placeholder={t.phPassword}
                className={inputCls}
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
            >
              {pending ? t.creazione : t.crea}
            </motion.button>
          </form>

          <p
            className="mt-6 text-sm text-pietra"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {t.giàAccount}{" "}
            <Link
              href="/partner/accedi"
              className="text-inchiostro hover:text-cotto transition-colors"
            >
              {t.accedi}
            </Link>
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
}
