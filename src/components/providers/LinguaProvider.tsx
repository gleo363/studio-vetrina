"use client";
import { createContext, useContext } from "react";
import { LINGUA_PREDEFINITA, type Lingua, type Testi } from "@/lib/i18n/config";

const LinguaContext = createContext<Lingua>(LINGUA_PREDEFINITA);

/**
 * La lingua arriva dal layout (server), che la legge da cookie o browser.
 * Al cambio lingua il layout si ri-renderizza e il valore qui si aggiorna.
 */
export default function LinguaProvider({
  lingua,
  children,
}: {
  lingua: Lingua;
  children: React.ReactNode;
}) {
  return <LinguaContext.Provider value={lingua}>{children}</LinguaContext.Provider>;
}

export function useLingua(): Lingua {
  return useContext(LinguaContext);
}

/** Restituisce i testi nella lingua corrente. */
export function useTesti<T>(testi: Testi<T>): T {
  return testi[useContext(LinguaContext)];
}
