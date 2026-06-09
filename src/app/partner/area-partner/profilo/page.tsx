import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Link from "next/link";
import ProfiloForm from "./ProfiloForm";

export const metadata = { title: "Profilo" };

export default async function ProfiloPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/partner/accedi");

  const admin = createAdminClient();
  const { data: partner } = await admin
    .from("partner")
    .select("nome, email, iban")
    .eq("user_id", user.id)
    .single();

  if (!partner) redirect("/partner/accedi");

  return (
    <div className="min-h-screen bg-travertino pt-32 pb-24 px-6">
      <div className="max-w-lg mx-auto flex flex-col gap-10">
        <AnimatedSection>
          <Link
            href="/partner/area-partner"
            className="inline-flex items-center gap-2 text-sm text-pietra hover:text-inchiostro transition-colors duration-200 mb-2"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            ← Torna alla dashboard
          </Link>
          <p
            className="text-xs font-medium uppercase tracking-[0.2em] text-pietra mt-6 mb-3"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Area Partner
          </p>
          <h1
            className="text-3xl md:text-4xl font-medium text-inchiostro"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Il tuo profilo
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <ProfiloForm
            nomeIniziale={partner.nome}
            emailIniziale={partner.email}
            ibanIniziale={partner.iban ?? ""}
          />
        </AnimatedSection>
      </div>
    </div>
  );
}
