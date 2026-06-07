"use client";

import { useState, useTransition } from "react";
import { aggiornaSegnalazione } from "@/app/actions/segnalazioni";

interface AggiornaFormProps {
  segnalazioneId: string;
  statoCorrente: string;
  valoreCorrente: number;
  liquidataCorrente: boolean;
}

const STATI = ["segnalato", "firmato", "pagato", "rifiutato"];

export default function AggiornaForm({
  segnalazioneId,
  statoCorrente,
  valoreCorrente,
  liquidataCorrente,
}: AggiornaFormProps) {
  const [stato, setStato] = useState(statoCorrente);
  const [valore, setValore] = useState(valoreCorrente);
  const [liquidata, setLiquidata] = useState(liquidataCorrente);
  const [messaggio, setMessaggio] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function salva() {
    startTransition(async () => {
      const result = await aggiornaSegnalazione(segnalazioneId, {
        stato,
        valore_progetto: valore,
        commissione_liquidata: liquidata,
      });
      setMessaggio(result?.errore ?? "Salvato.");
      setTimeout(() => setMessaggio(null), 3000);
    });
  }

  return (
    <div
      className="flex flex-wrap items-end gap-4 pt-2 border-t border-inchiostro/8"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs text-pietra uppercase tracking-wider">
          Stato
        </label>
        <select
          value={stato}
          onChange={(e) => setStato(e.target.value)}
          className="bg-travertino border border-inchiostro/10 rounded-lg px-3 py-2 text-sm text-inchiostro outline-none focus:border-inchiostro/30"
        >
          {STATI.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-pietra uppercase tracking-wider">
          Valore progetto (€)
        </label>
        <input
          type="number"
          min={0}
          step={10}
          value={valore}
          onChange={(e) => setValore(Number(e.target.value))}
          className="bg-travertino border border-inchiostro/10 rounded-lg px-3 py-2 text-sm text-inchiostro outline-none focus:border-inchiostro/30 w-36"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-inchiostro cursor-pointer">
        <input
          type="checkbox"
          checked={liquidata}
          onChange={(e) => setLiquidata(e.target.checked)}
          className="accent-cotto w-4 h-4"
        />
        Commissione liquidata
      </label>

      <button
        onClick={salva}
        disabled={pending}
        className="bg-inchiostro text-travertino rounded-lg px-4 py-2 text-sm font-medium hover:bg-inchiostro/80 transition-colors disabled:opacity-50"
      >
        {pending ? "Salvo…" : "Salva"}
      </button>

      {messaggio && (
        <p className="text-xs text-pietra">{messaggio}</p>
      )}
    </div>
  );
}
