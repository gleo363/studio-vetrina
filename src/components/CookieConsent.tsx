"use client";

import { useEffect, useState } from "react";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { useTesti } from "@/components/providers/LinguaProvider";

const TESTI = {
  it: {
    etichetta: "Preferenze cookie",
    testo:
      "Usiamo cookie di analisi (Google Analytics) per capire come viene usato il sito. Nessun dato viene raccolto senza il tuo consenso.",
    accetta: "Accetta",
    rifiuta: "Rifiuta",
  },
  en: {
    etichetta: "Cookie preferences",
    testo:
      "We use analytics cookies (Google Analytics) to see how people use the site. Nothing is collected unless you say yes.",
    accetta: "Accept",
    rifiuta: "Decline",
  },
};

const STORAGE_KEY = "vetrina_consent";

type Consenso = "granted" | "denied" | null;

export default function CookieConsent() {
  const [consenso, setConsenso] = useState<Consenso>(null);
  const [pronto, setPronto] = useState(false);
  const t = useTesti(TESTI);

  useEffect(() => {
    const salvato = localStorage.getItem(STORAGE_KEY);
    if (salvato === "granted" || salvato === "denied") setConsenso(salvato);
    setPronto(true);
  }, []);

  function scegli(valore: "granted" | "denied") {
    localStorage.setItem(STORAGE_KEY, valore);
    setConsenso(valore);
  }

  return (
    <>
      {consenso === "granted" && <GoogleAnalytics />}

      {pronto && consenso === null && (
        <div
          role="dialog"
          aria-label={t.etichetta}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:max-w-sm z-50 bg-inchiostro text-travertino rounded-2xl p-6 shadow-2xl"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          <p className="text-sm leading-relaxed mb-4 opacity-90">
            {t.testo}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => scegli("granted")}
              className="flex-1 bg-cotto text-travertino rounded-[10px] px-4 py-2.5 text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity"
            >
              {t.accetta}
            </button>
            <button
              onClick={() => scegli("denied")}
              className="flex-1 border border-travertino/30 text-travertino rounded-[10px] px-4 py-2.5 text-sm font-medium cursor-pointer hover:bg-travertino/10 transition-colors"
            >
              {t.rifiuta}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
