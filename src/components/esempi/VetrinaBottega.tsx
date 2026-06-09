"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Cormorant_Garamond, Mulish } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});
const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

// Palette della bottega — perla, salvia, rosso fiore, verde bosco
const C = {
  perla: "#F7F5F0",
  avorio: "#FDFCF8",
  salvia: "#7C8B6F",
  rosso: "#C94F4F",
  bosco: "#2F3A2C",
  terra: "#8A7B6A",
};

type Fiore = {
  nome: string;
  nota: string;
  prezzo: string;
  petali: string;
  cuore: string;
  stelo: string;
};

const banco: Fiore[] = [
  {
    nome: "Mazzo del mattino",
    nota: "fiori di stagione, carta avana e spago",
    prezzo: "18",
    petali: "#C94F4F",
    cuore: "#E8B04B",
    stelo: "#7C8B6F",
  },
  {
    nome: "Peonie di maggio",
    nota: "rosa cipria, sei steli abbondanti",
    prezzo: "25",
    petali: "#E5A3A3",
    cuore: "#C94F4F",
    stelo: "#8B9B7E",
  },
  {
    nome: "Rose antiche",
    nota: "color crema, profumo di giardino",
    prezzo: "22",
    petali: "#EFE3CC",
    cuore: "#D9B36A",
    stelo: "#7C8B6F",
  },
  {
    nome: "Ranuncoli e salvia",
    nota: "rosso acceso e foglia argentata",
    prezzo: "20",
    petali: "#B5443F",
    cuore: "#7A2E2B",
    stelo: "#9AA88B",
  },
  {
    nome: "Orchidea in vaso",
    nota: "bianco latte, vaso di coccio",
    prezzo: "32",
    petali: "#F4F0E6",
    cuore: "#C9A0C4",
    stelo: "#5F6E54",
  },
  {
    nome: "Lavanda di campo",
    nota: "mazzetto essiccato, dura mesi",
    prezzo: "9",
    petali: "#9B8AB8",
    cuore: "#6E5E91",
    stelo: "#8B9B7E",
  },
];

const storia = [
  {
    anno: "1962",
    titolo: "Nonna Iole apre la bottega",
    testo:
      "Un bancone di marmo, due secchi di zinco e i gladioli del mercato di Porta Portese. Il quartiere imparò presto che da Iole i fiori duravano una settimana in più.",
  },
  {
    anno: "1989",
    titolo: "Arrivano le piante da appartamento",
    testo:
      "Marco, il figlio, riempie la vetrina di felci e fichi d'India. I clienti entrano per un mazzo ed escono con un vaso sottobraccio.",
  },
  {
    anno: "2014",
    titolo: "Chiara e i matrimoni",
    testo:
      "La nipote porta le composizioni fuori dalla bottega: prima i matrimoni degli amici, poi quelli degli sconosciuti. Trastevere si riempie dei nostri archi di fiori.",
  },
  {
    anno: "Oggi",
    titolo: "Tre generazioni dietro al banco",
    testo:
      "Iole sceglie ancora i colori, Marco tiene i conti, Chiara lega i mazzi. Il bancone di marmo è sempre lo stesso del 1962.",
  },
];

const orari = [
  { giorni: "Lunedì", ore: "riposo" },
  { giorni: "Da martedì a sabato", ore: "8:00 – 13:00 · 15:30 – 19:30" },
  { giorni: "Domenica", ore: "8:00 – 13:00" },
];

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
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease, delay }}
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

/** Tratto di linea che si disegna da solo quando entra in vista. */
function LineaTracciata({
  d,
  viewBox,
  className = "",
  colore = C.salvia,
  spessore = 1.5,
  tratteggio = false,
  durata = 1.6,
}: {
  d: string;
  viewBox: string;
  className?: string;
  colore?: string;
  spessore?: number;
  tratteggio?: boolean;
  durata?: number;
}) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <motion.path
        d={d}
        stroke={colore}
        strokeWidth={spessore}
        strokeLinecap="round"
        strokeDasharray={tratteggio ? "1 7" : undefined}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: durata, ease }}
        viewport={{ once: true, margin: "-60px" }}
      />
    </svg>
  );
}

