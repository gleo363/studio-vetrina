"use client";

import { useMemo, useState } from "react";
import AggiornaForm from "./AggiornaForm";

const BADGE: Record<string, { label: string; cls: string }> = {
  segnalato: { label: "Segnalato", cls: "bg-pietra/15 text-pietra" },
  firmato: { label: "Firmato", cls: "bg-ocra/20 text-[#9a6b20]" },
  pagato: { label: "Pagato", cls: "bg-[#dcf5e8] text-[#1a6b3a]" },
  rifiutato: { label: "Rifiutato", cls: "bg-inchiostro/10 text-inchiostro/50" },
};

const STATI = [
  { value: "", label: "Tutti gli stati" },
  { value: "segnalato", label: "Segnalato" },
  { value: "firmato", label: "Firmato" },
  { value: "pagato", label: "Pagato" },
  { value: "rifiutato", label: "Rifiutato" },
];

interface PartnerInfo {
  nome: string;
  email: string;
  codice: string;
  commissione: number;
}

export interface Segnalazione {
  id: string;
  nome_attivita: string;
  nome_referente: string | null;
  email: string | null;
  telefono: string | null;
  messaggio: string | null;
  stato: string;
  valore_progetto: number;
  commissione_maturata: number;
  commissione_liquidata: boolean;
  creato_il: string;
  partner: PartnerInfo | null;
}

