"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PasswordInput from "@/components/ui/PasswordInput";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useTesti } from "@/components/providers/LinguaProvider";

const TESTI = {
  it: {
    eyebrow: "Programma Partner",
    titolo: "Bentornato.",
    sottotitolo: "Accedi alla tua area partner.",
    credenziali: "Email o password non corretti.",
    phEmail: "mario@esempio.it",
    accesso: "Accesso in corso…",
    accedi: "Accedi →",
    nessunAccount: "Non hai ancora un account?",
    registrati: "Registrati",
    dimenticata: "Hai dimenticato la password?",
  },
  en: {
    eyebrow: "Partner Program",
    titolo: "Welcome back.",
    sottotitolo: "Log in to your partner area.",
    credenziali: "Wrong email or password.",
    phEmail: "jane@example.com",
    accesso: "Logging in…",
    accedi: "Log in →",
    nessunAccount: "Don't have an account yet?",
    registrati: "Sign up",
    dimenticata: "Forgot your password?",
  },
};

const inputCls =
  "w-full bg-glass border border-inchiostro/10 rounded-xl px-4 py-3.5 text-sm text-inchiostro placeholder:text-pietra/50 outline-none focus:border-inchiostro/30 transition-colors";
const labelCls =
  "block text-xs font-medium text-pietra mb-2 uppercase tracking-wider";

export default function AccediPage() {
  const router = useRouter();
  const [errore, setErrore] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const t = useTesti(TESTI);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrore(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrore(
        error.message.includes("Invalid login credentials")
          ? t.credenziali
          : error.message
      );
      setLoading(false);
      return;
    }

    router.push("/partner/area-partner");
  }

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
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {errore && (
              <div className="bg-[#fdf0ed] border border-cotto/20 rounded-xl px-4 py-3">
                <p
                  className="text-sm text-cotto"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {errore}
                </p>
              </div>
            )}

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
                placeholder="••••••••"
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
              {loading ? t.accesso : t.accedi}
            </motion.button>
          </form>

          <div className="mt-6 flex flex-col gap-2">
            <p className="text-sm text-pietra" style={{ fontFamily: "var(--font-inter)" }}>
              {t.nessunAccount}{" "}
              <Link href="/partner/registrati" className="text-inchiostro hover:text-cotto transition-colors">
                {t.registrati}
              </Link>
            </p>
            <p className="text-sm text-pietra" style={{ fontFamily: "var(--font-inter)" }}>
              <Link href="/partner/reset-password" className="text-inchiostro hover:text-cotto transition-colors">
                {t.dimenticata}
              </Link>
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
