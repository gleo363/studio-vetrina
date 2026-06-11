import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/partner/area-partner";
  // Solo percorsi locali: "/" singolo iniziale (non "//" né "/\" che il browser
  // interpreterebbe come URL esterno)
  const next = /^\/(?![/\\])/.test(rawNext) ? rawNext : "/partner/area-partner";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/partner/accedi`);
}
