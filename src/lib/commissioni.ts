export function calcolaCommissione(
  valoreProgetto: number,
  commissione: number
): number {
  return Math.round(valoreProgetto * commissione * 100) / 100;
}
