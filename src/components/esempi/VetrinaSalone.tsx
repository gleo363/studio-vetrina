"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Manrope, Playfair_Display } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "800"],
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["italic"],
  display: "swap",
});

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

// Palette del salone — rivista di moda con un solo accento
const C = {
  bianco: "#FFFFFF",
  carbone: "#1C1C1E",
  malva: "#A06CD5",
  lavanda: "#F3EBFC",
  grigio: "#6B6B70",
};

const listino: {
  numero: string;
  categoria: string;
  servizi: { nome: string; nota: string; prezzo: string }[];
}[] = [
  {
    numero: "01",
    categoria: "Capelli",
    servizi: [
      { nome: "Taglio e piega", nota: "consulenza inclusa", prezzo: "35" },
      { nome: "Colore radici", nota: "senza ammoniaca", prezzo: "45" },
      { nome: "Balayage e schiariture", nota: "su misura", prezzo: "da 90" },
      { nome: "Trattamento ricostruzione", nota: "cheratina vegetale", prezzo: "40" },
      { nome: "Taglio uomo e barba", nota: "panno caldo", prezzo: "28" },
    ],
  },
  {
    numero: "02",
    categoria: "Estetica",
    servizi: [
      { nome: "Manicure con semipermanente", nota: "oltre 80 tinte", prezzo: "30" },
      { nome: "Pedicure estetico", nota: "con massaggio", prezzo: "35" },
      { nome: "Pulizia viso profonda", nota: "60 minuti", prezzo: "50" },
      { nome: "Ceretta gambe complete", nota: "cera a bassa temperatura", prezzo: "30" },
      { nome: "Laminazione ciglia", nota: "effetto naturale", prezzo: "45" },
    ],
  },
];

const lavori = [
  { etichetta: "balayage caramello", da: "#E8D5F5", a: "#A06CD5" },
  { etichetta: "bob pari, piega liscia", da: "#1C1C1E", a: "#4A4A52" },
  { etichetta: "riccio definito", da: "#C9A8E8", a: "#7B4BAE" },
  { etichetta: "biondo freddo", da: "#F3EBFC", a: "#C9A8E8" },
  { etichetta: "semipermanente lilla", da: "#A06CD5", a: "#5E3993" },
];

const fasce = ["9:30", "10:30", "11:30", "14:30", "15:30", "16:30", "17:30"];

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

/** Parola evidenziata col pennarello malva. */
function Marker({ children }: { children: React.ReactNode }) {
  return (
    <mark
      style={{
        background: `linear-gradient(transparent 45%, ${C.malva}4D 45%)`,
        color: "inherit",
      }}
    >
      {children}
    </mark>
  );
}

