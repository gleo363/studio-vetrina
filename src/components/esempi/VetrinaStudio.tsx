"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Archivo, IBM_Plex_Mono } from "next/font/google";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  display: "swap",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

// Palette del laboratorio — quasi-nero, bianco osso, legno
const C = {
  nero: "#161412",
  nerochiaro: "#1E1B18",
  osso: "#F5F3EF",
  legno: "#B08968",
  legnoscuro: "#8A6B4F",
  grigio: "#8C8680",
};

type Lavoro = {
  numero: string;
  nome: string;
  luogo: string;
  anno: string;
  essenza: string;
  finitura: string;
  tempi: string;
  descrizione: string;
};

const lavori: Lavoro[] = [
  {
    numero: "01",
    nome: "Cucina in rovere di Slavonia",
    luogo: "Appartamento in Oltrarno",
    anno: "2025",
    essenza: "Rovere massello",
    finitura: "Olio naturale opaco",
    tempi: "Nove settimane",
    descrizione:
      "Sette metri lineari senza una sola maniglia: le ante si aprono con la gola scavata nel pieno. Il piano è un'unica tavola di rovere giuntata a pettine, levigata fino a grana mille.",
  },
  {
    numero: "02",
    nome: "Libreria a tutta parete",
    luogo: "Studio di un notaio, centro storico",
    anno: "2024",
    essenza: "Noce nazionale",
    finitura: "Gommalacca a tampone",
    tempi: "Sei settimane",
    descrizione:
      "Quattro metri e mezzo di altezza, scala a carrello compresa. Ogni ripiano regge ottanta chili di faldoni: lo abbiamo verificato caricandoli noi, prima della consegna.",
  },
  {
    numero: "03",
    nome: "Restauro di un portone del Seicento",
    luogo: "Palazzo in via Maggio",
    anno: "2024",
    essenza: "Castagno originale",
    finitura: "Cera d'api e terre naturali",
    tempi: "Quattro mesi",
    descrizione:
      "Smontato pezzo per pezzo, documentato chiodo per chiodo. Le parti marce sono state sostituite con castagno stagionato vent'anni; tutto il resto è ancora quello del 1640.",
  },
  {
    numero: "04",
    nome: "Infissi per una casa colonica",
    luogo: "Campagna di Fiesole",
    anno: "2023",
    essenza: "Larice termotrattato",
    finitura: "Velatura grigio cenere",
    tempi: "Dieci settimane",
    descrizione:
      "Diciotto finestre e quattro portefinestre, tutte fuori squadra come le mura che le ospitano. Ogni telaio è stato rilevato a dima sul posto, nessuno è uguale all'altro.",
  },
];

const competenze = [
  {
    codice: "A",
    nome: "Arredo su misura",
    nota: "Cucine, librerie, armadi a muro, tavoli. Dal rilievo alla posa.",
  },
  {
    codice: "B",
    nome: "Restauro conservativo",
    nota: "Mobili e serramenti d'epoca. Si conserva tutto il conservabile.",
  },
  {
    codice: "C",
    nome: "Serramenti",
    nota: "Finestre, porte e portoni in essenza, anche per edifici vincolati.",
  },
  {
    codice: "D",
    nome: "Scale e soppalchi",
    nota: "Strutture portanti in legno, calcolate e certificate.",
  },
];

const tipiLavoro = ["Arredo su misura", "Restauro", "Serramenti", "Altro"];

function Rivela({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease, delay }}
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

/** Quota da disegno tecnico: linea con frecce e misura. */
function QuotaMisura({ etichetta, className = "" }: { etichetta: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <svg width="11" height="10" viewBox="0 0 11 10" fill="none">
        <path d="M10 1 L1 5 L10 9" stroke={C.legno} strokeWidth="1" />
      </svg>
      <span className="h-px flex-1" style={{ backgroundColor: `${C.legno}66` }} />
      <span
        className={`${mono.className} text-[10px] tracking-[0.18em] uppercase shrink-0`}
        style={{ color: C.legno }}
      >
        {etichetta}
      </span>
      <span className="h-px flex-1" style={{ backgroundColor: `${C.legno}66` }} />
      <svg width="11" height="10" viewBox="0 0 11 10" fill="none">
        <path d="M1 1 L10 5 L1 9" stroke={C.legno} strokeWidth="1" />
      </svg>
    </div>
  );
}

