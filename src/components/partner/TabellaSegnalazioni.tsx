"use client";

import { useLingua } from "@/components/providers/LinguaProvider";
import { LOCALE_INTL } from "@/lib/i18n/config";

const BADGE_CLS: Record<string, string> = {
  segnalato: "bg-pietra/15 text-pietra",
  firmato: "bg-ocra/20 text-[#9a6b20]",
  pagato: "bg-[#dcf5e8] text-[#1a6b3a]",
  rifiutato: "bg-inchiostro/10 text-inchiostro/50",
};

const TESTI = {
  it: {
    stati: { segnalato: "Segnalato", firmato: "Firmato", pagato: "Pagato", rifiutato: "Rifiutato" } as Record<string, string>,
    intestazioni: ["Attività", "Stato", "Valore", "Tua commissione", "Data"],
    vuota: "Nessuna segnalazione ancora. Condividi il tuo codice per iniziare.",
  },
  en: {
    stati: { segnalato: "Referred", firmato: "Signed", pagato: "Paid", rifiutato: "Declined" } as Record<string, string>,
    intestazioni: ["Business", "Status", "Value", "Your commission", "Date"],
    vuota: "No referrals yet. Share your code to get started.",
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
  const lingua = useLingua();
  const t = TESTI[lingua];
  const locale = LOCALE_INTL[lingua];
  if (segnalazioni.length === 0) {
    return (
      <p
        className="text-pietra text-sm italic"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        {t.vuota}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" style={{ fontFamily: "var(--font-inter)" }}>
        <thead>
          <tr className="border-b border-inchiostro/10">
            {t.intestazioni.map(
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
            const stato = BADGE_CLS[s.stato] ? s.stato : "segnalato";
            const badge = { label: t.stati[stato], cls: BADGE_CLS[stato] };
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
                    ? `€ ${s.valore_progetto.toLocaleString(locale)}`
                    : "—"}
                </td>
                <td className="py-3 pr-4 text-inchiostro font-medium">
                  {s.commissione_maturata > 0
                    ? `€ ${s.commissione_maturata.toLocaleString(locale)}`
                    : "—"}
                </td>
                <td className="py-3 text-pietra">
                  {new Date(s.creato_il).toLocaleDateString(locale)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