function campoCsv(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return "";
  const s = String(val);
  // Il punto e virgola è il separatore: i campi che lo contengono vanno quotati
  if (/[";\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function esportaCsv(righe: Segnalazione[]) {
  const intestazione = [
    "Data",
    "Attività",
    "Referente",
    "Email",
    "Telefono",
    "Partner",
    "Codice partner",
    "Stato",
    "Valore progetto (€)",
    "Commissione (€)",
    "Liquidata",
  ];

  const corpo = righe.map((s) =>
    [
      new Date(s.creato_il).toLocaleDateString("it-IT"),
      s.nome_attivita,
      s.nome_referente,
      s.email,
      s.telefono,
      s.partner?.nome ?? "Diretto",
      s.partner?.codice ?? "",
      s.stato,
      s.valore_progetto || "",
      s.commissione_maturata || "",
      s.commissione_liquidata ? "Sì" : "No",
    ]
      .map(campoCsv)
      .join(";")
  );

  // BOM UTF-8 + separatore ";" così Excel italiano apre il file correttamente
  const csv = "﻿" + [intestazione.join(";"), ...corpo].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `segnalazioni-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const selectCls =
  "bg-glass border border-inchiostro/10 rounded-xl px-3.5 py-2.5 text-sm text-inchiostro outline-none focus:border-inchiostro/30 transition-colors cursor-pointer";
const inputCls =
  "bg-glass border border-inchiostro/10 rounded-xl px-3.5 py-2 text-sm text-inchiostro outline-none focus:border-inchiostro/30 transition-colors";

export default function ListaSegnalazioni({
  segnalazioni,
}: {
  segnalazioni: Segnalazione[];
}) {
  const [filtroStato, setFiltroStato] = useState("");
  const [filtroPartner, setFiltroPartner] = useState("");
  const [dataDa, setDataDa] = useState("");
  const [dataA, setDataA] = useState("");

  const opzioniPartner = useMemo(() => {
    const visti = new Map<string, string>();
    for (const s of segnalazioni) {
      if (s.partner) visti.set(s.partner.codice, s.partner.nome);
    }
    return [...visti.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [segnalazioni]);

  const filtrate = useMemo(() => {
    return segnalazioni.filter((s) => {
      if (filtroStato && s.stato !== filtroStato) return false;
      if (filtroPartner === "diretto" && s.partner) return false;
      if (
        filtroPartner &&
        filtroPartner !== "diretto" &&
        s.partner?.codice !== filtroPartner
      )
        return false;
      const giorno = s.creato_il.slice(0, 10);
      if (dataDa && giorno < dataDa) return false;
      if (dataA && giorno > dataA) return false;
      return true;
    });
  }, [segnalazioni, filtroStato, filtroPartner, dataDa, dataA]);

  const filtriAttivi = filtroStato || filtroPartner || dataDa || dataA;

  return (
    <div className="flex flex-col gap-6">
      {/* Barra filtri + export */}
      <div
        className="flex flex-wrap items-end gap-3"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="filtro-stato" className="text-[11px] font-medium text-pietra uppercase tracking-wider">
            Stato
          </label>
          <select
            id="filtro-stato"
            value={filtroStato}
            onChange={(e) => setFiltroStato(e.target.value)}
            className={selectCls}
          >
            {STATI.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filtro-partner" className="text-[11px] font-medium text-pietra uppercase tracking-wider">
            Partner
          </label>
          <select
            id="filtro-partner"
            value={filtroPartner}
            onChange={(e) => setFiltroPartner(e.target.value)}
            className={selectCls}
          >
            <option value="">Tutti</option>
            <option value="diretto">Diretto (senza partner)</option>
            {opzioniPartner.map(([codice, nome]) => (
              <option key={codice} value={codice}>
                {nome} ({codice})
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filtro-da" className="text-[11px] font-medium text-pietra uppercase tracking-wider">
            Dal
          </label>
          <input
            id="filtro-da"
            type="date"
            value={dataDa}
            onChange={(e) => setDataDa(e.target.value)}
            className={inputCls}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filtro-a" className="text-[11px] font-medium text-pietra uppercase tracking-wider">
            Al
          </label>
          <input
            id="filtro-a"
            type="date"
            value={dataA}
            onChange={(e) => setDataA(e.target.value)}
            className={inputCls}
          />
        </div>

        {filtriAttivi && (
          <button
            onClick={() => {
              setFiltroStato("");
              setFiltroPartner("");
              setDataDa("");
              setDataA("");
            }}
            className="text-xs text-pietra underline underline-offset-2 hover:text-inchiostro transition-colors py-3 cursor-pointer"
          >
            Azzera filtri
          </button>
        )}

        <div className="ml-auto flex items-center gap-4">
          <span className="text-xs text-pietra">
            {filtrate.length} di {segnalazioni.length}
          </span>
          <button
            onClick={() => esportaCsv(filtrate)}
            disabled={filtrate.length === 0}
            className="inline-flex items-center gap-2 bg-inchiostro text-travertino rounded-[10px] px-5 py-2.5 text-sm font-medium hover:bg-inchiostro/85 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default"
          >
            Esporta CSV ↓
          </button>
        </div>
      </div>

      {/* Lista */}
      <div className="flex flex-col gap-4">
        {filtrate.length === 0 && (
          <p
            className="text-pietra text-sm italic"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            {segnalazioni.length === 0
              ? "Nessuna segnalazione ancora."
              : "Nessuna segnalazione corrisponde ai filtri."}
          </p>
        )}
        {filtrate.map((s) => {
          const badge = BADGE[s.stato] ?? BADGE.segnalato;

          return (
            <div
              key={s.id}
              className="bg-glass rounded-2xl p-6 flex flex-col gap-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p
                    className="font-medium text-inchiostro text-lg"
                    style={{ fontFamily: "var(--font-fraunces)" }}
                  >
                    {s.nome_attivita}
                  </p>
                  <p
                    className="text-xs text-pietra mt-1"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    {s.partner ? `Partner: ${s.partner.nome} (${s.partner.codice}) ·` : "Diretto ·"}{" "}
                    {new Date(s.creato_il).toLocaleDateString("it-IT")}
                  </p>
                  {s.nome_referente && (
                    <p
                      className="text-xs text-pietra"
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      Referente: {s.nome_referente}
                      {s.email ? ` · ${s.email}` : ""}
                      {s.telefono ? ` · ${s.telefono}` : ""}
                    </p>
                  )}
                  {s.messaggio && (
                    <p
                      className="text-xs text-inchiostro/70 mt-2 italic max-w-prose"
                      style={{ fontFamily: "var(--font-fraunces)" }}
                    >
                      &ldquo;{s.messaggio}&rdquo;
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.cls}`}
                  >
                    {badge.label}
                  </span>
                  {s.commissione_maturata > 0 && (
                    <span
                      className={`text-xs font-medium ${s.commissione_liquidata ? "text-[#1a6b3a]" : "text-ocra"}`}
                      style={{ fontFamily: "var(--font-inter)" }}
                    >
                      {s.commissione_liquidata ? "✓ Liquidata" : "Da liquidare"}: €{" "}
                      {s.commissione_maturata.toLocaleString("it-IT")}
                    </span>
                  )}
                </div>
              </div>
              <AggiornaForm
                segnalazioneId={s.id}
                statoCorrente={s.stato}
                valoreCorrente={s.valore_progetto}
                liquidataCorrente={s.commissione_liquidata}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