/** Fiore stilizzato a cinque petali — niente foto, solo forme. */
function FioreDisegnato({ f, size = 96 }: { f: Fiore; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
    >
      {/* stelo */}
      <path
        d="M48 52 C46 66 50 78 47 92"
        stroke={f.stelo}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* foglia */}
      <path
        d="M47.5 70 C38 66 34 58 35 52 C43 54 48 61 47.5 70 Z"
        fill={f.stelo}
        opacity="0.85"
      />
      {/* petali */}
      {[0, 72, 144, 216, 288].map((rot) => (
        <ellipse
          key={rot}
          cx="48"
          cy="26"
          rx="11"
          ry="17"
          fill={f.petali}
          transform={`rotate(${rot} 48 40)`}
        />
      ))}
      {/* cuore del fiore */}
      <circle cx="48" cy="40" r="8" fill={f.cuore} />
    </svg>
  );
}

/** Cartellino da fioraio appeso al filo, leggermente storto. */
function Cartellino({ f, indice }: { f: Fiore; indice: number }) {
  const inclinazione = indice % 3 === 0 ? -2.2 : indice % 3 === 1 ? 1.6 : -1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: inclinazione - 4 }}
      whileInView={{ opacity: 1, y: 0, rotate: inclinazione }}
      transition={{ duration: 0.9, ease, delay: (indice % 3) * 0.12 }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ rotate: 0, y: -4 }}
      className="flex flex-col items-center"
    >
      {/* filo */}
      <svg width="60" height="34" viewBox="0 0 60 34" fill="none" aria-hidden="true">
        <path
          d="M2 2 C18 26 42 26 58 4 M30 18 L30 33"
          stroke={C.terra}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
      {/* cartellino */}
      <div
        className="w-full px-7 pt-6 pb-7 flex flex-col items-center text-center relative"
        style={{
          backgroundColor: C.avorio,
          border: `1px solid ${C.bosco}1A`,
          boxShadow: "0 18px 36px -18px rgba(47,58,44,0.28)",
          borderRadius: "3px 3px 10px 10px",
        }}
      >
        {/* foro del cartellino */}
        <span
          className="absolute top-2.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: C.perla, boxShadow: `inset 0 0 0 1.5px ${C.terra}66` }}
          aria-hidden="true"
        />
        <FioreDisegnato f={f} />
        <h3
          className="mt-4 text-2xl leading-tight"
          style={{ fontFamily: "inherit", color: C.bosco, fontWeight: 600 }}
        >
          {f.nome}
        </h3>
        <p
          className={`${mulish.className} mt-1.5 text-[13px] leading-relaxed`}
          style={{ color: C.terra }}
        >
          {f.nota}
        </p>
        <p
          className="mt-4 text-xl italic"
          style={{ color: C.rosso, fontWeight: 500 }}
        >
          {f.prezzo} €
        </p>
      </div>
    </motion.div>
  );
}

