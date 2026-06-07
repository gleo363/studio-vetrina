import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import AnimatedSection from "@/components/ui/AnimatedSection";
import AggiornaForm from "./AggiornaForm";

const BADGE: Record<string, { label: string; cls: string }> = {
  segnalato: { label: "Segnalato", cls: "bg-pietra/15 text-pietra" },
  firmato: { label: "Firmato", cls: "bg-ocra/20 text-[#9a6b20]" },
  pagato: { label: "Pagato", cls: "bg-[#dcf5e8] text-[#1a6b3a]" },
  rifiutato: { label: "Rifiutato", cls: "bg-inchiostro/10 text-inchiostro/50" },
};

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/partner/accedi");
  if (user.email !== process.env.ADMIN_EMAIL) notFound();

  const admin = createAdminClient();
  const { data: segnalazioni = [] } = await admin
    .from("segnalazione")
    .select("*, partner:partner_id(nome, email, codice, commissione)")
    .order("creato_il", { ascending: false });

  const { data: partner = [] } = await admin
    .from("partner")
    .select("id");

  const lista = segnalazioni ?? [];

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

        {/* Tabella segnalazioni */}
        <AnimatedSection delay={0.1}>
          <div className="flex flex-col gap-4">
            {lista.length === 0 && (
              <p
                className="text-pietra text-sm italic"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                Nessuna segnalazione ancora.
              </p>
            )}
            {lista.map((s) => {
              const badge = BADGE[s.stato] ?? BADGE.segnalato;
              const partnerInfo = s.partner as {
                nome: string;
                email: string;
                codice: string;
                commissione: number;
              } | null;

              return (
                <div
                  key={s.id}
                  className="bg-glass rounded-2xl p-6 flex flex-col gap-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p
                        className="font-medium text-inchiostro text-lg"
                        style={{ fontFamily: "var(--font-fraunces)" }}
                      >
                        {s.nome_attivita}
                      </p>
                      <p
                        className="text-xs text-pietra mt-1"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {partnerInfo ? `Partner: ${partnerInfo.nome} (${partnerInfo.codice}) ·` : "Diretto ·"}{" "}
                        {new Date(s.creato_il).toLocaleDateString("it-IT")}
                      </p>
                      {s.nome_referente && (
                        <p
                          className="text-xs text-pietra"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          Referente: {s.nome_referente}
                          {s.email ? ` · ${s.email}` : ""}
                          {s.telefono ? ` · ${s.telefono}` : ""}
                        </p>
                      )}
                      {s.messaggio && (
                        <p
                          className="text-xs text-inchiostro/70 mt-2 italic max-w-prose"
                          style={{ fontFamily: "var(--font-fraunces)" }}
                        >
                          &ldquo;{s.messaggio}&rdquo;
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                      {s.commissione_maturata > 0 && (
                        <span
                          className={`text-xs font-medium ${s.commissione_liquidata ? "text-[#1a6b3a]" : "text-ocra"}`}
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          {s.commissione_liquidata ? "✓ Liquidata" : "Da liquidare"}: €{" "}
                          {s.commissione_maturata.toLocaleString("it-IT")}
                        </span>
                      )}
                    </div>
                  </div>
                  <AggiornaForm segnalazioneId={s.id} statoCorrente={s.stato} valoreCorrente={s.valore_progetto} liquidataCorrente={s.commissione_liquidata} />
                </div>
              );
            })}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
