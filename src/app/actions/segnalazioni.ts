"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { calcolaCommissione } from "@/lib/commissioni";
import { inviaEmailContatto } from "@/lib/email";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function inviaContatto(
  _prevState: { errore?: string; successo?: boolean } | null,
  formData: FormData
): Promise<{ errore?: string; successo?: boolean }> {
  const nome = (formData.get("nome") as string)?.trim();
  const attivita = (formData.get("attivita") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const telefono = (formData.get("telefono") as string)?.trim() || null;
  const messaggio = (formData.get("messaggio") as string)?.trim() || null;

  if (!nome || !attivita || !email) {
    return { errore: "Nome, attività e email sono obbligatori." };
  }

  const cookieStore = await cookies();
  const ref = cookieStore.get("vetrina_ref")?.value;

  const admin = createAdminClient();
  let partnerId: string | null = null;

  if (ref) {
    const { data: partner } = await admin
      .from("partner")
      .select("id")
      .eq("codice", ref)
      .maybeSingle();
    if (partner) partnerId = partner.id;
  }

  await admin.from("segnalazione").insert({
    partner_id: partnerId,
    nome_attivita: attivita,
    nome_referente: nome,
    email,
    telefono,
    messaggio,
    stato: "segnalato",
  });

  await inviaEmailContatto({
    nome,
    attivita,
    email,
    telefono,
    messaggio,
    codicePartner: partnerId ? ref! : null,
  });

  return { successo: true };
}

export async function aggiornaSegnalazione(
  id: string,
  data: {
    stato?: string;
    valore_progetto?: number;
    commissione_liquidata?: boolean;
    note?: string;
  }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return { errore: "Non autorizzato." };
  }

  const admin = createAdminClient();

  const aggiornamento: Record<string, unknown> = { ...data };

  if (data.stato === "firmato" && data.valore_progetto !== undefined) {
    aggiornamento.firmato_il = new Date().toISOString();
  }

  if (data.stato === "pagato") {
    const { data: seg } = await admin
      .from("segnalazione")
      .select("valore_progetto, partner:partner_id(commissione)")
      .eq("id", id)
      .single();

    if (seg) {
      const rawPartner = Array.isArray(seg.partner)
        ? seg.partner[0]
        : seg.partner;
      const partnerCommissione =
        (rawPartner as { commissione: number } | null)?.commissione ?? 0.1;
      aggiornamento.commissione_maturata = calcolaCommissione(
        data.valore_progetto ?? seg.valore_progetto,
        partnerCommissione
      );
      aggiornamento.pagato_il = new Date().toISOString();
    }
  }

  const { error } = await admin
    .from("segnalazione")
    .update(aggiornamento)
    .eq("id", id);

  if (error) return { errore: error.message };

  revalidatePath("/admin");
  return { successo: true };
}

export async function getSegnalazioniAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) return null;

  const admin = createAdminClient();
  const { data } = await admin
    .from("segnalazione")
    .select("*, partner:partner_id(nome, email, codice, commissione)")
    .order("creato_il", { ascending: false });

  return data;
}