export default function VetrinaSalone() {
  const [inviato, setInviato] = useState(false);
  const [fascia, setFascia] = useState("");

  return (
    <div
      className={manrope.className}
      style={{ backgroundColor: C.bianco, color: C.carbone }}
    >
      {/* Testata da rivista */}
      <nav
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${C.carbone}1F` }}
        aria-label="Navigazione Atelier Sofia"
      >
        <span className="text-[11px] font-extrabold uppercase tracking-[0.35em]">
          Atelier Sofia
        </span>
        <span className="hidden sm:block text-[11px] uppercase tracking-[0.25em]" style={{ color: C.grigio }}>
          parrucchieri · centro estetico · Roma
        </span>
        <a
          href="#prenota"
          className="text-[11px] font-extrabold uppercase tracking-[0.25em] hover:opacity-50 transition-opacity"
          style={{ color: C.malva }}
          data-cursor="pointer"
        >
          Prenota ↘
        </a>
      </nav>

      {/* Apertura editoriale */}
      <header className="px-6 pt-16 md:pt-24 pb-14">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            className="text-[clamp(46px,8.5vw,110px)] font-extrabold leading-[0.95] tracking-tight lowercase"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
          >
            capelli, pelle,
            <br />
            <span
              className={`${playfair.className} italic font-medium`}
              style={{ color: C.malva }}
            >
              e un&apos;ora tutta per te.
            </span>
          </motion.h1>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            <p className="text-base font-light leading-relaxed max-w-sm" style={{ color: C.grigio }}>
              Salone e centro estetico sotto lo stesso tetto, solo su
              appuntamento. Prenoti online, arrivi, ti rilassi: al resto
              pensiamo noi.
            </p>
            <p className="text-[11px] uppercase tracking-[0.25em] whitespace-nowrap" style={{ color: C.grigio }}>
              n. 01 · la cura, prima di tutto
            </p>
          </motion.div>
        </div>
      </header>

      {/* Striscia collage, da editoriale di moda */}
      <motion.div
        className="flex items-end gap-1.5 px-1.5 h-44 md:h-60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.45 }}
        aria-hidden="true"
      >
        {[
          { w: "22%", h: "100%", g: `linear-gradient(170deg, ${C.lavanda}, ${C.malva})` },
          { w: "30%", h: "78%", g: `linear-gradient(200deg, ${C.carbone}, #4A4A52)` },
          { w: "14%", h: "92%", g: `linear-gradient(150deg, ${C.malva}, #5E3993)` },
          { w: "20%", h: "64%", g: `linear-gradient(180deg, #E8D5F5, ${C.lavanda})` },
          { w: "14%", h: "86%", g: `linear-gradient(160deg, #C9A8E8, ${C.malva})` },
        ].map((b, i) => (
          <div key={i} style={{ width: b.w, height: b.h, background: b.g }} />
        ))}
      </motion.div>

      {/* Listino come indice di rivista */}
      <section id="listino" className="px-6 py-24 scroll-mt-6">
        <div className="max-w-6xl mx-auto">
          <Rivela className="flex items-baseline justify-between gap-6 mb-16">
            <h2 className="text-[clamp(30px,4.5vw,54px)] font-extrabold tracking-tight lowercase leading-none">
              il listino<span style={{ color: C.malva }}>.</span>
            </h2>
            <p className="text-[11px] uppercase tracking-[0.25em] text-right" style={{ color: C.grigio }}>
              prezzi chiari, in euro
            </p>
          </Rivela>

          {listino.map((sezione, si) => (
            <Rivela key={sezione.categoria} delay={si * 0.1} className="mb-16 last:mb-0">
              <div className="grid md:grid-cols-[180px_1fr] gap-4 md:gap-10 items-start">
                <div className="flex md:flex-col items-baseline md:items-start gap-3">
                  <span
                    className="text-6xl md:text-8xl font-extrabold leading-none select-none"
                    style={{ color: `${C.malva}26` }}
                    aria-hidden="true"
                  >
                    {sezione.numero}
                  </span>
                  <h3 className="text-sm font-extrabold uppercase tracking-[0.3em]">
                    {sezione.categoria}
                  </h3>
                </div>
                <ul>
                  {sezione.servizi.map((s) => (
                    <li
                      key={s.nome}
                      className="group grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto] items-baseline gap-x-6 py-4 transition-colors duration-200 hover:bg-[#F3EBFC] px-3 -mx-3"
                      style={{ borderBottom: `1px solid ${C.carbone}14` }}
                    >
                      <span className="text-base md:text-lg font-medium">{s.nome}</span>
                      <span
                        className={`${playfair.className} italic hidden sm:block text-sm`}
                        style={{ color: C.grigio }}
                      >
                        {s.nota}
                      </span>
                      <span
                        className="text-base md:text-lg font-extrabold tabular-nums"
                        style={{ color: C.malva }}
                      >
                        {s.prezzo} €
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Rivela>
          ))}
        </div>
      </section>

      {/* Manifesto, scritto come un articolo */}
      <section className="px-6 py-24" style={{ backgroundColor: C.lavanda }}>
        <Rivela className="max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.3em] mb-8" style={{ color: C.malva }}>
            il nostro modo di lavorare
          </p>
          <p className="text-[clamp(22px,3vw,32px)] font-light leading-[1.5]">
            Ogni appuntamento comincia con{" "}
            <Marker>dieci minuti di consulenza</Marker>: il taglio giusto nasce
            da lì, non dalle riviste. Usiamo solo prodotti professionali{" "}
            <Marker>senza solfati né parabeni</Marker>, scelti uno a uno. E
            quando sei in poltrona, niente doppi appuntamenti incastrati: quel
            tempo è <Marker>solo tuo</Marker>.
          </p>
          <p
            className={`${playfair.className} italic text-lg mt-10`}
            style={{ color: C.grigio }}
          >
            Sofia, Martina ed Elena: fondatrice e colorista, parrucchiera,
            estetista specializzata
          </p>
        </Rivela>
      </section>

      {/* Lavori, striscia da sfogliare */}
      <section id="lavori" className="py-24 scroll-mt-6 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <Rivela className="flex items-baseline justify-between gap-6 mb-10">
            <h2 className="text-[clamp(30px,4.5vw,54px)] font-extrabold tracking-tight lowercase leading-none">
              dalle nostre poltrone<span style={{ color: C.malva }}>.</span>
            </h2>
            <p className="text-[11px] uppercase tracking-[0.25em] whitespace-nowrap" style={{ color: C.grigio }}>
              scorri →
            </p>
          </Rivela>
        </div>
        <Rivela delay={0.1}>
          <div
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory px-6 pb-4"
            style={{ scrollbarWidth: "thin" }}
            tabIndex={0}
            aria-label="Galleria dei lavori, scorri in orizzontale"
          >
            {lavori.map((l, i) => (
              <figure
                key={l.etichetta}
                className="snap-start shrink-0 w-[70vw] sm:w-72"
              >
                <div
                  className="aspect-[3/4]"
                  style={{ background: `linear-gradient(165deg, ${l.da} 0%, ${l.a} 100%)` }}
                />
                <figcaption className="flex items-baseline justify-between pt-3">
                  <span className={`${playfair.className} italic text-base`}>{l.etichetta}</span>
                  <span className="text-[11px] tabular-nums" style={{ color: C.grigio }}>
                    {String(i + 1).padStart(2, "0")} / {String(lavori.length).padStart(2, "0")}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Rivela>
      </section>

      {/* Prenota — pagina divisa, input a sottolineatura */}
      <section
        id="prenota"
        className="px-6 py-24 scroll-mt-6"
        style={{ borderTop: `1px solid ${C.carbone}1F` }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_1.3fr] gap-14 items-start">
          <Rivela className="md:sticky md:top-10">
            <h2
              className={`${playfair.className} italic text-[clamp(36px,5vw,64px)] leading-tight mb-6`}
            >
              Il tuo
              <br />
              momento.
            </h2>
            <p className="text-base font-light leading-relaxed max-w-xs" style={{ color: C.grigio }}>
              Scegli servizio, giorno e fascia oraria. Ti confermiamo
              l&apos;appuntamento al volo.
            </p>
          </Rivela>

          <Rivela delay={0.1}>
            {inviato ? (
              <div className="py-10">
                <p
                  className={`${playfair.className} italic text-3xl mb-4`}
                  style={{ color: C.malva }}
                >
                  Che bello.
                </p>
                <p className="text-base font-light leading-relaxed max-w-md">
                  Questa è una vetrina dimostrativa: il modulo non invia nulla.
                  Ma se l&apos;atelier esistesse, la poltrona sarebbe già
                  prenotata a nome tuo.
                </p>
              </div>
            ) : (
              <form
                className="flex flex-col gap-9"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (fascia) setInviato(true);
                }}
              >
                <label className="flex flex-col gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.25em]">
                    Nome
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="il tuo nome"
                    className="text-xl font-light outline-none bg-transparent py-2 placeholder:opacity-40 focus:border-b-2 transition-all"
                    style={{ borderBottom: `1px solid ${C.carbone}55` }}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.25em]">
                    Servizio
                  </span>
                  <select
                    required
                    defaultValue=""
                    className="text-xl font-light outline-none bg-transparent py-2 appearance-none focus:border-b-2 transition-all"
                    style={{ borderBottom: `1px solid ${C.carbone}55` }}
                  >
                    <option value="" disabled>
                      scegli il servizio
                    </option>
                    {listino.map((sez) => (
                      <optgroup key={sez.categoria} label={sez.categoria}>
                        {sez.servizi.map((s) => (
                          <option key={s.nome} value={s.nome}>
                            {s.nome} · {s.prezzo} €
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.25em]">
                    Giorno
                  </span>
                  <input
                    type="date"
                    required
                    className="text-xl font-light outline-none bg-transparent py-2 focus:border-b-2 transition-all"
                    style={{ borderBottom: `1px solid ${C.carbone}55` }}
                  />
                </label>

                <fieldset>
                  <legend className="text-[11px] font-extrabold uppercase tracking-[0.25em] mb-4">
                    Fascia oraria
                  </legend>
                  <div className="flex flex-wrap gap-2.5">
                    {fasce.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFascia(f)}
                        aria-pressed={fascia === f}
                        className="px-5 py-2.5 text-sm font-medium transition-colors duration-200 cursor-pointer"
                        style={
                          fascia === f
                            ? { backgroundColor: C.carbone, color: C.bianco }
                            : { border: `1px solid ${C.carbone}40`, color: C.carbone }
                        }
                        data-cursor="pointer"
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  {!fascia && (
                    <p className="text-xs mt-3" style={{ color: C.grigio }}>
                      scegli una fascia per confermare
                    </p>
                  )}
                </fieldset>

                <button
                  type="submit"
                  disabled={!fascia}
                  className="text-base font-extrabold uppercase tracking-[0.2em] px-10 py-5 transition-colors duration-200 disabled:opacity-30 cursor-pointer"
                  style={{ backgroundColor: C.malva, color: C.bianco }}
                  data-cursor="pointer"
                >
                  Prenota l&apos;appuntamento
                </button>
              </form>
            )}
          </Rivela>
        </div>
      </section>

      {/* Piè di pagina da colophon */}
      <footer
        className="px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        style={{ borderTop: `1px solid ${C.carbone}1F` }}
      >
        <span className="text-[11px] font-extrabold uppercase tracking-[0.35em]">
          Atelier Sofia
        </span>
        <p className="text-[11px] uppercase tracking-[0.15em]" style={{ color: C.grigio }}>
          vetrina dimostrativa · attività di fantasia · nessuna prenotazione reale
        </p>
      </footer>
    </div>
  );
}
