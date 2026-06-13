"use client";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerCards";
import Button from "@/components/ui/Button";
import { EASE_VETRINA as ease, VIEWPORT_ONCE } from "@/lib/motion";

// ─── Barra del browser ──────────────────────────────────────────────────────

function BarraBrowser({ url = "tuasattivita.it", scuro = false }: { url?: string; scuro?: boolean }) {
  return (
    <div
      className="flex items-center gap-1.5 px-4 py-2.5 border-b"
      style={{
        backgroundColor: scuro ? "rgba(27,26,24,0.55)" : "rgba(27,26,24,0.06)",
        borderColor: scuro ? "rgba(243,238,228,0.08)" : "rgba(27,26,24,0.08)",
      }}
    >
      <span
        className="w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: scuro ? "rgba(243,238,228,0.18)" : "rgba(27,26,24,0.15)" }}
      />
      <span
        className="w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: scuro ? "rgba(243,238,228,0.18)" : "rgba(27,26,24,0.15)" }}
      />
      <span
        className="w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: scuro ? "rgba(243,238,228,0.18)" : "rgba(27,26,24,0.15)" }}
      />
      <div
        className="ml-3 flex-1 rounded h-4 max-w-[140px] flex items-center px-2"
        style={{ backgroundColor: scuro ? "rgba(243,238,228,0.08)" : "rgba(27,26,24,0.07)" }}
      >
        <span className="text-[9px] truncate" style={{ color: scuro ? "#F3EEE4" : "#1B1A18" }}>
          {url}
        </span>
      </div>
    </div>
  );
}

// ─── Tre mockup identici (Sezione 3) ────────────────────────────────────────

const nomiInSerie = ["La Tua Attività", "Un'Altra Attività", "Anche Questa"];

