"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { inviaEmailBenvenutoPartner } from "@/lib/email";
import { SITE_URL } from "@/lib/site";
import { consentiRichiesta, ipClient } from "@/lib/ratelimit";
import { redirect } from "next/navigation";
import { getLingua } from "@/lib/i18n/server";

const ERRORI = {
  it: {
    tuttiObbligatori: "Tutti i campi sono obbligatori.",
    passwordCorta: "La password deve essere di almeno 8 caratteri.",
    rete: "Errore di rete. Riprova.",
    troppiTentativi: "Troppi tentativi. Riprova tra qualche minuto.",
    sospese: "Registrazioni momentaneamente sospese. Riprova più tardi.",
    giàRegistrata: "Questa email è già registrata. Prova ad accedere.",
    registrazione: "Errore durante la registrazione. Riprova.",
    profilo: "Errore durante la creazione del profilo. Riprova.",
    nomeObbligatorio: "Il nome è obbligatorio.",
    ibanFormato: "IBAN non valido. Verifica il formato.",
    ibanPaese: "IBAN non valido. Deve iniziare con il codice paese (es. IT).",
    nonAutorizzato: "Non autorizzato.",
    salvataggio: "Errore durante il salvataggio. Riprova.",
  },
  en: {
    tuttiObbligatori: "Please fill in every field.",
    passwordCorta: "Your password needs at least 8 characters.",
    rete: "Network error. Please try again.",
    troppiTentativi: "Too many attempts. Try again in a few minutes.",
    sospese: "Sign-ups are paused for now. Please try again later.",
    giàRegistrata: "This email is already registered. Try logging in instead.",
    registrazione: "Something went wrong while signing you up. Please try again.",
    profilo: "Something went wrong while creating your profile. Please try again.",
    nomeObbligatorio: "Your name is required.",
    ibanFormato: "That IBAN doesn't look right. Please check the format.",
    ibanPaese: "That IBAN doesn't look right. It should start with a country code (e.g. IT).",
    nonAutorizzato: "Not authorized.",
    salvataggio: "Something went wrong while saving. Please try again.",
  },
};

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
  const lingua = await getLingua();
  const e = ERRORI[lingua];

  if (!nome || !email || !password) {
    return { errore: e.tuttiObbligatori };
  }
  if (password.length < 8) {
    return { errore: e.passwordCorta };
  }

  // Honeypot: i bot riempiono questo campo, gli umani no
  const honeypot = (formData.get("website") as string) ?? "";
  if (honeypot) return { errore: e.rete };

  // Max 3 registrazioni l'ora dallo stesso IP
  const ip = await ipClient();
  if (!consentiRichiesta(`registrazione:${ip}`, 3, 60 * 60 * 1000)) {
    return { errore: e.troppiTentativi };
  }

  const admin = createAdminClient();

  // Tetto globale: max 20 registrazioni nelle ultime 24 ore (anti-flood)
  const da24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: registrazioniRecenti } = await admin
    .from("partner")
    .select("*", { count: "exact", head: true })
    .gte("creato_il", da24h);
  if ((registrazioniRecenti ?? 0) >= 20) {
    return { errore: e.sospese };
  }

  // Crea utente con email già confermata — bypassa SMTP di Supabase completamente
  const { data: adminData, error: adminError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    // Lingua delle email future (cambi di stato delle segnalazioni)
    user_metadata: { lingua },
  });

  if (adminError || !adminData?.user) {
    if (adminError?.message.toLowerCase().includes("already")) {
      return { errore: e.giàRegistrata };
    }
    return { errore: adminError?.message ?? e.registrazione };
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
    return { errore: e.profilo };
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
    lingua,
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
  const e = ERRORI[await getLingua()];

  if (!nome) return { errore: e.nomeObbligatorio };

  if (iban) {
    if (iban.length < 15 || iban.length > 34) {
      return { errore: e.ibanFormato };
    }
    if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(iban)) {
      return { errore: e.ibanPaese };
    }
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { errore: e.nonAutorizzato };

  const admin = createAdminClient();
  const aggiornamento: Record<string, string> = { nome };
  if (iban) aggiornamento.iban = iban;

  const { error } = await admin
    .from("partner")
    .update(aggiornamento)
    .eq("user_id", user.id);

  if (error) return { errore: e.salvataggio };

  return { successo: true };
}

export async function logoutPartner() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/partner/accedi");
}