/** Insegna circolare con scritta che gira piano. */
function InsegnaRotonda() {
  const riduci = useReducedMotion();
  return (
    <div className="relative w-[150px] h-[150px] md:w-[176px] md:h-[176px]">
      {/* anelli fissi dell'insegna */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="48.5" stroke={C.bosco} strokeWidth="0.7" fill="none" opacity="0.45" />
        <circle cx="50" cy="50" r="28" stroke={C.bosco} strokeWidth="0.5" fill="none" opacity="0.3" />
      </svg>
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        animate={riduci ? undefined : { rotate: 360 }}
        transition={
          riduci ? undefined : { duration: 40, repeat: Infinity, ease: "linear" }
        }
        aria-hidden="true"
      >
        <defs>
          <path
            id="cerchio-insegna"
            d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
          />
        </defs>
        {/* nome e anno in due semicerchi ancorati: il testo non si taglia mai */}
        <text className={mulish.className} style={{ fill: C.bosco, fontWeight: 600 }}>
          <textPath
            href="#cerchio-insegna"
            startOffset="0%"
            style={{ fontSize: "7px", letterSpacing: "0.14em" }}
          >
            · FIORI DI TRASTEVERE
          </textPath>
          <textPath
            href="#cerchio-insegna"
            startOffset="50%"
            style={{ fontSize: "7px", letterSpacing: "0.26em" }}
          >
            · BOTTEGA DAL 1962
          </textPath>
        </text>
      </motion.svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="44" height="44" viewBox="0 0 96 96" fill="none" aria-hidden="true">
          {[0, 72, 144, 216, 288].map((rot) => (
            <ellipse
              key={rot}
              cx="48"
              cy="32"
              rx="12"
              ry="19"
              fill={C.rosso}
              transform={`rotate(${rot} 48 48)`}
            />
          ))}
          <circle cx="48" cy="48" r="9" fill={C.bosco} />
        </svg>
      </div>
    </div>
  );
}

/** Mappa disegnata a mano del vicolo, col fiume e il segnaposto. */
function MappaDisegnata() {
  return (
    <svg
      viewBox="0 0 360 280"
      fill="none"
      className="w-full h-auto"
      role="img"
      aria-label="Mappa stilizzata: la bottega si trova in Vicolo del Cinque, vicino al Tevere"
    >
      <rect width="360" height="280" rx="6" fill={C.avorio} />
      {/* Tevere */}
      <path
        d="M310 -10 C 280 60, 320 120, 285 190 C 265 230, 280 260, 270 290"
        stroke={C.salvia}
        strokeWidth="26"
        opacity="0.35"
        strokeLinecap="round"
      />
      <text
        x="296"
        y="120"
        fontSize="11"
        fill={C.bosco}
        opacity="0.6"
        fontStyle="italic"
        transform="rotate(78 296 120)"
        style={{ fontFamily: "inherit" }}
      >
        il Tevere
      </text>
      {/* strade */}
      {[
        "M-10 70 C 80 80, 180 60, 270 80",
        "M-10 150 C 90 140, 190 160, 268 150",
        "M-10 225 C 100 230, 200 215, 262 228",
        "M70 -10 C 80 90, 60 190, 75 290",
        "M170 -10 C 160 100, 180 180, 165 290",
      ].map((d, i) => (
        <path key={i} d={d} stroke={C.terra} strokeWidth="1.4" opacity="0.4" />
      ))}
      {/* piazza */}
      <rect x="96" y="96" width="46" height="38" rx="3" fill={C.salvia} opacity="0.25" />
      <text x="100" y="118" fontSize="9.5" fill={C.bosco} opacity="0.65" style={{ fontFamily: "inherit", fontStyle: "italic" }}>
        la piazzetta
      </text>
      {/* segnaposto della bottega */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease, delay: 0.5 }}
        viewport={{ once: true }}
        style={{ transformOrigin: "218px 152px" }}
      >
        {[0, 72, 144, 216, 288].map((rot) => (
          <ellipse
            key={rot}
            cx="218"
            cy="143"
            rx="6"
            ry="10"
            fill={C.rosso}
            transform={`rotate(${rot} 218 152)`}
          />
        ))}
        <circle cx="218" cy="152" r="4.5" fill={C.bosco} />
      </motion.g>
      <text x="206" y="186" fontSize="11" fill={C.bosco} fontWeight="600" style={{ fontFamily: "inherit" }}>
        siamo qui
      </text>
    </svg>
  );
}

