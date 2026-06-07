import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import AnimatedSection from "@/components/ui/AnimatedSection";
import QrCodePartner from "@/components/partner/QrCodePartner";
import CardGuadagni from "@/components/partner/CardGuadagni";
import TabellaSegnalazioni from "@/components/partner/TabellaSegnalazioni";
import LogoutButton from "./LogoutButton";
import CopiaCodiceClient from "./CopiaCodiceClient";

export default async function AreaPartnerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/partner/accedi");

  const admin = createAdminClient();
  const { data: partner } = await admin
    .from("partner")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!partner) redirect("/partner/accedi");

  const { data: segnalazioni = [] } = await admin
    .from("segnalazione")
    .select("*")
    .eq("partner_id", partner.id)
    .order("creato_il", { ascending: false });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vetrina.it";
  const linkPartner = `${siteUrl}/?ref=${partner.codice}`;

  const lista = segnalazioni ?? [];

  const maturate = lista
    .filter((s) => s.stato === "pagato")
    .reduce((acc, s) => acc + (s.commissione_maturata ?? 0), 0);

  const inAttesa = lista
    .filter((s) => s.stato === "firmato")
    .reduce(
      (acc, s) => acc + (s.valore_progetto ?? 0) * partner.commissione,
      0
    );

  const liquidate = lista
    .filter((s) => s.commissione_liquidata)
    .reduce((acc, s) => acc + (s.commissione_maturata ?? 0), 0);

  return (
    <div className="min-h-screen bg-travertino pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-16">
        {/* Header */}
        <AnimatedSection className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p
              className="text-xs font-medium uppercase tracking-[0.2em] text-pietra mb-3"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Area Partner
            </p>
            <h1
              className="text-3xl md:text-4xl font-medium text-inchiostro"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Ciao, {partner.nome.split(" ")[0]}.
            </h1>
          </div>
          <LogoutButton />
        </AnimatedSection>

        {/* Il tuo codice */}
        <AnimatedSection delay={0.1}>
          <div className="bg-glass rounded-2xl p-8">
            <p
              className="text-xs font-medium uppercase tracking-[0.2em] text-pietra mb-6"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Il tuo codice
            </p>
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="flex-1 flex flex-col gap-5">
                <p
                  className="text-6xl font-medium text-inchiostro tracking-wider"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                >
                  {partner.codice}
                </p>
                <CopiaCodiceClient link={linkPartner} />
              </div>
              <QrCodePartner url={linkPartner} codice={partner.codice} />
            </div>
          </div>
        </AnimatedSection>

        {/* I tuoi guadagni */}
        <AnimatedSection delay={0.15}>
          <p
            className="text-xs font-medium uppercase tracking-[0.2em] text-pietra mb-6"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            I tuoi guadagni
          </p>
          <CardGuadagni
            maturate={maturate}
            inAttesa={Math.round(inAttesa)}
            liquidate={liquidate}
          />
        </AnimatedSection>

        {/* Le tue segnalazioni */}
        <AnimatedSection delay={0.2}>
          <p
            className="text-xs font-medium uppercase tracking-[0.2em] text-pietra mb-6"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Le tue segnalazioni
          </p>
          <TabellaSegnalazioni segnalazioni={lista} />
        </AnimatedSection>
      </div>
    </div>
  );
}
