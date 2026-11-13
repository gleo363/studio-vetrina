import { cache } from "react";
import { cookies, headers } from "next/headers";
import { COOKIE_LINGUA, èLingua, linguaDaAcceptLanguage, type Lingua } from "./config";

/**
 * Lingua della richiesta corrente (server component, server action,
 * generateMetadata). Memorizzata per richiesta con cache() di React.
 * Leggere cookie e header rende la route dinamica: è voluto, la stessa
 * URL serve due lingue.
 */
export const getLingua = cache(async (): Promise<Lingua> => {
  const scelta = (await cookies()).get(COOKIE_LINGUA)?.value;
  if (èLingua(scelta)) return scelta;
  return linguaDaAcceptLanguage((await headers()).get("accept-language"));
});
