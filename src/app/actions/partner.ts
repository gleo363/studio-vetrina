"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
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

export async function logoutPartner() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/partner/accedi");
}
