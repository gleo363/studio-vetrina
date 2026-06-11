import { headers } from "next/headers";

// Rate limiter in memoria, per istanza serverless. Su Vercel ogni istanza ha la
// propria mappa: non è una garanzia assoluta, ma blocca i burst dalla stessa
// istanza (la maggioranza degli attacchi semplici). I tetti globali su DB nelle
// action coprono il resto.
const buckets = new Map<string, number[]>();
const MAX_BUCKETS = 5000;

export function consentiRichiesta(
  chiave: string,
  maxRichieste: number,
  finestraMs: number
): boolean {
  const ora = Date.now();

  // Pulizia periodica per non far crescere la mappa all'infinito
  if (buckets.size > MAX_BUCKETS) {
    for (const [k, tempi] of buckets) {
      if (tempi.every((t) => ora - t > finestraMs)) buckets.delete(k);
    }
  }

  const recenti = (buckets.get(chiave) ?? []).filter((t) => ora - t < finestraMs);
  if (recenti.length >= maxRichieste) {
    buckets.set(chiave, recenti);
    return false;
  }
  recenti.push(ora);
  buckets.set(chiave, recenti);
  return true;
}

// IP del client dietro il proxy Vercel (prima voce di x-forwarded-for)
export async function ipClient(): Promise<string> {
  const h = await headers();
  return (h.get("x-forwarded-for") ?? "sconosciuto").split(",")[0].trim();
}
