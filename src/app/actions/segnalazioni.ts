"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { calcolaCommissione } from "@/lib/commissioni";
import { inviaEmailContatto, inviaEmailStatoSegnalazione } from "@/lib/email";
import { consentiRichiesta, ipClient } from "@/lib/ratelimit";
import { isAdminEmail } from "@/lib/admin";
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

  // Honeypot: i bot riempiono questo campo, gli umani no
  const honeypot = (formData.get("website") as string) ?? "";
  if (honeypot) return { errore: "Errore di rete. Riprova." };

  // Rate limiting per IP: max 5 invii l'ora (l'email è dichiarata dal mittente
  // e quindi aggirabile; l'IP no)
  const ip = await ipClient();
  if (!consentiRichiesta(`contatto:${ip}`, 5, 60 * 60 * 1000)) {
    return { errore: "Troppi invii ravvicinati. Attendi qualche minuto e riprova." };
  }

  // Rate limiting: max 3 invii per email nelle ultime 24 ore
  const adminCheck = createAdminClient();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await adminCheck
    .from("segnalazione")
    .select("*", { count: "exact", head: true })
    .eq("email", email)
    .gte("creato_il", since);
  if ((count ?? 0) >= 3) {
    return { errore: "Hai già inviato troppi messaggi oggi. Riprova domani o scrivici direttamente." };
  }

  // Tetto globale: max 30 segnalazioni nelle ultime 24 ore (anti-flood,
  // protegge quota Resend e tabella anche da attacchi distribuiti)
  const { count: totale24h } = await adminCheck
    .from("segnalazione")
    .select("*", { count: "exact", head: true })
    .gte("creato_il", since);
  if ((totale24h ?? 0) >= 30) {
    return { errore: "Servizio momentaneamente non disponibile. Scrivici direttamente via email." };
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
  if (!user || !isAdminEmail(user.email)) {
    return { errore: "Non autorizzato." };
  }

  const admin = createAdminClient();

  const aggiornamento: Record<string, unknown> = { ...data };

  if (data.stato === "firmato" && data.valore_progetto !== undefined) {
    aggiornamento.firmato_il = new Date().toISOString();
  }

  let commissioneMaturata: number | undefined;

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
      commissioneMaturata = calcolaCommissione(
        data.valore_progetto ?? seg.valore_progetto,
        partnerCommissione
      );
      aggiornamento.commissione_maturata = commissioneMaturata;
      aggiornamento.pagato_il = new Date().toISOString();
    }
  }

  const { error } = await admin
    .from("segnalazione")
    .update(aggiornamento)
    .eq("id", id);

  if (error) return { errore: error.message };

  // Notifica email al partner se lo stato è cambiato a firmato/pagato/rifiutato
  if (data.stato && ["firmato", "pagato", "rifiutato"].includes(data.stato)) {
    const { data: seg } = await admin
      .from("segnalazione")
      .select("nome_attivita, partner:partner_id(email, nome)")
      .eq("id", id)
      .single();

    if (seg) {
      const rawPartner = Array.isArray(seg.partner) ? seg.partner[0] : seg.partner;
      const partnerInfo = rawPartner as { email: string; nome: string } | null;
      if (partnerInfo?.email && partnerInfo?.nome) {
        await inviaEmailStatoSegnalazione({
          partnerEmail: partnerInfo.email,
          partnerNome: partnerInfo.nome,
          nomeAttivita: seg.nome_attivita,
          statoNuovo: data.stato,
          commissioneMaturata,
        });
      }
    }
  }

  revalidatePath("/admin");
  return { successo: true };
}

export async function getSegnalazioniAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) return null;

  const admin = createAdminClient();
  const { data } = await admin
    .from("segnalazione")
    .select("*, partner:partner_id(nome, email, codice, commissione)")
    .order("creato_il", { ascending: false });

  return data;
}