export default function VetrinaBottega() {
  const [inviato, setInviato] = useState(false);
  const [nome, setNome] = useState("");
  const [occasione, setOccasione] = useState("");

  const occasioni = ["Un compleanno", "Un anniversario", "Per chiedere scusa", "Così, senza motivo"];

  return (
    <div
      className={cormorant.className}
      style={{ backgroundColor: C.perla, color: C.bosco }}
    >
      {/* ── Insegna: niente barra, un timpano centrato come sulla porta della bottega ── */}
      <header className="px-6 pt-12 pb-4 flex flex-col items-center text-center">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 items-center gap-6">
          <p
            className={`${mulish.className} hidden md:block text-[11px] uppercase tracking-[0.28em] text-left`}
            style={{ color: C.terra }}
          >
            Bottega di fiori
            <br />
            in Trastevere
          </p>
          <div className="flex justify-center">
            <InsegnaRotonda />
          </div>
          <p
            className={`${mulish.className} hidden md:block text-[11px] uppercase tracking-[0.28em] text-right`}
            style={{ color: C.terra }}
          >
            Vicolo del Cinque 12
            <br />
            Roma
          </p>
        </div>
        <nav
          className={`${mulish.className} mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.22em]`}
          aria-label="Navigazione Fiori di Trastevere"
        >
          {[
            { href: "#banco", label: "Il banco" },
            { href: "#storia", label: "La storia" },
            { href: "#orari", label: "Orari" },
            { href: "#dove", label: "Dove siamo" },
            { href: "#ordina", label: "Ordina un mazzo" },
          ].map((v, i, arr) => (
            <span key={v.href} className="flex items-center gap-5">
              <a
                href={v.href}
                className="transition-colors cursor-pointer hover:opacity-100"
                style={{ color: i === arr.length - 1 ? C.rosso : C.bosco }}
              >
                {v.label}
              </a>
              {i < arr.length - 1 && (
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: C.salvia }}
                  aria-hidden="true"
                />
              )}
            </span>
          ))}
        </nav>
      </header>

      {/* ── Apertura: titolo serif arioso con lo stelo che si disegna ── */}
      <section className="px-6 pt-16 pb-24 md:pt-24 md:pb-32 text-center relative overflow-hidden">
        <Rivela>
          <h1
            className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.02] max-w-3xl mx-auto"
            style={{ fontWeight: 500 }}
          >
            Fiori freschi,
            <br />
            <em style={{ color: C.salvia }}>parole gentili.</em>
          </h1>
        </Rivela>
        <Rivela delay={0.2}>
          <p
            className={`${mulish.className} mt-8 text-[15px] md:text-base leading-relaxed max-w-xl mx-auto`}
            style={{ color: C.terra }}
          >
            Dal 1962 leghiamo mazzi dietro lo stesso bancone di marmo. Entra,
            dicci per chi sono, e al resto pensiamo noi.
          </p>
        </Rivela>
        {/* stelo disegnato che scende verso il banco */}
        <LineaTracciata
          d="M100 0 C 92 60, 112 110, 98 170 C 88 215, 104 260, 100 300"
          viewBox="0 0 200 300"
          className="mx-auto mt-10 h-40 md:h-52 w-auto"
          tratteggio
          durata={2}
        />
      </section>

      {/* ── Il banco: cartellini appesi al filo ── */}
      <section id="banco" className="px-6 pb-28 md:pb-36 scroll-mt-8">
        <div className="max-w-5xl mx-auto">
          <Rivela className="text-center mb-4">
            <p
              className={`${mulish.className} text-[11px] uppercase tracking-[0.3em] mb-3`}
              style={{ color: C.rosso }}
            >
              Il banco di oggi
            </p>
            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 500 }}>
              Ogni mazzo ha il suo cartellino
            </h2>
            <p
              className={`${mulish.className} mt-4 text-sm max-w-lg mx-auto leading-relaxed`}
              style={{ color: C.terra }}
            >
              Prezzi scritti a mano, come si è sempre fatto. Quello che vedi al
              banco cambia con le stagioni e con l&apos;umore di Iole.
            </p>
          </Rivela>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 mt-12">
            {banco.map((f, i) => (
              <Cartellino key={f.nome} f={f} indice={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── La storia: una linea che scende e quattro tappe ── */}
      <section
        id="storia"
        className="px-6 py-28 md:py-36 scroll-mt-8"
        style={{ backgroundColor: C.avorio }}
      >
        <div className="max-w-3xl mx-auto">
          <Rivela className="text-center mb-16">
            <p
              className={`${mulish.className} text-[11px] uppercase tracking-[0.3em] mb-3`}
              style={{ color: C.rosso }}
            >
              La storia
            </p>
            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 500 }}>
              Tre generazioni, un bancone
            </h2>
          </Rivela>

          <div className="relative">
            {/* linea verticale che si disegna */}
            <LineaTracciata
              d="M20 0 C 14 120, 26 240, 18 360 C 12 480, 24 600, 20 720"
              viewBox="0 0 40 720"
              className="absolute left-[7px] md:left-1/2 md:-translate-x-1/2 top-0 h-full w-10"
              durata={2.4}
            />
            <div className="flex flex-col gap-16 md:gap-20">
              {storia.map((tappa, i) => (
                <Rivela
                  key={tappa.anno}
                  delay={0.1}
                  className={`relative pl-14 md:pl-0 md:w-[calc(50%-3rem)] ${
                    i % 2 === 0 ? "md:mr-auto md:text-right" : "md:ml-auto"
                  }`}
                >
                  {/* bocciolo sulla linea */}
                  <span
                    className="absolute left-[10px] md:left-auto top-2 w-4 h-4 rounded-full -translate-x-1/2"
                    style={{
                      backgroundColor: i === storia.length - 1 ? C.rosso : C.salvia,
                      boxShadow: `0 0 0 5px ${C.avorio}`,
                      ...(i % 2 === 0
                        ? { right: "calc(-3rem - 13px)" }
                        : { left: "calc(-3rem - 7px)" }),
                    }}
                    aria-hidden="true"
                  />
                  <p
                    className="text-5xl md:text-6xl italic leading-none"
                    style={{ color: C.salvia, fontWeight: 400 }}
                  >
                    {tappa.anno}
                  </p>
                  <h3 className="mt-3 text-2xl" style={{ fontWeight: 600 }}>
                    {tappa.titolo}
                  </h3>
                  <p
                    className={`${mulish.className} mt-2.5 text-sm leading-relaxed`}
                    style={{ color: C.terra }}
                  >
                    {tappa.testo}
                  </p>
                </Rivela>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Orari e dove siamo: il cartello sulla porta e la mappa ── */}
      <section className="px-6 py-28 md:py-32">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-14 md:gap-20 items-center">
          <div id="orari" className="scroll-mt-12">
            <Rivela>
              <p
                className={`${mulish.className} text-[11px] uppercase tracking-[0.3em] mb-3`}
                style={{ color: C.rosso }}
              >
                Orari
              </p>
              <h2 className="text-4xl md:text-5xl mb-8" style={{ fontWeight: 500 }}>
                Quando trovarci
              </h2>
              <div
                className="px-8 py-8"
                style={{
                  backgroundColor: C.avorio,
                  border: `1px solid ${C.bosco}1A`,
                  borderRadius: "4px",
                  boxShadow: "0 20px 40px -24px rgba(47,58,44,0.3)",
                }}
              >
                {orari.map((riga, i) => (
                  <div
                    key={riga.giorni}
                    className="flex items-baseline justify-between gap-4 py-3.5"
                    style={{
                      borderBottom:
                        i < orari.length - 1 ? `1px dashed ${C.terra}55` : "none",
                    }}
                  >
                    <span className="text-xl" style={{ fontWeight: 600 }}>
                      {riga.giorni}
                    </span>
                    <span
                      className={
                        riga.ore === "riposo"
                          ? "text-lg italic"
                          : `${mulish.className} text-[13px]`
                      }
                      style={{ color: riga.ore === "riposo" ? C.rosso : C.terra }}
                    >
                      {riga.ore}
                    </span>
                  </div>
                ))}
                <p
                  className={`${mulish.className} mt-5 text-xs leading-relaxed`}
                  style={{ color: C.terra }}
                >
                  La mattina presto trovi i fiori appena arrivati dal mercato. Se
                  il mazzo ti serve per cena, passa entro le 19.
                </p>
              </div>
            </Rivela>
          </div>
          <div id="dove" className="scroll-mt-12">
            <Rivela delay={0.15}>
              <p
                className={`${mulish.className} text-[11px] uppercase tracking-[0.3em] mb-3`}
                style={{ color: C.rosso }}
              >
                Dove siamo
              </p>
              <h2 className="text-4xl md:text-5xl mb-8" style={{ fontWeight: 500 }}>
                Nel cuore di Trastevere
              </h2>
              <div
                className="p-3"
                style={{
                  backgroundColor: C.avorio,
                  border: `1px solid ${C.bosco}1A`,
                  borderRadius: "4px",
                  boxShadow: "0 20px 40px -24px rgba(47,58,44,0.3)",
                }}
              >
                <MappaDisegnata />
              </div>
              <p
                className={`${mulish.className} mt-4 text-sm leading-relaxed`}
                style={{ color: C.terra }}
              >
                <strong style={{ color: C.bosco }}>Vicolo del Cinque 12, Roma</strong>, a
                due passi da piazza Trilussa. Telefono:{" "}
                <span style={{ color: C.bosco }}>06 580 0000</span>
              </p>
            </Rivela>
          </div>
        </div>
      </section>

      {/* ── Ordina: il bigliettino da accompagnamento ── */}
      <section id="ordina" className="px-6 pb-32 scroll-mt-8">
        <div className="max-w-xl mx-auto">
          <Rivela className="text-center mb-10">
            <p
              className={`${mulish.className} text-[11px] uppercase tracking-[0.3em] mb-3`}
              style={{ color: C.rosso }}
            >
              Ordina un mazzo
            </p>
            <h2 className="text-4xl md:text-5xl" style={{ fontWeight: 500 }}>
              Scrivi il bigliettino,
              <br />
              <em style={{ color: C.salvia }}>ai fiori pensiamo noi</em>
            </h2>
          </Rivela>

          <Rivela delay={0.15}>
            {inviato ? (
              <div
                className="px-10 py-14 text-center"
                style={{
                  backgroundColor: C.avorio,
                  border: `1.5px solid ${C.salvia}`,
                  borderRadius: "4px",
                }}
              >
                <FioreDisegnato f={banco[0]} size={72} />
                <p className="text-3xl italic mt-4" style={{ fontWeight: 500 }}>
                  Grazie{nome ? `, ${nome}` : ""}.
                </p>
                <p
                  className={`${mulish.className} mt-3 text-sm leading-relaxed`}
                  style={{ color: C.terra }}
                >
                  In una bottega vera il mazzo sarebbe già sul bancone. Questa è
                  una vetrina dimostrativa: nessun fiore è stato colto.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setInviato(true);
                }}
                className="px-8 py-9 md:px-10 relative"
                style={{
                  backgroundColor: C.avorio,
                  border: `1px solid ${C.bosco}1A`,
                  borderRadius: "4px",
                  boxShadow: "0 24px 48px -24px rgba(47,58,44,0.3)",
                }}
              >
                {/* angolo piegato del bigliettino */}
                <span
                  className="absolute top-0 right-0 w-0 h-0"
                  style={{
                    borderTop: `26px solid ${C.perla}`,
                    borderLeft: "26px solid transparent",
                  }}
                  aria-hidden="true"
                />
                <p
                  className="text-2xl italic mb-7"
                  style={{ color: C.salvia, fontWeight: 500 }}
                >
                  Per chi sono questi fiori?
                </p>

                <div className="flex flex-col gap-6">
                  <div>
                    <label
                      htmlFor="bottega-nome"
                      className={`${mulish.className} block text-[11px] uppercase tracking-[0.22em] mb-2`}
                      style={{ color: C.terra }}
                    >
                      Il tuo nome
                    </label>
                    <input
                      id="bottega-nome"
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className={`${mulish.className} w-full bg-transparent text-[15px] py-2 outline-none transition-colors`}
                      style={{
                        borderBottom: `1.5px solid ${C.terra}66`,
                        color: C.bosco,
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderBottomColor = C.salvia)}
                      onBlur={(e) => (e.currentTarget.style.borderBottomColor = `${C.terra}66`)}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="bottega-telefono"
                      className={`${mulish.className} block text-[11px] uppercase tracking-[0.22em] mb-2`}
                      style={{ color: C.terra }}
                    >
                      Telefono
                    </label>
                    <input
                      id="bottega-telefono"
                      type="tel"
                      required
                      className={`${mulish.className} w-full bg-transparent text-[15px] py-2 outline-none transition-colors`}
                      style={{
                        borderBottom: `1.5px solid ${C.terra}66`,
                        color: C.bosco,
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderBottomColor = C.salvia)}
                      onBlur={(e) => (e.currentTarget.style.borderBottomColor = `${C.terra}66`)}
                    />
                  </div>
                  <fieldset>
                    <legend
                      className={`${mulish.className} text-[11px] uppercase tracking-[0.22em] mb-3`}
                      style={{ color: C.terra }}
                    >
                      L&apos;occasione
                    </legend>
                    <div className="flex flex-wrap gap-x-6 gap-y-2.5">
                      {occasioni.map((o) => (
                        <label
                          key={o}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="occasione"
                            value={o}
                            checked={occasione === o}
                            onChange={() => setOccasione(o)}
                            className="sr-only"
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full transition-all shrink-0"
                            style={{
                              border: `1.5px solid ${occasione === o ? C.rosso : C.terra}`,
                              backgroundColor: occasione === o ? C.rosso : "transparent",
                              boxShadow: occasione === o ? `inset 0 0 0 2.5px ${C.avorio}` : "none",
                            }}
                            aria-hidden="true"
                          />
                          <span className="text-lg italic" style={{ fontWeight: 500 }}>
                            {o}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <div>
                    <label
                      htmlFor="bottega-messaggio"
                      className={`${mulish.className} block text-[11px] uppercase tracking-[0.22em] mb-2`}
                      style={{ color: C.terra }}
                    >
                      Cosa scriviamo sul bigliettino
                    </label>
                    <textarea
                      id="bottega-messaggio"
                      rows={3}
                      placeholder="«Per Anna, che riempie le stanze anche quando non c'è.»"
                      className="w-full bg-transparent text-xl italic py-2 outline-none resize-none transition-colors placeholder:opacity-50"
                      style={{
                        borderBottom: `1.5px solid ${C.terra}66`,
                        color: C.bosco,
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderBottomColor = C.salvia)}
                      onBlur={(e) => (e.currentTarget.style.borderBottomColor = `${C.terra}66`)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`${mulish.className} mt-8 w-full py-4 text-[12px] uppercase tracking-[0.28em] font-bold transition-colors cursor-pointer`}
                  style={{ backgroundColor: C.bosco, color: C.perla, borderRadius: "3px" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = C.rosso)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = C.bosco)}
                >
                  Prenota il mazzo
                </button>
                <p
                  className={`${mulish.className} mt-4 text-[11px] text-center leading-relaxed`}
                  style={{ color: C.terra }}
                >
                  Modulo dimostrativo: non viene inviato nulla, nessun dato viene
                  salvato.
                </p>
              </form>
            )}
          </Rivela>
        </div>
      </section>

      {/* ── Chiusura scura, come la bottega quando tira giù la serranda ── */}
      <section
        className="px-6 py-28 md:py-36 text-center"
        style={{ backgroundColor: C.bosco, color: C.perla }}
      >
        <Rivela>
          <LineaTracciata
            d="M10 30 C 60 6, 140 6, 190 30"
            viewBox="0 0 200 36"
            className="mx-auto w-40 h-8 mb-10"
            colore={C.salvia}
            tratteggio
          />
          <h2
            className="text-4xl md:text-6xl leading-[1.08] max-w-2xl mx-auto"
            style={{ fontWeight: 500 }}
          >
            I fiori giusti esistono.
            <br />
            <em style={{ color: "#A9B89B" }}>Basta chiederli a chi li conosce.</em>
          </h2>
          <p
            className={`${mulish.className} mt-9 text-[12px] uppercase tracking-[0.26em]`}
            style={{ color: `${C.perla}99` }}
          >
            Vicolo del Cinque 12, Roma · 06 580 0000
          </p>
          <p
            className={`${mulish.className} mt-10 text-[11px]`}
            style={{ color: `${C.perla}59` }}
          >
            Fiori di Trastevere è una vetrina dimostrativa · attività di fantasia
          </p>
        </Rivela>
      </section>
    </div>
  );
}
