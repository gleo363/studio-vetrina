"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { createClient } from "@/lib/supabase/client";

const inputCls =
  "w-full bg-glass border border-inchiostro/10 rounded-xl px-4 py-3.5 text-sm text-inchiostro placeholder:text-pietra/50 outline-none focus:border-inchiostro/30 transition-colors";
const labelCls =
  "block text-xs font-medium text-pietra mb-2 uppercase tracking-wider";

function AggiornaPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setErrore("Link non valido o scaduto. Richiedi un nuovo reset.");
      return;
    }

    const supabase = createClient();
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        setErrore("Link scaduto. Richiedi un nuovo reset.");
      } else {
        setPronto(true);
      }
    });
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrore(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const conferma = formData.get("conferma") as string;

    if (password !== conferma) {
      setErrore("Le password non coincidono.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setErrore("La password deve essere di almeno 6 caratteri.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErrore(error.message);
      setLoading(false);
      return;
    }

    router.push("/partner/area-partner");
  }

  return (
    <AnimatedSection delay={0.1}>
      {errore && !pronto ? (
        <div className="bg-[#fdf0ed] border border-cotto/20 rounded-xl px-4 py-3">
          <p className="text-sm text-cotto" style={{ fontFamily: "var(--font-inter)" }}>
            {errore}
          </p>
        </div>
      ) : pronto ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {errore && (
            <div className="bg-[#fdf0ed] border border-cotto/20 rounded-xl px-4 py-3">
              <p className="text-sm text-cotto" style={{ fontFamily: "var(--font-inter)" }}>
                {errore}
              </p>
            </div>
          )}

          <div>
            <label htmlFor="password" className={labelCls} style={{ fontFamily: "var(--font-inter)" }}>
              Nuova password
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

          <div>
            <label htmlFor="conferma" className={labelCls} style={{ fontFamily: "var(--font-inter)" }}>
              Conferma password
            </label>
            <input
              id="conferma"
              name="conferma"
              type="password"
              required
              placeholder="Ripeti la password"
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
            {loading ? "Salvataggio…" : "Salva password →"}
          </motion.button>
        </form>
      ) : (
        <p className="text-sm text-pietra" style={{ fontFamily: "var(--font-inter)" }}>
          Verifica del link in corso…
        </p>
      )}
    </AnimatedSection>
  );
}

export default function AggiornaPasswordPage() {
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
            Nuova password.
          </h1>
        </AnimatedSection>

        <Suspense fallback={
          <p className="text-sm text-pietra" style={{ fontFamily: "var(--font-inter)" }}>
            Caricamento…
          </p>
        }>
          <AggiornaPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
