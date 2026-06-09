"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Anton, Karla } from "next/font/google";

const anton = Anton({ subsets: ["latin"], weight: "400", display: "swap" });
const karla = Karla({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

// Palette dell'osteria — carta, inchiostro, arancio acceso
const C = {
  crema: "#FAF2E2",
  carta: "#FFFDF4",
  arancio: "#D8501C",
  marrone: "#2E1F14",
  giallo: "#E8B04B",
};

const menu = {
  Antipasti: [
    { nome: "Supplì al telefono", prezzo: "3,50" },
    { nome: "Carciofo alla romana", prezzo: "6" },
    { nome: "Fiori di zucca ripieni", prezzo: "5" },
  ],
  Primi: [
    { nome: "Cacio e pepe", prezzo: "12" },
    { nome: "Carbonara", prezzo: "13" },
    { nome: "Amatriciana", prezzo: "12" },
    { nome: "Gricia", prezzo: "12" },
  ],
  Secondi: [
    { nome: "Saltimbocca alla romana", prezzo: "16" },
    { nome: "Polpette al sugo della nonna", prezzo: "14" },
    { nome: "Puntarelle e alici", prezzo: "8" },
  ],
  Dolci: [
    { nome: "Tiramisù della casa", prezzo: "6" },
    { nome: "Maritozzo con la panna", prezzo: "5" },
  ],
};

const piattiMarquee = [
  "cacio e pepe",
  "carbonara",
  "amatriciana",
  "gricia",
  "supplì",
  "carciofi",
  "saltimbocca",
  "maritozzo",
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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease, delay }}
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

/** Piatto di cacio e pepe disegnato — niente foto, solo gradienti. */
function PiattoStilizzato({ size = "100%" }: { size?: string }) {
  return (
    <div className="relative aspect-square" style={{ width: size }}>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 30%, #FFFDF7 0%, #F1E6CE 70%)",
          boxShadow: "0 30px 60px -20px rgba(46,31,20,0.4)",
        }}
      />
      <div
        className="absolute inset-[7%] rounded-full"
        style={{ border: `2px solid ${C.marrone}15` }}
      />
      <div
        className="absolute inset-[18%] rounded-full"
        style={{
          background: `radial-gradient(circle at 40% 35%, ${C.giallo} 0%, #D89B33 55%, #B97F23 100%)`,
        }}
      />
      <div className="absolute inset-[18%] rounded-full overflow-hidden">
        {[
          { top: "22%", left: "30%", s: 7, c: "#FFF8E8" },
          { top: "40%", left: "60%", s: 9, c: "#FFF8E8" },
          { top: "60%", left: "35%", s: 6, c: "#FFF8E8" },
          { top: "30%", left: "70%", s: 4, c: C.marrone },
          { top: "55%", left: "55%", s: 4, c: C.marrone },
          { top: "70%", left: "62%", s: 3, c: C.marrone },
          { top: "45%", left: "25%", s: 3, c: C.marrone },
        ].map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{ top: p.top, left: p.left, width: p.s, height: p.s, backgroundColor: p.c }}
          />
        ))}
      </div>
    </div>
  );
}

/** Mappa stilizzata, incorniciata come cartolina. */
function MappaStilizzata() {
  return (
    <svg
      viewBox="0 0 400 280"
      className="w-full h-auto block"
      style={{ backgroundColor: "#F1E6CE" }}
      role="img"
      aria-label="Mappa stilizzata: il vicolo dietro la piazza"
    >
      <path d="M0 80 L400 60" stroke="#E0D2B4" strokeWidth="22" fill="none" />
      <path d="M120 0 L150 280" stroke="#E0D2B4" strokeWidth="18" fill="none" />
      <path d="M0 200 L400 220" stroke="#E0D2B4" strokeWidth="26" fill="none" />
      <path d="M290 0 L270 280" stroke="#E0D2B4" strokeWidth="14" fill="none" />
      <ellipse cx="210" cy="140" rx="46" ry="34" fill="#E8DBBE" />
      <g transform="translate(210 110)">
        <path
          d="M0 34 C-16 14 -18 4 -18 -4 a18 18 0 1 1 36 0 c0 8 -2 18 -18 38 Z"
          fill={C.arancio}
        />
        <circle cx="0" cy="-4" r="7" fill={C.crema} />
      </g>
      <text
        x="210"
        y="195"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontSize="15"
        fill={C.marrone}
      >
        il vicolo dietro la piazza
      </text>
    </svg>
  );
}

