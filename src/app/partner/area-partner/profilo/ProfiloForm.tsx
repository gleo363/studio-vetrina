"use client";

import { useActionState } from "react";
import { aggiornaProfilo } from "@/app/actions/partner";
import { useTesti } from "@/components/providers/LinguaProvider";

const TESTI = {
  it: {
    aggiornato: "Profilo aggiornato con successo.",
    nome: "Nome",
    email: "Email",
    cambiaEmail: "Per cambiare email contattaci direttamente.",
    ibanNota: "(per la liquidazione commissioni)",
    ibanAiuto: "Opzionale. Necessario solo per ricevere i pagamenti.",
    salvataggio: "Salvataggio…",
    salva: "Salva modifiche",
  },
  en: {
    aggiornato: "Profile updated.",
    nome: "Name",
    email: "Email",
    cambiaEmail: "To change your email, get in touch with us directly.",
    ibanNota: "(for commission payouts)",
    ibanAiuto: "Optional. Only needed to receive payments.",
    salvataggio: "Saving…",
    salva: "Save changes",
  },
};

interface Props {
  nomeIniziale: string;
  emailIniziale: string;
  ibanIniziale: string;
}

export default function ProfiloForm({ nomeIniziale, emailIniziale, ibanIniziale }: Props) {
  const [state, action, isPending] = useActionState(aggiornaProfilo, null);
  const t = useTesti(TESTI);

  return (
    <form action={action} className="bg-glass rounded-2xl p-8 flex flex-col gap-6">
      {state?.errore && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-sm text-red-700" style={{ fontFamily: "var(--font-inter)" }}>
            {state.errore}
          </p>
        </div>
      )}

      {state?.successo && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <p className="text-sm text-green-700" style={{ fontFamily: "var(--font-inter)" }}>
            {t.aggiornato}
          </p>
        </div>
      )}

      {/* Nome */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="nome"
          className="text-xs font-medium uppercase tracking-[0.15em] text-pietra"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {t.nome}
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          defaultValue={nomeIniziale}
          required
          className="w-full bg-travertino border border-inchiostro/15 rounded-xl px-4 py-3 text-sm text-inchiostro placeholder:text-pietra/60 focus:outline-none focus:ring-2 focus:ring-cotto/30 focus:border-cotto/50 transition-all"
          style={{ fontFamily: "var(--font-inter)" }}
        />
      </div>

      {/* Email (read-only) */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-xs font-medium uppercase tracking-[0.15em] text-pietra"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {t.email}
        </label>
        <input
          id="email"
          type="email"
          value={emailIniziale}
          readOnly
          disabled
          className="w-full bg-inchiostro/5 border border-inchiostro/10 rounded-xl px-4 py-3 text-sm text-pietra cursor-not-allowed"
          style={{ fontFamily: "var(--font-inter)" }}
        />
        <p className="text-xs text-pietra/60" style={{ fontFamily: "var(--font-inter)" }}>
          {t.cambiaEmail}
        </p>
      </div>

      {/* IBAN */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="iban"
          className="text-xs font-medium uppercase tracking-[0.15em] text-pietra"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          IBAN <span className="normal-case tracking-normal font-normal text-pietra/60">{t.ibanNota}</span>
        </label>
        <input
          id="iban"
          name="iban"
          type="text"
          defaultValue={ibanIniziale}
          placeholder="IT60 X054 2811 1010 0000 0123 456"
          autoComplete="off"
          className="w-full bg-travertino border border-inchiostro/15 rounded-xl px-4 py-3 text-sm text-inchiostro placeholder:text-pietra/40 focus:outline-none focus:ring-2 focus:ring-cotto/30 focus:border-cotto/50 transition-all tracking-wider font-mono"
        />
        <p className="text-xs text-pietra/60" style={{ fontFamily: "var(--font-inter)" }}>
          {t.ibanAiuto}
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full bg-inchiostro text-travertino rounded-xl py-3.5 text-sm font-medium transition-all duration-200 hover:bg-inchiostro/85 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {isPending ? t.salvataggio : t.salva}
      </button>
    </form>
  );
}
