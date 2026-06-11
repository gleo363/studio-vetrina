"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { inviaEmailBenvenutoPartner } from "@/lib/email";
import { SITE_URL } from "@/lib/site";
import { consentiRichiesta, ipClient } from "@/lib/ratelimit";
import { redirect } from "next/navigation";

function generaCodiceBase(nome: string): string {
  const prefisso = nome
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 5);
  const numero = Math.floor(10 + Math.random() * 90);
  return prefisso + numero;
}

export async function registraPartner(
  _prevState: { errore?: string } | null,
  formData: FormData
): Promise<{ errore: string }> {
  const nome = (formData.get("nome") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!nome || !email || !password) {
    return { errore: "Tutti i campi sono obbligatori." };
  }
  if (password.length < 8) {
    return { errore: "La password deve essere di almeno 8 caratteri." };
  }

  // Honeypot: i bot riempiono questo campo, gli umani no
  const honeypot = (formData.get("website") as string) ?? "";
  if (honeypot) return { errore: "Errore di rete. Riprova." };

  // Max 3 registrazioni l'ora dallo stesso IP
  const ip = await ipClient();
  if (!consentiRichiesta(`registrazione:${ip}`, 3, 60 * 60 * 1000)) {
    return { errore: "Troppi tentativi. Riprova tra qualche minuto." };
  }

  const admin = createAdminClient();

  // Tetto globale: max 20 registrazioni nelle ultime 24 ore (anti-flood)
  const da24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: registrazioniRecenti } = await admin
    .from("partner")
    .select("*", { count: "exact", head: true })
    .gte("creato_il", da24h);
  if ((registrazioniRecenti ?? 0) >= 20) {
    return { errore: "Registrazioni momentaneamente sospese. Riprova più tardi." };
  }

  // Crea utente con email già confermata — bypassa SMTP di Supabase completamente
  const { data: adminData, error: adminError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (adminError || !adminData?.user) {
    if (adminError?.message.toLowerCase().includes("already")) {
      return { errore: "Questa email è già registrata. Prova ad accedere." };
    }
    return { errore: adminError?.message ?? "Errore durante la registrazione. Riprova." };
  }

  let codice = generaCodiceBase(nome);

  for (let i = 0; i < 10; i++) {
    const { data } = await admin
      .from("partner")
      .select("id")
      .eq("codice", codice)
      .maybeSingle();
    if (!data) break;
    codice = generaCodiceBase(nome);
  }

  const { error: partnerError } = await admin.from("partner").insert({
    user_id: adminData.user.id,
    nome,
    email,
    codice,
  });

  if (partnerError) {
    await admin.auth.admin.deleteUser(adminData.user.id);
    return { errore: "Errore durante la creazione del profilo. Riprova." };
  }

  // Logga l'utente subito — nessuna email di conferma necessaria
  const supabase = await createClient();
  await supabase.auth.signInWithPassword({ email, password });

  const siteUrl = SITE_URL;
  await inviaEmailBenvenutoPartner({
    nome,
    email,
    codice,
    linkPartner: `${siteUrl}/partner/area-partner`,
  });

  redirect("/partner/area-partner");
}

export async function getPartnerCorrente() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("partner")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return data;
}

export async function aggiornaProfilo(
  _prevState: { errore?: string; successo?: boolean } | null,
  formData: FormData
): Promise<{ errore?: string; successo?: boolean }> {
  const nome = (formData.get("nome") as string)?.trim();
  const iban = (formData.get("iban") as string)?.trim().replace(/\s/g, "");

  if (!nome) return { errore: "Il nome è obbligatorio." };

  if (iban) {
    if (iban.length < 15 || iban.length > 34) {
      return { errore: "IBAN non valido. Verifica il formato." };
    }
    if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(iban)) {
      return { errore: "IBAN non valido. Deve iniziare con il codice paese (es. IT)." };
    }
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { errore: "Non autorizzato." };

  const admin = createAdminClient();
  const aggiornamento: Record<string, string> = { nome };
  if (iban) aggiornamento.iban = iban;

  const { error } = await admin
    .from("partner")
    .update(aggiornamento)
    .eq("user_id", user.id);

  if (error) return { errore: "Errore durante il salvataggio. Riprova." };

  return { successo: true };
}

export async function logoutPartner() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/partner/accedi");
}
