"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const inputCls =
  "w-full bg-glass border border-inchiostro/10 rounded-xl px-4 py-3.5 text-sm text-inchiostro placeholder:text-pietra/50 outline-none focus:border-inchiostro/30 transition-colors";
const labelCls =
  "block text-xs font-medium text-pietra mb-2 uppercase tracking-wider";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [inviato, setInviato] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrore(null);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/partner/aggiorna-password`,
    });

    if (error) {
      setErrore(error.message);
      setLoading(false);
      return;
    }

    setInviato(true);
  }

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
            Reset password.
          </h1>
          <p
            className="text-sm text-inchiostro/60"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Ti mandiamo un link per impostare una nuova password.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          {inviato ? (
            <div className="bg-glass rounded-2xl p-8 text-center">
              <p className="text-3xl mb-4">📬</p>
              <h2
                className="text-xl font-medium text-inchiostro mb-2"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Email inviata.
              </h2>
              <p
                className="text-sm text-pietra"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Controlla la tua casella e clicca il link per reimpostare la password.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {errore && (
                <div className="bg-[#fdf0ed] border border-cotto/20 rounded-xl px-4 py-3">
                  <p className="text-sm text-cotto" style={{ fontFamily: "var(--font-inter)" }}>
                    {errore}
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="email" className={labelCls} style={{ fontFamily: "var(--font-inter)" }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mario@esempio.it"
                  className={inputCls}
                  style={{ fontFamily: "var(--font-inter)" }}
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="self-start inline-flex items-center gap-2 bg-cotto text-travertino rounded-[10px] px-7 py-4 text-sm font-medium cursor-pointer disabled:opacity-60"
                style={{ fontFamily: "var(--font-inter)" }}
                whileHover={loading ? {} : { scale: 1.03, backgroundColor: "#a8431f" }}
                whileTap={loading ? {} : { scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                {loading ? "Invio in corso…" : "Invia link →"}
              </motion.button>
            </form>
          )}

          <p className="mt-6 text-sm text-pietra" style={{ fontFamily: "var(--font-inter)" }}>
            <Link href="/partner/accedi" className="text-inchiostro hover:text-cotto transition-colors">
              ← Torna al login
            </Link>
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
}
