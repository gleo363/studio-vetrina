"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const inputCls =
  "w-full bg-glass border border-inchiostro/10 rounded-xl px-4 py-3.5 text-sm text-inchiostro placeholder:text-pietra/50 outline-none focus:border-inchiostro/30 transition-colors";
const labelCls =
  "block text-xs font-medium text-pietra mb-2 uppercase tracking-wider";

export default function AccediPage() {
  const router = useRouter();
  const [errore, setErrore] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
          ? "Email o password non corretti."
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
            Programma Partner
          </p>
          <h1
            className="text-3xl md:text-4xl font-medium text-inchiostro mb-3"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Bentornato.
          </h1>
          <p
            className="text-sm text-inchiostro/60"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Accedi alla tua area partner.
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
              {loading ? "Accesso in corso…" : "Accedi →"}
            </motion.button>
          </form>

          <div className="mt-6 flex flex-col gap-2">
            <p className="text-sm text-pietra" style={{ fontFamily: "var(--font-inter)" }}>
              Non hai ancora un account?{" "}
              <Link href="/partner/registrati" className="text-inchiostro hover:text-cotto transition-colors">
                Registrati
              </Link>
            </p>
            <p className="text-sm text-pietra" style={{ fontFamily: "var(--font-inter)" }}>
              <Link href="/partner/reset-password" className="text-inchiostro hover:text-cotto transition-colors">
                Hai dimenticato la password?
              </Link>
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