/** Venatura del legno disegnata: linee concentriche irregolari. */
function Venatura({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <motion.path
          key={i}
          d={`M-20 ${30 + i * 26} C 80 ${18 + i * 26}, 140 ${44 + i * 26}, 220 ${
            26 + i * 26
          } C 300 ${10 + i * 26}, 340 ${40 + i * 26}, 420 ${28 + i * 26}`}
          stroke={C.legno}
          strokeWidth={i % 3 === 0 ? 1.4 : 0.7}
          opacity={0.5 - i * 0.05}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 1.8, ease, delay: i * 0.08 }}
          viewport={{ once: true }}
        />
      ))}
      {/* nodo del legno */}
      <motion.ellipse
        cx="250"
        cy="92"
        rx="22"
        ry="11"
        stroke={C.legno}
        strokeWidth="1.2"
        opacity="0.55"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.8, ease, delay: 0.9 }}
        viewport={{ once: true }}
      />
      <motion.ellipse
        cx="250"
        cy="92"
        rx="11"
        ry="5"
        stroke={C.legno}
        strokeWidth="0.9"
        opacity="0.45"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.8, ease, delay: 1.05 }}
        viewport={{ once: true }}
      />
    </svg>
  );
}

/** Riga di portfolio full-bleed che si apre come un cassetto. */
function RigaLavoro({
  lavoro,
  aperto,
  onToggle,
}: {
  lavoro: Lavoro;
  aperto: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ borderTop: `1px solid ${C.osso}1F` }}>
      <button
        onClick={onToggle}
        aria-expanded={aperto}
        className="w-full text-left px-6 md:px-12 py-8 md:py-10 grid grid-cols-[auto_1fr_auto] items-center gap-5 md:gap-10 group cursor-pointer transition-colors duration-300"
        style={{ backgroundColor: aperto ? C.nerochiaro : "transparent" }}
      >
        <span
          className={`${mono.className} text-xs md:text-sm transition-colors duration-300`}
          style={{ color: aperto ? C.legno : C.grigio }}
        >
          {lavoro.numero}
        </span>
        <span className="min-w-0">
          <span
            className="block text-2xl md:text-4xl font-extralight tracking-tight leading-snug transition-colors duration-300 group-hover:text-white"
            style={{ color: C.osso }}
          >
            {lavoro.nome}
          </span>
          <span
            className={`${mono.className} mt-2 block text-[10px] md:text-[11px] uppercase tracking-[0.2em]`}
            style={{ color: C.grigio }}
          >
            {lavoro.luogo} · {lavoro.anno}
          </span>
        </span>
        <span
          className="w-11 h-11 md:w-13 md:h-13 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300"
          style={{
            border: `1px solid ${aperto ? C.legno : `${C.osso}40`}`,
            backgroundColor: aperto ? C.legno : "transparent",
          }}
          aria-hidden="true"
        >
          <motion.svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            animate={{ rotate: aperto ? 45 : 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <path
              d="M7 1 V13 M1 7 H13"
              stroke={aperto ? C.nero : C.osso}
              strokeWidth="1.3"
            />
          </motion.svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {aperto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            className="overflow-hidden"
            style={{ backgroundColor: C.nerochiaro }}
          >
            <div className="px-6 md:px-12 pb-10 grid md:grid-cols-[1fr_1fr] gap-8 md:gap-14">
              <p
                className="text-base md:text-lg font-light leading-relaxed max-w-xl"
                style={{ color: `${C.osso}CC` }}
              >
                {lavoro.descrizione}
              </p>
              <div className={`${mono.className} grid grid-cols-1 sm:grid-cols-3 gap-5 content-start`}>
                {[
                  { voce: "Essenza", valore: lavoro.essenza },
                  { voce: "Finitura", valore: lavoro.finitura },
                  { voce: "Tempi", valore: lavoro.tempi },
                ].map((r) => (
                  <div key={r.voce} style={{ borderTop: `1px solid ${C.legno}59` }} className="pt-3">
                    <p
                      className="text-[10px] uppercase tracking-[0.22em] mb-1.5"
                      style={{ color: C.legno }}
                    >
                      {r.voce}
                    </p>
                    <p className="text-[13px] leading-snug" style={{ color: C.osso }}>
                      {r.valore}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function VetrinaStudio() {
  const [apertoIdx, setApertoIdx] = useState<number | null>(null);
  const [inviato, setInviato] = useState(false);
  const [tipo, setTipo] = useState("");

  const indice = [
    { n: "01", href: "#lavori", label: "Lavori" },
    { n: "02", href: "#mestiere", label: "Mestiere" },
    { n: "03", href: "#competenze", label: "Competenze" },
    { n: "04", href: "#preventivo", label: "Preventivo" },
  ];

  return (
    <div
      className={archivo.className}
      style={{ backgroundColor: C.nero, color: C.osso }}
    >
      {/* ── Testata da cartiglio tecnico: nome + indice numerato ── */}
      <header style={{ borderBottom: `1px solid ${C.osso}1F` }}>
        <div className="px-6 md:px-12 py-5 flex items-center justify-between gap-4">
          <p className="text-[13px] md:text-sm font-light uppercase tracking-[0.45em] whitespace-nowrap">
            Falegnameria Marini
          </p>
          <p
            className={`${mono.className} hidden md:block text-[10px] uppercase tracking-[0.2em]`}
            style={{ color: C.grigio }}
          >
            Bottega in San Frediano, Firenze · dal 1974
          </p>
        </div>
        <nav
          className={`${mono.className} px-6 md:px-12 flex items-center gap-6 md:gap-10 overflow-x-auto`}
          style={{ borderTop: `1px solid ${C.osso}14` }}
          aria-label="Indice delle sezioni"
        >
          {indice.map((v) => (
            <a
              key={v.href}
              href={v.href}
              className="py-3.5 text-[10px] uppercase tracking-[0.22em] whitespace-nowrap transition-colors cursor-pointer hover:text-white"
              style={{ color: C.grigio }}
            >
              <span style={{ color: C.legno }}>{v.n}</span>
              <span className="ml-2" style={{ color: "inherit" }}>
                {v.label}
              </span>
            </a>
          ))}
        </nav>
      </header>

      {/* ── Apertura: dichiarazione grande e leggera, con la quota di misura ── */}
      <section className="px-6 md:px-12 pt-24 md:pt-36 pb-20 md:pb-28">
        <div className="max-w-6xl">
          <Rivela>
            <p
              className={`${mono.className} text-[11px] uppercase tracking-[0.3em] mb-10`}
              style={{ color: C.legno }}
            >
              Falegnami da tre generazioni
            </p>
          </Rivela>
          <Rivela delay={0.1}>
            <h1 className="text-[2.6rem] leading-[1.12] md:text-7xl md:leading-[1.08] font-extralight tracking-tight max-w-4xl">
              Legno, misura,
              <br />
              pazienza.
              <br />
              <span style={{ color: C.grigio }}>
                Il resto lo mettono
                <br />
                le mani.
              </span>
            </h1>
          </Rivela>
          <Rivela delay={0.25} className="mt-14 max-w-md">
            <QuotaMisura etichetta="dal rilievo alla posa · 51 anni di banco" />
          </Rivela>
        </div>
        <Rivela delay={0.3}>
          <Venatura className="mt-16 md:mt-20 w-full h-32 md:h-44" />
        </Rivela>
      </section>

      {/* ── 01 · I lavori: righe full-bleed che si aprono come cassetti ── */}
      <section id="lavori" className="pb-24 md:pb-32 scroll-mt-4">
        <Rivela className="px-6 md:px-12 mb-10">
          <p className={`${mono.className} text-[11px] uppercase tracking-[0.3em]`}>
            <span style={{ color: C.legno }}>01</span>
            <span className="ml-3" style={{ color: C.grigio }}>
              Lavori scelti
            </span>
          </p>
        </Rivela>
        <div style={{ borderBottom: `1px solid ${C.osso}1F` }}>
          {lavori.map((lavoro, i) => (
            <RigaLavoro
              key={lavoro.numero}
              lavoro={lavoro}
              aperto={apertoIdx === i}
              onToggle={() => setApertoIdx(apertoIdx === i ? null : i)}
            />
          ))}
        </div>
        <p
          className={`${mono.className} px-6 md:px-12 mt-6 text-[10px] uppercase tracking-[0.2em]`}
          style={{ color: `${C.grigio}99` }}
        >
          Premi una riga per aprire la scheda del lavoro
        </p>
      </section>

      {/* ── 02 · Il mestiere: banda chiara, parole grandi ── */}
      <section
        id="mestiere"
        className="px-6 md:px-12 py-24 md:py-36 scroll-mt-4"
        style={{ backgroundColor: C.osso, color: C.nero }}
      >
        <div className="max-w-6xl mx-auto">
          <Rivela>
            <p className={`${mono.className} text-[11px] uppercase tracking-[0.3em] mb-12`}>
              <span style={{ color: C.legnoscuro }}>02</span>
              <span className="ml-3" style={{ color: `${C.nero}80` }}>
                Il mestiere
              </span>
            </p>
          </Rivela>
          <Rivela delay={0.1}>
            <p className="text-3xl md:text-5xl font-extralight leading-[1.25] tracking-tight max-w-4xl">
              Ogni tavola ha un verso. Il nostro lavoro è ascoltarlo prima di
              tagliare:{" "}
              <span style={{ color: C.legnoscuro }}>
                il legno che viene rispettato non si imbarca, non si fessura, non
                cambia idea.
              </span>
            </p>
          </Rivela>
          <div className="grid md:grid-cols-3 gap-10 md:gap-14 mt-16 md:mt-24">
            {[
              {
                voce: "Materiale",
                testo:
                  "Compriamo tavole, non pannelli. Le essenze stagionano nel nostro magazzino almeno due anni prima di salire sul banco.",
              },
              {
                voce: "Disegno",
                testo:
                  "Ogni lavoro parte da un rilievo fatto da noi e da una tavola quotata che firmi prima dell'avvio. Niente sorprese in corso d'opera.",
              },
              {
                voce: "Garanzia",
                testo:
                  "Dieci anni su struttura e movimenti. Se un'anta cala, torniamo a registrarla. È capitato due volte in cinquant'anni.",
              },
            ].map((b, i) => (
              <Rivela key={b.voce} delay={0.1 + i * 0.1}>
                <div className="pt-5" style={{ borderTop: `1px solid ${C.nero}33` }}>
                  <p
                    className={`${mono.className} text-[10px] uppercase tracking-[0.25em] mb-4`}
                    style={{ color: C.legnoscuro }}
                  >
                    {b.voce}
                  </p>
                  <p className="text-[15px] font-light leading-relaxed" style={{ color: `${C.nero}B3` }}>
                    {b.testo}
                  </p>
                </div>
              </Rivela>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 · Competenze: elenco a righe sottili ── */}
      <section id="competenze" className="px-6 md:px-12 py-24 md:py-32 scroll-mt-4">
        <div className="max-w-6xl mx-auto">
          <Rivela>
            <p className={`${mono.className} text-[11px] uppercase tracking-[0.3em] mb-12`}>
              <span style={{ color: C.legno }}>03</span>
              <span className="ml-3" style={{ color: C.grigio }}>
                Cosa facciamo
              </span>
            </p>
          </Rivela>
          <div>
            {competenze.map((c, i) => (
              <Rivela key={c.codice} delay={i * 0.08}>
                <div
                  className="py-7 md:py-8 grid md:grid-cols-[3rem_1fr_1.2fr] gap-2 md:gap-8 items-baseline"
                  style={{ borderTop: `1px solid ${C.osso}1F` }}
                >
                  <span className={`${mono.className} text-sm`} style={{ color: C.legno }}>
                    {c.codice}.
                  </span>
                  <h3 className="text-2xl md:text-3xl font-extralight tracking-tight">
                    {c.nome}
                  </h3>
                  <p className="text-sm font-light leading-relaxed" style={{ color: C.grigio }}>
                    {c.nota}
                  </p>
                </div>
              </Rivela>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 · Preventivo: modulo come scheda di capitolato ── */}
      <section
        id="preventivo"
        className="px-6 md:px-12 py-24 md:py-32 scroll-mt-4"
        style={{ backgroundColor: C.nerochiaro }}
      >
        <div className="max-w-3xl mx-auto">
          <Rivela>
            <p className={`${mono.className} text-[11px] uppercase tracking-[0.3em] mb-6`}>
              <span style={{ color: C.legno }}>04</span>
              <span className="ml-3" style={{ color: C.grigio }}>
                Richiedi un preventivo
              </span>
            </p>
            <h2 className="text-3xl md:text-5xl font-extralight tracking-tight leading-[1.15] mb-4">
              Compila la scheda,
              <br />
              ti rispondiamo con una quota.
            </h2>
            <p className="text-sm font-light leading-relaxed max-w-lg mb-12" style={{ color: C.grigio }}>
              Più dettagli ci dai, più il preventivo sarà preciso. Per i rilievi
              veniamo noi, senza impegno, in tutta la provincia di Firenze.
            </p>
          </Rivela>

          <Rivela delay={0.15}>
            {inviato ? (
              <div
                className="px-8 py-14 text-center"
                style={{ border: `1px solid ${C.legno}` }}
              >
                <p className={`${mono.className} text-[10px] uppercase tracking-[0.3em] mb-5`} style={{ color: C.legno }}>
                  Scheda ricevuta
                </p>
                <p className="text-2xl md:text-3xl font-extralight leading-snug">
                  Grazie. In bottega una richiesta così
                  <br className="hidden md:block" /> riceverebbe risposta entro due giorni.
                </p>
                <p className="mt-6 text-xs font-light" style={{ color: C.grigio }}>
                  Questa è una vetrina dimostrativa: nessun dato è stato inviato o salvato.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setInviato(true);
                }}
                style={{ border: `1px solid ${C.osso}26` }}
              >
                {/* riga A — nome */}
                <div className="grid md:grid-cols-[8rem_1fr]" style={{ borderBottom: `1px solid ${C.osso}26` }}>
                  <label
                    htmlFor="studio-nome"
                    className={`${mono.className} px-5 py-4 text-[10px] uppercase tracking-[0.2em] flex items-center`}
                    style={{ color: C.legno, borderRight: `1px solid ${C.osso}26` }}
                  >
                    A. Nome
                  </label>
                  <input
                    id="studio-nome"
                    type="text"
                    required
                    className="bg-transparent px-5 py-4 text-base font-light outline-none focus:bg-white/[0.04] transition-colors"
                    style={{ color: C.osso }}
                  />
                </div>
                {/* riga B — contatto */}
                <div className="grid md:grid-cols-[8rem_1fr]" style={{ borderBottom: `1px solid ${C.osso}26` }}>
                  <label
                    htmlFor="studio-contatto"
                    className={`${mono.className} px-5 py-4 text-[10px] uppercase tracking-[0.2em] flex items-center`}
                    style={{ color: C.legno, borderRight: `1px solid ${C.osso}26` }}
                  >
                    B. Telefono
                  </label>
                  <input
                    id="studio-contatto"
                    type="tel"
                    required
                    className="bg-transparent px-5 py-4 text-base font-light outline-none focus:bg-white/[0.04] transition-colors"
                    style={{ color: C.osso }}
                  />
                </div>
                {/* riga C — tipo di lavoro */}
                <fieldset className="grid md:grid-cols-[8rem_1fr]" style={{ borderBottom: `1px solid ${C.osso}26` }}>
                  <legend className="sr-only">Tipo di lavoro</legend>
                  <span
                    className={`${mono.className} px-5 py-4 text-[10px] uppercase tracking-[0.2em] flex items-center`}
                    style={{ color: C.legno, borderRight: `1px solid ${C.osso}26` }}
                    aria-hidden="true"
                  >
                    C. Lavoro
                  </span>
                  <div className="flex flex-wrap gap-2.5 px-5 py-4">
                    {tipiLavoro.map((t) => (
                      <label key={t} className="cursor-pointer">
                        <input
                          type="radio"
                          name="tipo-lavoro"
                          value={t}
                          checked={tipo === t}
                          onChange={() => setTipo(t)}
                          className="sr-only"
                        />
                        <span
                          className={`${mono.className} inline-block px-4 py-2 text-[10px] uppercase tracking-[0.18em] transition-colors`}
                          style={{
                            border: `1px solid ${tipo === t ? C.legno : `${C.osso}33`}`,
                            backgroundColor: tipo === t ? C.legno : "transparent",
                            color: tipo === t ? C.nero : C.grigio,
                          }}
                        >
                          {t}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                {/* riga D — descrizione */}
                <div className="grid md:grid-cols-[8rem_1fr]" style={{ borderBottom: `1px solid ${C.osso}26` }}>
                  <label
                    htmlFor="studio-descrizione"
                    className={`${mono.className} px-5 py-4 text-[10px] uppercase tracking-[0.2em] flex items-start pt-5`}
                    style={{ color: C.legno, borderRight: `1px solid ${C.osso}26` }}
                  >
                    D. Descrizione
                  </label>
                  <textarea
                    id="studio-descrizione"
                    rows={4}
                    required
                    placeholder="Misure indicative, ambiente, essenza preferita se ne hai una…"
                    className="bg-transparent px-5 py-4 text-base font-light outline-none resize-none focus:bg-white/[0.04] transition-colors placeholder:text-white/25"
                    style={{ color: C.osso }}
                  />
                </div>
                <button
                  type="submit"
                  className={`${mono.className} w-full px-5 py-5 text-[11px] uppercase tracking-[0.3em] font-medium transition-colors cursor-pointer flex items-center justify-center gap-4`}
                  style={{ backgroundColor: C.legno, color: C.nero }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.osso)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.legno)}
                >
                  Invia la scheda
                  <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true">
                    <path d="M0 5 H16 M12 1 L17 5 L12 9" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </button>
              </form>
            )}
            {!inviato && (
              <p className={`${mono.className} mt-4 text-[10px] tracking-[0.15em]`} style={{ color: `${C.grigio}99` }}>
                Modulo dimostrativo: non viene inviato nulla e nessun dato viene salvato.
              </p>
            )}
          </Rivela>
        </div>
      </section>

      {/* ── Piè di pagina: cartiglio finale ── */}
      <footer className="px-6 md:px-12 py-14" style={{ borderTop: `1px solid ${C.osso}1F` }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="text-sm font-light uppercase tracking-[0.45em] mb-4">
              Falegnameria Marini
            </p>
            <p className={`${mono.className} text-[10px] uppercase tracking-[0.2em] leading-loose`} style={{ color: C.grigio }}>
              Via dell&apos;Orto 27, Firenze · 055 22 0000
              <br />
              Dal lunedì al venerdì, 7:30 – 17:30
            </p>
          </div>
          <p className={`${mono.className} text-[10px] tracking-[0.15em]`} style={{ color: `${C.grigio}99` }}>
            Vetrina dimostrativa · attività di fantasia
          </p>
        </div>
      </footer>
    </div>
  );
}
