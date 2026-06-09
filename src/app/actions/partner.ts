"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { inviaEmailBenvenutoPartner } from "@/lib/email";
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

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://studio-vetrina.vercel.app";
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (authError) {
    if (authError.message.includes("already registered")) {
      return { errore: "Questa email è già registrata. Prova ad accedere." };
    }
    return { errore: authError.message };
  }

  if (!authData.user) {
    return { errore: "Errore durante la registrazione. Riprova." };
  }

  const admin = createAdminClient();
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
    user_id: authData.user.id,
    nome,
    email,
    codice,
  });

  if (partnerError) {
    return { errore: "Errore durante la creazione del profilo. Riprova." };
  }

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
