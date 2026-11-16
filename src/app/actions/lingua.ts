"use server";

import { cookies } from "next/headers";
import { COOKIE_LINGUA, èLingua } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/server";

/** Salva la lingua scelta dal visitatore per un anno. */
export async function impostaLingua(lingua: string) {
  if (!èLingua(lingua)) return;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_LINGUA, lingua, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  // Se è un partner con sessione attiva, ricordiamo la lingua anche per
  // le email che gli invieremo (cambi di stato delle segnalazioni).
  const haSessione = cookieStore
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"));
  if (!haSessione) return;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && user.user_metadata?.lingua !== lingua) {
      await supabase.auth.updateUser({ data: { lingua } });
    }
  } catch {
    // La lingua del sito resta salvata comunque nel cookie.
  }
}
