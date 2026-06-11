import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";
import AnimatedSection from "@/components/ui/AnimatedSection";
import ListaSegnalazioni, { type Segnalazione } from "./ListaSegnalazioni";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/partner/accedi");
  if (!isAdminEmail(user.email)) notFound();

  const admin = createAdminClient();
  const { data: segnalazioni = [] } = await admin
    .from("segnalazione")
    .select("*, partner:partner_id(nome, email, codice, commissione)")
    .order("creato_il", { ascending: false });

  const { data: partner = [] } = await admin
    .from("partner")
    .select("id");

  // Supabase può restituire la relazione come array: normalizziamo a oggetto singolo
  const lista: Segnalazione[] = (segnalazioni ?? []).map((s) => ({
    ...s,
    partner: Array.isArray(s.partner) ? (s.partner[0] ?? null) : s.partner,
  }));

  const totaledaliquidare = lista
    .filter((s) => s.stato === "pagato" && !s.commissione_liquidata)
    .reduce((acc, s) => acc + (s.commissione_maturata ?? 0), 0);

  const questeMese = lista.filter((s) => {
    const d = new Date(s.creato_il);
    const ora = new Date();
    return (
      d.getFullYear() === ora.getFullYear() &&
      d.getMonth() === ora.getMonth()
    );
  }).length;

  return (
    <div className="min-h-screen bg-travertino pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        <AnimatedSection>
          <p
            className="text-xs font-medium uppercase tracking-[0.2em] text-pietra mb-4"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Pannello Studio Vetrina
          </p>
          <h1
            className="text-3xl md:text-4xl font-medium text-inchiostro mb-8"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Segnalazioni Partner
          </h1>

          {/* Riepilogo */}
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            <div className="bg-glass rounded-2xl p-6">
              <p
                className="text-xs text-pietra uppercase tracking-wider mb-2"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Da liquidare
              </p>
              <p
                className="text-2xl font-medium text-cotto"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                € {totaledaliquidare.toLocaleString("it-IT")}
              </p>
            </div>
            <div className="bg-glass rounded-2xl p-6">
              <p
                className="text-xs text-pietra uppercase tracking-wider mb-2"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Partner attivi
              </p>
              <p
                className="text-2xl font-medium text-inchiostro"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                {(partner ?? []).length}
              </p>
            </div>
            <div className="bg-glass rounded-2xl p-6">
              <p
                className="text-xs text-pietra uppercase tracking-wider mb-2"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Segnalazioni questo mese
              </p>
              <p
                className="text-2xl font-medium text-inchiostro"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                {questeMese}
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Filtri, export CSV e lista segnalazioni */}
        <AnimatedSection delay={0.1}>
          <ListaSegnalazioni segnalazioni={lista} />
        </AnimatedSection>
      </div>
    </div>
  );
}
