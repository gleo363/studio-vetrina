"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { registraPartner } from "@/app/actions/partner";
import Link from "next/link";

const inputCls =
  "w-full bg-glass border border-inchiostro/10 rounded-xl px-4 py-3.5 text-sm text-inchiostro placeholder:text-pietra/50 outline-none focus:border-inchiostro/30 transition-colors";
const labelCls =
  "block text-xs font-medium text-pietra mb-2 uppercase tracking-wider";

export default function RegistratiPage() {
  const [state, action, pending] = useActionState(registraPartner, null);

  return (
    <div className="min-h-screen bg-travertino pt-32 pb-24 px-6">
      <div className="max-w-md mx-auto">
        <AnimatedSection className="mb-10">
          <p
            className="text-xs font-medium uppercase tracking-[0.2em] text-pietra mb-4"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Programma Partner
          </p>
          <h1
            className="text-3xl md:text-4xl font-medium text-inchiostro mb-3"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Crea il tuo account.
          </h1>
          <p
            className="text-sm text-inchiostro/60"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            In un minuto ricevi il tuo codice personale e il tuo QR.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
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

            <div>
              <label
                htmlFor="nome"
                className={labelCls}
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
                placeholder="mario@esempio.it"
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
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="Almeno 6 caratteri"
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
              {pending ? "Creazione in corso…" : "Crea il mio codice →"}
            </motion.button>
          </form>

          <p
            className="mt-6 text-sm text-pietra"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Hai già un account?{" "}
            <Link
              href="/partner/accedi"
              className="text-inchiostro hover:text-cotto transition-colors"
            >
              Accedi
            </Link>
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
}
