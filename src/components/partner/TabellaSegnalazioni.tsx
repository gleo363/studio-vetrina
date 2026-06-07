"use client";

const BADGE: Record<string, { label: string; cls: string }> = {
  segnalato: {
    label: "Segnalato",
    cls: "bg-pietra/15 text-pietra",
  },
  firmato: {
    label: "Firmato",
    cls: "bg-ocra/20 text-[#9a6b20]",
  },
  pagato: {
    label: "Pagato",
    cls: "bg-[#dcf5e8] text-[#1a6b3a]",
  },
  rifiutato: {
    label: "Rifiutato",
    cls: "bg-inchiostro/10 text-inchiostro/50",
  },
};

interface Segnalazione {
  id: string;
  nome_attivita: string;
  stato: string;
  valore_progetto: number;
  commissione_maturata: number;
  creato_il: string;
}

interface TabellaSegnalazioniProps {
  segnalazioni: Segnalazione[];
}

export default function TabellaSegnalazioni({
  segnalazioni,
}: TabellaSegnalazioniProps) {
  if (segnalazioni.length === 0) {
    return (
      <p
        className="text-pietra text-sm italic"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        Nessuna segnalazione ancora. Condividi il tuo codice per iniziare.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" style={{ fontFamily: "var(--font-inter)" }}>
        <thead>
          <tr className="border-b border-inchiostro/10">
            {["Attività", "Stato", "Valore", "Tua commissione", "Data"].map(
              (h) => (
                <th
                  key={h}
                  className="text-left text-xs font-medium text-pietra uppercase tracking-wider pb-3 pr-4"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {segnalazioni.map((s) => {
            const badge = BADGE[s.stato] ?? BADGE.segnalato;
            return (
              <tr
                key={s.id}
                className="border-b border-inchiostro/5 hover:bg-glass/50 transition-colors"
              >
                <td className="py-3 pr-4 font-medium text-inchiostro">
                  {s.nome_attivita}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.cls}`}
                  >
                    {badge.label}
                  </span>
                </td>
                <td className="py-3 pr-4 text-inchiostro">
                  {s.valore_progetto > 0
                    ? `€ ${s.valore_progetto.toLocaleString("it-IT")}`
                    : "—"}
                </td>
                <td className="py-3 pr-4 text-inchiostro font-medium">
                  {s.commissione_maturata > 0
                    ? `€ ${s.commissione_maturata.toLocaleString("it-IT")}`
                    : "—"}
                </td>
                <td className="py-3 text-pietra">
                  {new Date(s.creato_il).toLocaleDateString("it-IT")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
