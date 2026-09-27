"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import PasswordInput from "@/components/ui/PasswordInput";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const inputCls =
  "w-full bg-glass border border-inchiostro/10 rounded-xl px-4 py-3.5 text-sm text-inchiostro placeholder:text-pietra/50 outline-none focus:border-inchiostro/30 transition-colors";
const labelCls =
  "block text-xs font-medium text-pietra mb-2 uppercase tracking-wider";

type Stato = "verifica" | "form" | "successo" | "errore";

function AggiornaPasswordForm() {
  const router = useRouter();
  const [stato, setStato] = useState<Stato>("verifica");
  const [loading, setLoading] = useState(false);
  const [erroreForm, setErroreForm] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // La sessione è già stata stabilita server-side da /auth/callback.
    // Se non c'è sessione, il link è scaduto o non valido.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setStato(session ? "form" : "errore");
    });

    // Backup: ascolta l'evento PASSWORD_RECOVERY per flussi alternativi.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setStato("form");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErroreForm(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const conferma = formData.get("conferma") as string;

    if (password !== conferma) {
      setErroreForm("Le password non coincidono.");
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setErroreForm("La password deve essere di almeno 8 caratteri.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErroreForm(error.message);
      setLoading(false);
      return;
    }

    setStato("successo");
    setTimeout(() => router.push("/partner/area-partner"), 2500);
  }

  if (stato === "verifica") {
    return (
      <AnimatedSection delay={0.1}>
        <p className="text-sm text-pietra" style={{ fontFamily: "var(--font-inter)" }}>
          Verifica del link in corso…
        </p>
      </AnimatedSection>
    );
  }

  if (stato === "errore") {
    return (
      <AnimatedSection delay={0.1}>
        <div className="bg-glass rounded-2xl p-8">
          <p className="text-3xl mb-4">⏱</p>
          <h2
            className="text-xl font-medium text-inchiostro mb-2"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Link non valido o scaduto.
          </h2>
          <p
            className="text-sm text-pietra mb-6"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Il link di reset è scaduto o è già stato usato. Richiedine uno nuovo.
          </p>
          <Link
            href="/partner/reset-password"
            className="inline-flex items-center gap-2 bg-cotto text-travertino rounded-[10px] px-6 py-3.5 text-sm font-medium hover:bg-[#a8431f] transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Richiedi nuovo link →
          </Link>
        </div>
      </AnimatedSection>
    );
  }

  if (stato === "successo") {
    return (
      <AnimatedSection delay={0.1}>
        <div className="bg-glass rounded-2xl p-8 text-center">
          <p className="text-3xl mb-4">✓</p>
          <h2
            className="text-xl font-medium text-inchiostro mb-2"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Password aggiornata.
          </h2>
          <p
            className="text-sm text-pietra"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Stai per essere reindirizzato all'area partner…
          </p>
        </div>
      </AnimatedSection>
    );
  }

  // stato === "form"
  return (
    <AnimatedSection delay={0.1}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {erroreForm && (
          <div className="bg-[#fdf0ed] border border-cotto/20 rounded-xl px-4 py-3">
            <p className="text-sm text-cotto" style={{ fontFamily: "var(--font-inter)" }}>
              {erroreForm}
            </p>
          </div>
        )}

        <div>
          <label htmlFor="password" className={labelCls} style={{ fontFamily: "var(--font-inter)" }}>
            Nuova password
          </label>
          <PasswordInput
            id="password"
            name="password"
            required
            minLength={8}
            placeholder="Almeno 8 caratteri"
            className={inputCls}
            style={{ fontFamily: "var(--font-inter)" }}
          />
        </div>

        <div>
          <label htmlFor="conferma" className={labelCls} style={{ fontFamily: "var(--font-inter)" }}>
            Conferma password
          </label>
          <PasswordInput
            id="conferma"
            name="conferma"
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
          <p
            className="text-sm text-inchiostro/60"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Scegli una password sicura di almeno 8 caratteri.
          </p>
        </AnimatedSection>

        <Suspense
          fallback={
            <p className="text-sm text-pietra" style={{ fontFamily: "var(--font-inter)" }}>
              Caricamento…
            </p>
          }
        >
          <AggiornaPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