function MockupInSerie({ nome }: { nome: string }) {
  return (
    <div
      className="rounded-xl overflow-hidden shadow-lg w-full"
      style={{ border: "1px solid rgba(243,238,228,0.08)" }}
    >
      <BarraBrowser url={nome.toLowerCase().replace(/['\s]+/g, "") + ".it"} />
      <div style={{ backgroundColor: "#E8EDF2" }}>
        <div
          className="h-28 flex flex-col items-center justify-center gap-2 px-4 text-center"
          style={{ backgroundColor: "#5B7FA6" }}
        >
          <p className="text-white font-semibold text-xs">{nome}</p>
          <div className="h-1.5 w-24 rounded" style={{ backgroundColor: "rgba(255,255,255,0.28)" }} />
          <div
            className="mt-1 text-[10px] px-3 py-1 rounded"
            style={{ backgroundColor: "#3A5F8A", color: "rgba(255,255,255,0.9)" }}
          >
            Scopri di più
          </div>
        </div>
        <div className="bg-white p-3 flex flex-col gap-2">
          <div className="h-1.5 bg-gray-200 rounded w-full" />
          <div className="h-1.5 bg-gray-200 rounded" style={{ width: "83%" }} />
          <div className="h-1.5 bg-gray-200 rounded" style={{ width: "62%" }} />
          <div className="mt-2 grid grid-cols-3 gap-2">
            <div className="h-8 bg-gray-100 rounded" />
            <div className="h-8 bg-gray-100 rounded" />
            <div className="h-8 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mockup confronto: Stampino (Sezione 4) ─────────────────────────────────

function MockupStampino() {
  return (
    <motion.div
      className="rounded-xl overflow-hidden shadow-md flex-1 min-w-0"
      style={{ border: "1px solid rgba(27,26,24,0.10)" }}
      variants={{
        hidden: { opacity: 0, x: -40 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.7, ease },
        },
      }}
    >
      <div
        className="px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em]"
        style={{ backgroundColor: "#E0E5EC", color: "#8A8578", fontFamily: "var(--font-inter)" }}
      >
        Fatto con lo stampino
      </div>
      <BarraBrowser url="latuaattivita.it" />
      <div style={{ backgroundColor: "#F0F2F5" }}>
        <div className="px-6 py-8 flex flex-col gap-3" style={{ backgroundColor: "#4A6FA5" }}>
          <div className="h-4 rounded" style={{ backgroundColor: "rgba(255,255,255,0.22)", width: "58%" }} />
          <div className="h-2.5 rounded mt-1" style={{ backgroundColor: "rgba(255,255,255,0.14)", width: "78%" }} />
          <div
            className="mt-2 h-7 w-24 rounded text-[10px] flex items-center justify-center font-medium"
            style={{ backgroundColor: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.75)" }}
          >
            Scopri di più
          </div>
        </div>
        <div className="bg-white p-4 space-y-2">
          <div className="h-2 bg-gray-200 rounded w-full" />
          <div className="h-2 bg-gray-200 rounded" style={{ width: "74%" }} />
          <div className="h-2 bg-gray-200 rounded" style={{ width: "52%" }} />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="h-14 bg-gray-100 rounded" />
            <div className="h-14 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Mockup confronto: Su misura (Sezione 4) ────────────────────────────────

// Il clip-path vive su una variante figlia: se fosse sul target osservato,
// l'elemento clippato al 100% non supererebbe mai la soglia di visibilità
// (Chrome calcola il ratio sull'area visibile dopo il clip).
function MockupSuMisura() {
  return (
    <motion.div
      className="rounded-xl overflow-hidden shadow-2xl flex-1 min-w-0"
      style={{ border: "1.5px solid rgba(191,77,44,0.3)" }}
      variants={{
        hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
        visible: {
          opacity: 1,
          clipPath: "inset(0 0% 0 0)",
          transition: { duration: 1.0, ease, delay: 0.25 },
        },
      }}
    >
      <div
        className="px-4 py-2 text-[10px] font-medium uppercase tracking-[0.18em]"
        style={{ backgroundColor: "#BF4D2C", color: "#F3EEE4", fontFamily: "var(--font-inter)" }}
      >
        Fatto su misura da Studio Vetrina
      </div>
      <BarraBrowser url="latuaattivita.it" scuro />
      <div>
        <div className="px-6 py-8 flex flex-col gap-3" style={{ backgroundColor: "#1B1A18" }}>
          <span
            className="text-[10px] font-medium uppercase tracking-[0.2em]"
            style={{ color: "#BF4D2C", fontFamily: "var(--font-inter)" }}
          >
            Ristorante · Roma
          </span>
          <p
            className="font-medium leading-[1.05]"
            style={{ fontFamily: "var(--font-fraunces)", color: "#F3EEE4", fontSize: "18px" }}
          >
            La cucina romana
            <br />
            di sempre.
          </p>
          <div className="mt-1">
            <span
              className="text-[10px] px-3 py-1.5 rounded-lg font-medium inline-block"
              style={{ backgroundColor: "#BF4D2C", color: "#F3EEE4" }}
            >
              Prenota un tavolo →
            </span>
          </div>
        </div>
        <div className="p-4 space-y-2" style={{ backgroundColor: "#F3EEE4" }}>
          <div className="h-1.5 rounded" style={{ backgroundColor: "#8A8578", opacity: 0.28, width: "80%" }} />
          <div className="h-1.5 rounded" style={{ backgroundColor: "#8A8578", opacity: 0.28, width: "60%" }} />
          <div className="mt-3 grid grid-cols-3 gap-2">
            {["Antipasti", "Primi", "Dolci"].map((cat) => (
              <div
                key={cat}
                className="h-12 rounded-lg text-[9px] flex items-center justify-center font-medium"
                style={{ backgroundColor: "#1B1A18", color: "#F3EEE4", fontFamily: "var(--font-inter)" }}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Dati tabella comparativa ────────────────────────────────────────────────

const righeTabella = [
  { aspetto: "Aspetto e unicità", faiDaTe: "Uguale a mille altri", vetrina: "Costruito su misura per te" },
  { aspetto: "Il tuo tempo", faiDaTe: "Ore o giorni a impararlo", vetrina: "Zero. Pensiamo a tutto noi" },
  { aspetto: "Costo", faiDaTe: "Abbonamento mensile, per sempre", vetrina: "Un progetto una tantum" },
  { aspetto: "Velocità", faiDaTe: "Spesso pesante e lento", vetrina: "Ottimizzato per caricare in fretta" },
  { aspetto: "Trovarti su Google", faiDaTe: "Difficile emergere", vetrina: "Costruito per farti trovare" },
  { aspetto: "Testi e voce", faiDaTe: "Generici, spesso tradotti male", vetrina: "Scritti per la tua attività, in italiano" },
  { aspetto: "Assistenza", faiDaTe: "Un forum e tanta pazienza", vetrina: "Una persona a Roma che ti risponde" },
  { aspetto: "Proprietà", faiDaTe: "Vivi sulla piattaforma altrui", vetrina: "Il sito è tuo" },
  { aspetto: "Su misura per il telefono", faiDaTe: "A volte approssimativo", vetrina: "Curato su ogni schermo" },
  { aspetto: "Crescere nel tempo", faiDaTe: "Spesso da rifare da capo", vetrina: "Cresce insieme a te" },
];

// ─── Dati costi nascosti ─────────────────────────────────────────────────────

const costiNascosti = [
  {
    titolo: "Il tuo tempo",
    testo:
      "Ogni ora passata a litigare con un costruttore di siti è un'ora tolta alla tua attività.",
  },
  {
    titolo: "L'abbonamento infinito",
    testo:
      "I costruttori automatici si pagano ogni mese, per sempre. Smetti di pagare, e il sito sparisce.",
  },
  {
    titolo: "I clienti che non arrivano",
    testo:
      "Un sito lento o confuso fa scappare le persone in pochi secondi. Non li vedi nemmeno, quei clienti persi.",
  },
  {
    titolo: "Il rifacimento",
    testo:
      "Un sito in serie invecchia in fretta. Prima o poi lo rifai da capo e ci rimetti il doppio.",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// PAGINA
// ═══════════════════════════════════════════════════════════════════════════

export default function PercheScegliercPage() {
  return (
    <div className="min-h-screen bg-travertino">

      {/* ─── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="bg-travertino pt-36 pb-28 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <p
              className="text-xs font-medium uppercase tracking-[0.2em] text-pietra mb-6"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Perché sceglierci
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-[64px] font-medium text-inchiostro leading-[0.92] tracking-tight mb-8 max-w-3xl"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              La tua attività è unica. Il tuo sito dovrebbe esserlo.
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <p
              className="text-lg md:text-xl text-pietra leading-relaxed max-w-2xl mb-10"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Oggi chiunque può mettere insieme un sito in un pomeriggio, con un modello pronto
              o con l&apos;intelligenza artificiale. Ma un sito che somiglia a mille altri non fa
              risaltare la tua vetrina. La nasconde nella folla.
            </p>
            <Button href="/contatti" variant="primary">
              Apriamo la tua vetrina →
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── 3. IL PROBLEMA DEI SITI IN SERIE ────────────────────────────── */}
      <section className="bg-inchiostro px-6 py-28">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2
              className="text-3xl md:text-4xl font-medium mb-6 max-w-2xl"
              style={{ fontFamily: "var(--font-fraunces)", color: "#F3EEE4" }}
            >
              Quando tutti partono dallo stesso stampino, nessuno si distingue.
            </h2>
            <p
              className="text-base leading-relaxed mb-16 max-w-2xl"
              style={{ fontFamily: "var(--font-inter)", color: "#8A8578" }}
            >
              I costruttori automatici e l&apos;intelligenza artificiale partono tutti dagli stessi
              modelli. Stesse impaginazioni, stesse foto di repertorio, stessi testi riadattati.
              Il risultato? Migliaia di attività diverse con lo stesso identico sito.
            </p>
          </AnimatedSection>

          {/* Tre mockup sincronizzati — stagger 0 = entrano tutti insieme */}
          <motion.div
            className="flex flex-col md:flex-row gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0 } },
            }}
          >
            {nomiInSerie.map((nome) => (
              <motion.div
                key={nome}
                className="flex-1 min-w-0"
                variants={{
                  hidden: { opacity: 0, y: 40, scale: 0.97 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.7, ease },
                  },
                }}
              >
                <MockupInSerie nome={nome} />
              </motion.div>
            ))}
          </motion.div>

          <AnimatedSection delay={0.4} className="mt-14">
            <p
              className="text-xl md:text-2xl italic max-w-xl"
              style={{ fontFamily: "var(--font-fraunces)", color: "#BF4D2C" }}
            >
              La tua vetrina su strada non somiglia a quella del negozio accanto. Perché online
              dovrebbe?
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── 4. CONFRONTO FIANCO A FIANCO ────────────────────────────────── */}
      <section className="bg-travertino px-6 py-28">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="mb-14">
            <h2
              className="text-3xl md:text-4xl font-medium text-inchiostro"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Lo stampino, e il su misura.
            </h2>
          </AnimatedSection>

          <motion.div
            className="flex flex-col md:flex-row gap-6 md:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
          >
            <MockupStampino />
            <MockupSuMisura />
          </motion.div>
        </div>
      </section>

      {/* ─── 5. TABELLA COMPARATIVA ──────────────────────────────────────── */}
      <section className="bg-glass px-6 py-28">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="mb-12">
            <h2
              className="text-3xl md:text-4xl font-medium text-inchiostro"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Punto per punto.
            </h2>
          </AnimatedSection>

          <div className="overflow-x-auto">
            <div className="min-w-[560px]">
              {/* Intestazione */}
              <div
                className="grid gap-0 mb-1 px-4 pb-3 border-b"
                style={{
                  gridTemplateColumns: "1.2fr 1fr 1fr",
                  borderColor: "rgba(27,26,24,0.12)",
                }}
              >
                <span
                  className="text-xs font-medium uppercase tracking-[0.15em] text-pietra"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Aspetto
                </span>
                <span
                  className="text-xs font-medium uppercase tracking-[0.15em] text-pietra text-center"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Il fai-da-te
                </span>
                <span
                  className="text-xs font-medium uppercase tracking-[0.15em] text-cotto text-right"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Studio Vetrina
                </span>
              </div>

              {/* Righe con stagger */}
              <StaggerContainer className="flex flex-col" stagger={0.06}>
                {righeTabella.map((riga) => (
                  <StaggerItem key={riga.aspetto}>
                    <div
                      className="grid py-4 px-4 border-b"
                      style={{
                        gridTemplateColumns: "1.2fr 1fr 1fr",
                        borderColor: "rgba(27,26,24,0.07)",
                      }}
                    >
                      <span
                        className="text-sm font-medium text-inchiostro"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {riga.aspetto}
                      </span>
                      <span
                        className="text-sm text-pietra text-center"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {riga.faiDaTe}
                      </span>
                      <span
                        className="text-sm font-medium text-cotto text-right"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {riga.vetrina}
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. COSTI NASCOSTI ───────────────────────────────────────────── */}
      <section className="bg-inchiostro px-6 py-28">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="mb-14">
            <h2
              className="text-3xl md:text-4xl font-medium max-w-xl"
              style={{ fontFamily: "var(--font-fraunces)", color: "#F3EEE4" }}
            >
              Il fai-da-te sembra gratis. Quasi mai lo è.
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {costiNascosti.map((card) => (
              <StaggerItem key={card.titolo}>
                <motion.div
                  className="rounded-2xl p-8 cursor-default"
                  style={{
                    backgroundColor: "rgba(243,238,228,0.04)",
                    border: "1px solid rgba(243,238,228,0.08)",
                  }}
                  whileHover={{ y: -4, backgroundColor: "rgba(243,238,228,0.08)" }}
                  transition={{ duration: 0.25 }}
                >
                  <h3
                    className="text-lg font-medium mb-3"
                    style={{ fontFamily: "var(--font-fraunces)", color: "#DA9A47" }}
                  >
                    {card.titolo}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ fontFamily: "var(--font-inter)", color: "#8A8578" }}
                  >
                    {card.testo}
                  </p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <AnimatedSection delay={0.3} className="mt-14">
            <p
              className="text-xl md:text-2xl italic max-w-2xl"
              style={{ fontFamily: "var(--font-fraunces)", color: "rgba(243,238,228,0.55)" }}
            >
              Noi ti diamo un sito tuo, pensato per durare. Lo paghi una volta, ed è tuo.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── 7. QUANDO IL FAI-DA-TE PUÒ BASTARE ────────────────────────── */}
      <section className="bg-travertino px-6 py-28">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <h2
              className="text-3xl md:text-4xl font-medium text-inchiostro mb-8"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              E quando il fai-da-te può bastare.
            </h2>
            <p
              className="text-lg text-pietra leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Se stai ancora testando un&apos;idea, se il budget per ora non c&apos;è, o se hai
              bisogno di qualcosa di provvisorio, un modello pronto può fare il suo lavoro.
              Non siamo qui a convincerti a spendere prima che abbia senso farlo. Ma quando
              la tua attività è pronta a presentarsi sul serio, non esitare a contattarci.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── 8. CTA FINALE ───────────────────────────────────────────────── */}
      {/* Il trigger è la sezione (mai clippata); il sipario cotto e i
          contenuti sono varianti figlie — stesso fix del reveal in home. */}
      <motion.section
        className="overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div
          className="bg-cotto vignetta-inchiostro px-6 py-32"
          variants={{
            hidden: { clipPath: "inset(100% 0 0 0)" },
            visible: {
              clipPath: "inset(0% 0 0 0)",
              transition: { duration: 1.0, ease },
            },
          }}
        >
          <div className="max-w-6xl mx-auto text-center">
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-medium text-travertino leading-[1.05] mb-8 max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.9, delay: 0.3, ease },
                },
              }}
            >
              La tua vetrina, diversa da tutte le altre.
            </motion.h2>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, delay: 0.5, ease },
                },
              }}
            >
              <motion.div
                className="inline-flex"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2, ease }}
              >
                <a
                  href="/contatti"
                  className="inline-flex items-center gap-2 bg-travertino text-inchiostro rounded-[10px] px-8 py-4 text-base font-medium hover:bg-glass transition-colors"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Parliamone
                  <span className="freccia" aria-hidden="true">
                    →
                  </span>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
