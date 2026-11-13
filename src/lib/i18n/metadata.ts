import type { Metadata } from "next";
import type { Testi } from "./config";
import { getLingua } from "./server";

/**
 * Metadata per pagina nelle due lingue.
 * Uso: export const generateMetadata = metadatiLocalizzati({ it: {...}, en: {...} });
 */
export function metadatiLocalizzati(testi: Testi<Metadata>) {
  return async function generateMetadata(): Promise<Metadata> {
    return testi[await getLingua()];
  };
}