/** Polaroid con didascalia, ruotata a mano. */
function Polaroid({
  sfondo,
  didascalia,
  rotazione,
  className = "",
}: {
  sfondo: string;
  didascalia: string;
  rotazione: number;
  className?: string;
}) {
  return (
    <motion.figure
      className={`bg-white p-3 pb-4 w-56 sm:w-64 shrink-0 ${className}`}
      style={{
        rotate: rotazione,
        boxShadow: "0 18px 40px -14px rgba(46,31,20,0.45)",
      }}
      whileHover={{ rotate: 0, scale: 1.04, zIndex: 10 }}
      transition={{ duration: 0.35, ease }}
    >
      <div className="aspect-square" style={{ background: sfondo }} />
      <figcaption
        className="pt-3 text-center text-sm"
        style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: C.marrone }}
      >
        {didascalia}
      </figcaption>
    </motion.figure>
  );
}

export default function VetrinaRistorante() {
  const [inviato, setInviato] = useState(false);

  return (
    <div
      className={karla.className}
      style={{ backgroundColor: C.crema, color: C.marrone }}
    >
      {/* keyframes del nastro che scorre */}
      <style>{`
        @keyframes osteria-nastro {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .osteria-nastro { animation: osteria-nastro 28s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .osteria-nastro { animation: none; }
        }
      `}</style>

      {/* Striscia informazioni, come l'intestazione di un menù */}
      <div
        className="px-6 py-2 text-center text-xs tracking-wide"
        style={{ backgroundColor: C.marrone, color: `${C.crema}CC` }}
      >
        Vicolo del Forno Vecchio, Roma · aperti dal martedì alla domenica ·{" "}
        <a href="#prenota" className="underline underline-offset-2" data-cursor="pointer">
          prenota un tavolo
        </a>
      </div>

      {/* Carta intestata */}
      <header className="px-6 pt-14 pb-6 text-center relative overflow-hidden">
        <motion.p
          className="text-xs font-bold uppercase tracking-[0.4em] mb-4"
          style={{ color: C.arancio }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          ✦ Trattoria romana ✦
        </motion.p>
        <motion.h1
          className={`${anton.className} uppercase leading-[0.88] text-[clamp(64px,13vw,170px)] select-none`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
        >
          La pasta
          <br />
          <span className="relative inline-block">
            come Dio
            {/* piatto che sbuca tra le righe */}
            <span className="absolute -right-16 sm:-right-28 top-1/2 -translate-y-1/2 w-24 sm:w-40 rotate-12 pointer-events-none hidden min-[420px]:block">
              <PiattoStilizzato />
            </span>
          </span>
          <br />
          <span style={{ color: C.arancio }}>comanda.</span>
        </motion.h1>

        {/* timbro */}
        <motion.div
          className="absolute left-[6%] bottom-[12%] hidden md:block pointer-events-none select-none"
          initial={{ opacity: 0, scale: 1.6, rotate: -24 }}
          animate={{ opacity: 1, scale: 1, rotate: -12 }}
          transition={{ duration: 0.5, delay: 0.7, ease: "backOut" }}
          aria-hidden="true"
        >
          <span
            className={`${anton.className} block uppercase text-sm px-4 py-2 tracking-[0.2em]`}
            style={{
              border: `3px solid ${C.arancio}`,
              color: C.arancio,
              borderRadius: 4,
              maskImage:
                "radial-gradient(circle at 30% 40%, black 60%, transparent 61%), radial-gradient(circle at 70% 60%, black 64%, transparent 65%), linear-gradient(black, black)",
            }}
          >
            dal 1962 · Roma
          </span>
        </motion.div>

        <motion.p
          className="mt-8 text-base max-w-md mx-auto leading-relaxed"
          style={{ color: `${C.marrone}B3` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Tre tavoli fuori, dodici dentro, una cucina che non ha mai avuto
          fretta. Da tre generazioni, nel vicolo dietro la piazza.
        </motion.p>
      </header>

      {/* Nastro dei piatti */}
      <div
        className="overflow-hidden py-3 border-y-2"
        style={{ backgroundColor: C.arancio, borderColor: C.marrone }}
        aria-hidden="true"
      >
        <div className="osteria-nastro flex w-max whitespace-nowrap">
          {[0, 1].map((copia) => (
            <span key={copia} className="flex">
              {piattiMarquee.map((p) => (
                <span
                  key={`${copia}-${p}`}
                  className={`${anton.className} uppercase text-xl px-5`}
                  style={{ color: C.crema }}
                >
                  {p} <span style={{ color: C.marrone }}>✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Il foglio del menù */}
      <section id="menu" className="px-6 py-24 scroll-mt-6 relative">
        <div className="max-w-2xl mx-auto relative">
          {/* scarabocchi a margine */}
          <span
            className="absolute -left-24 top-32 hidden lg:block w-20 rotate-[-8deg]"
            aria-hidden="true"
          >
            <PiattoStilizzato />
          </span>
          <Rivela>
            <div
              className="relative px-7 sm:px-12 py-12 rotate-[-0.6deg]"
              style={{
                backgroundColor: C.carta,
                border: `1px solid ${C.marrone}33`,
                outline: `1px solid ${C.marrone}33`,
                outlineOffset: "-7px",
                boxShadow: "0 30px 60px -25px rgba(46,31,20,0.45)",
              }}
            >
              <p
                className="text-center text-xs uppercase tracking-[0.35em] mb-2"
                style={{ color: C.arancio }}
              >
                ✦ ✦ ✦
              </p>
              <h2
                className={`${anton.className} text-center uppercase text-4xl sm:text-5xl mb-2`}
              >
                Il menù
              </h2>
              <p
                className="text-center text-sm italic mb-10"
                style={{ fontFamily: "Georgia, serif", color: `${C.marrone}99` }}
              >
                poche cose, fatte bene. Il pane è compreso
              </p>

              {Object.entries(menu).map(([categoria, piatti]) => (
                <div key={categoria} className="mb-9 last:mb-0">
                  <h3
                    className={`${anton.className} uppercase text-lg tracking-[0.15em] mb-4 flex items-center gap-3`}
                    style={{ color: C.arancio }}
                  >
                    <span className="h-px flex-1" style={{ backgroundColor: `${C.arancio}55` }} />
                    {categoria}
                    <span className="h-px flex-1" style={{ backgroundColor: `${C.arancio}55` }} />
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {piatti.map((p) => (
                      <li key={p.nome} className="flex items-baseline gap-2 text-base">
                        <span className="font-medium">{p.nome}</span>
                        <span
                          className="flex-1 border-b border-dotted translate-y-[-4px]"
                          style={{ borderColor: `${C.marrone}40` }}
                          aria-hidden="true"
                        />
                        <span className="font-bold whitespace-nowrap">{p.prezzo} €</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <p
                className="text-center text-sm italic mt-10 pt-6"
                style={{
                  fontFamily: "Georgia, serif",
                  color: `${C.marrone}99`,
                  borderTop: `1px solid ${C.marrone}22`,
                }}
              >
                pane e coperto 2 €, e l&apos;acqua del sindaco è gratis
              </p>

              {/* timbro stampato sopra il foglio, ben leggibile */}
              <motion.span
                className={`${anton.className} absolute -top-4 -right-2 sm:-right-7 uppercase text-xs sm:text-sm tracking-[0.2em] px-3 py-1.5 pointer-events-none select-none`}
                style={{
                  border: `3px solid ${C.arancio}`,
                  color: C.arancio,
                  borderRadius: 4,
                  backgroundColor: `${C.carta}F2`,
                  boxShadow: "0 12px 26px -14px rgba(46,31,20,0.4)",
                }}
                initial={{ opacity: 0, scale: 1.7, rotate: 22 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 7 }}
                transition={{ duration: 0.45, delay: 0.5, ease: "backOut" }}
                viewport={{ once: true, margin: "-80px" }}
                aria-hidden="true"
              >
                fatto a mano
              </motion.span>
            </div>
          </Rivela>
        </div>
      </section>

      {/* Citazione, scritta grande su carta */}
      <section className="px-6 pb-24">
        <Rivela className="max-w-3xl mx-auto text-center">
          <p
            className="text-[clamp(24px,4vw,40px)] leading-snug"
            style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
          >
            «Qui non si cambia il menù. Si cambia solo il mercato, la mattina.»
          </p>
          <p
            className="mt-5 text-xs font-bold uppercase tracking-[0.3em]"
            style={{ color: C.arancio }}
          >
            Nonna Iolanda, fondatrice
          </p>
        </Rivela>
      </section>

      {/* Polaroid dell'osteria, sparse sul tavolo */}
      <section
        className="px-6 py-20 overflow-hidden"
        style={{ backgroundColor: C.marrone }}
      >
        <div className="max-w-5xl mx-auto">
          <Rivela>
            <h2
              className={`${anton.className} uppercase text-[clamp(32px,5vw,56px)] mb-12 text-center`}
              style={{ color: C.crema }}
            >
              L&apos;osteria, <span style={{ color: C.giallo }}>in tre scatti</span>
            </h2>
          </Rivela>
          <div className="flex flex-wrap justify-center items-start gap-2 sm:-space-x-6">
            <Polaroid
              sfondo={`linear-gradient(160deg, ${C.giallo} 0%, ${C.arancio} 90%)`}
              didascalia="i tavoli nel vicolo, d'estate"
              rotazione={-4}
              className="sm:mt-8"
            />
            <Polaroid
              sfondo={`linear-gradient(200deg, #5A3B24 0%, ${C.marrone} 100%)`}
              didascalia="la sala, la sera"
              rotazione={2.5}
            />
            <Polaroid
              sfondo={`linear-gradient(140deg, ${C.arancio} 0%, #A33812 100%)`}
              didascalia="la cucina a vista"
              rotazione={-2}
              className="sm:mt-12"
            />
          </div>
        </div>
      </section>

      {/* Orari e cartolina */}
      <section id="orari" className="px-6 py-24 scroll-mt-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_1.1fr] gap-14 items-center">
          <Rivela>
            <h2 className={`${anton.className} uppercase text-[clamp(30px,4vw,46px)] mb-8`}>
              Quando <span style={{ color: C.arancio }}>ci trovi</span>
            </h2>
            <dl className="flex flex-col gap-5 text-base">
              <div>
                <dt className="font-bold">Da martedì a venerdì</dt>
                <dd style={{ color: `${C.marrone}99` }}>12:30–15:00 · 19:30–23:00</dd>
              </div>
              <div>
                <dt className="font-bold">Sabato e Domenica</dt>
                <dd style={{ color: `${C.marrone}99` }}>12:30–15:30 · 19:30–23:30</dd>
              </div>
              <div>
                <dt className="font-bold">Lunedì</dt>
                <dd className="italic" style={{ fontFamily: "Georgia, serif", color: `${C.marrone}99` }}>
                  riposo: si riposa pure la cucina
                </dd>
              </div>
            </dl>
          </Rivela>
          <Rivela delay={0.15}>
            <figure
              className="bg-white p-3 pb-4 rotate-[1.5deg] mx-auto max-w-sm"
              style={{ boxShadow: "0 22px 45px -16px rgba(46,31,20,0.4)" }}
            >
              <MappaStilizzata />
              <figcaption
                className="pt-3 text-center text-sm italic"
                style={{ fontFamily: "Georgia, serif", color: `${C.marrone}99` }}
              >
                il secondo vicolo a destra dopo la piazza. Se ti perdi, segui
                l&apos;odore del sugo
              </figcaption>
            </figure>
          </Rivela>
        </div>
      </section>

      {/* Biglietto di prenotazione */}
      <section id="prenota" className="px-6 pb-28 scroll-mt-6">
        <div className="max-w-lg mx-auto">
          <Rivela>
            <div
              className="relative px-7 sm:px-10 py-10"
              style={{
                backgroundColor: C.carta,
                border: `2px dashed ${C.marrone}66`,
                boxShadow: "0 25px 50px -20px rgba(46,31,20,0.4)",
              }}
            >
              {/* fori del biglietto */}
              <span
                className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full"
                style={{ backgroundColor: C.crema, border: `2px dashed ${C.marrone}66` }}
                aria-hidden="true"
              />
              <span
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full"
                style={{ backgroundColor: C.crema, border: `2px dashed ${C.marrone}66` }}
                aria-hidden="true"
              />

              <p
                className="text-center text-xs uppercase tracking-[0.35em] mb-2"
                style={{ color: C.arancio }}
              >
                Biglietto di prenotazione
              </p>
              <h2 className={`${anton.className} text-center uppercase text-3xl sm:text-4xl mb-8`}>
                Tieniti un tavolo
              </h2>

              {inviato ? (
                <div className="text-center py-6">
                  <motion.p
                    className={`${anton.className} inline-block uppercase text-2xl px-5 py-2 rotate-[-6deg] mb-6`}
                    style={{ border: `3px solid ${C.arancio}`, color: C.arancio, borderRadius: 4 }}
                    initial={{ opacity: 0, scale: 1.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: "backOut" }}
                  >
                    Ricevuto!
                  </motion.p>
                  <p className="text-base leading-relaxed">
                    Questa è una vetrina dimostrativa: il modulo non invia
                    nulla. Ma se l&apos;osteria esistesse, il tavolo sarebbe già
                    tuo.
                  </p>
                </div>
              ) : (
                <form
                  className="flex flex-col gap-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setInviato(true);
                  }}
                >
                  <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.15em]">
                    A nome di
                    <input
                      type="text"
                      required
                      placeholder="scrivi qui il nome"
                      className="text-lg font-normal normal-case tracking-normal outline-none bg-transparent py-1.5 placeholder:italic"
                      style={{
                        borderBottom: `2px solid ${C.marrone}55`,
                        fontFamily: "Georgia, serif",
                      }}
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-6">
                    <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.15em]">
                      Quanti siete
                      <select
                        required
                        defaultValue=""
                        className="text-lg font-normal normal-case tracking-normal outline-none bg-transparent py-1.5 appearance-none"
                        style={{
                          borderBottom: `2px solid ${C.marrone}55`,
                          fontFamily: "Georgia, serif",
                        }}
                      >
                        <option value="" disabled>
                          scegli
                        </option>
                        {[2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>
                            {n} persone
                          </option>
                        ))}
                        <option value="7+">più di 6, chiamaci!</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.15em]">
                      Giorno
                      <input
                        type="date"
                        required
                        className="text-lg font-normal normal-case tracking-normal outline-none bg-transparent py-1.5"
                        style={{
                          borderBottom: `2px solid ${C.marrone}55`,
                          fontFamily: "Georgia, serif",
                        }}
                      />
                    </label>
                  </div>
                  <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.15em]">
                    Ora
                    <select
                      required
                      defaultValue=""
                      className="text-lg font-normal normal-case tracking-normal outline-none bg-transparent py-1.5 appearance-none"
                      style={{
                        borderBottom: `2px solid ${C.marrone}55`,
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      <option value="" disabled>
                        scegli
                      </option>
                      {["12:30", "13:00", "13:30", "19:30", "20:00", "20:30", "21:00"].map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </label>
                  <motion.button
                    type="submit"
                    className={`${anton.className} uppercase text-xl px-8 py-3.5 mt-2 self-center tracking-[0.1em]`}
                    style={{ backgroundColor: C.arancio, color: C.crema, borderRadius: 4 }}
                    whileHover={{ rotate: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    data-cursor="pointer"
                  >
                    Prenota, ti aspettiamo
                  </motion.button>
                </form>
              )}
            </div>
          </Rivela>
        </div>
      </section>

      {/* Chiusura del foglio */}
      <footer
        className="px-6 py-10 text-center text-xs"
        style={{ borderTop: `2px solid ${C.marrone}1A`, color: `${C.marrone}80` }}
      >
        <span className={`${anton.className} uppercase text-base block mb-2`} style={{ color: C.arancio }}>
          Osteria del Vicolo
        </span>
        vetrina dimostrativa · attività di fantasia · nessuna prenotazione reale
      </footer>
    </div>
  );
}
