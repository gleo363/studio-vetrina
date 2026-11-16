"use client";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerCards";
import Button from "@/components/ui/Button";
import { EASE_VETRINA as ease, VIEWPORT_ONCE } from "@/lib/motion";
import { useTesti } from "@/components/providers/LinguaProvider";

// ─── Testi ──────────────────────────────────────────────────────────────────

const TESTI = {
  it: {
    eyebrow: "Perché sceglierci",
    titolo: "La tua attività è unica. Il tuo sito dovrebbe esserlo.",
    intro:
      "Oggi chiunque può mettere insieme un sito in un pomeriggio, con un modello pronto o con l'intelligenza artificiale. Ma un sito che somiglia a mille altri non fa risaltare la tua vetrina. La nasconde nella folla.",
    ctaHero: "Apriamo la tua vetrina →",
    titoloSerie: "Quando tutti partono dallo stesso stampino, nessuno si distingue.",
    testoSerie:
      "I costruttori automatici e l'intelligenza artificiale partono tutti dagli stessi modelli. Stesse impaginazioni, stesse foto di repertorio, stessi testi riadattati. Il risultato? Migliaia di attività diverse con lo stesso identico sito.",
    nomiInSerie: ["La Tua Attività", "Un'Altra Attività", "Anche Questa"],
    dominio: ".it",
    urlEsempio: "latuaattivita.it",
    scopriDiPiù: "Scopri di più",
    chiusaSerie:
      "La tua vetrina su strada non somiglia a quella del negozio accanto. Perché online dovrebbe?",
    titoloConfronto: "Lo stampino, e il su misura.",
    etichettaStampino: "Fatto con lo stampino",
    etichettaSuMisura: "Fatto su misura da Studio Vetrina",
    mockupSettore: "Ristorante · Roma",
    mockupTitolo: ["La cucina romana", "di sempre."],
    mockupCta: "Prenota un tavolo →",
    mockupCategorie: ["Antipasti", "Primi", "Dolci"],
    titoloTabella: "Punto per punto.",
    intestazioni: ["Aspetto", "Il fai-da-te", "Studio Vetrina"],
    righeTabella: [
      { aspetto: "Aspetto e unicità", faiDaTe: "Uguale a mille altri", vetrina: "Costruito su misura per te" },
      { aspetto: "Il tuo tempo", faiDaTe: "Ore o giorni a impararlo", vetrina: "Zero. Pensiamo a tutto noi" },
      { aspetto: "Velocità", faiDaTe: "Spesso pesante e lento", vetrina: "Ottimizzato per caricare in fretta" },
      { aspetto: "Trovarti su Google", faiDaTe: "Difficile emergere", vetrina: "Costruito per farti trovare" },
      { aspetto: "Testi e voce", faiDaTe: "Generici, spesso tradotti male", vetrina: "Scritti per la tua attività, in italiano" },
      { aspetto: "Assistenza", faiDaTe: "Un forum e tanta pazienza", vetrina: "Una persona vera che ti risponde" },
      { aspetto: "Proprietà", faiDaTe: "Vivi sulla piattaforma altrui", vetrina: "Il sito è tuo" },
      { aspetto: "Su misura per il telefono", faiDaTe: "A volte approssimativo", vetrina: "Curato su ogni schermo" },
      { aspetto: "Crescere nel tempo", faiDaTe: "Spesso da rifare da capo", vetrina: "Cresce insieme a te" },
    ],
    titoloCosti: "Il fai-da-te sembra gratis. Quasi mai lo è.",
    costiNascosti: [
      {
        titolo: "Il tuo tempo",
        testo: "Ogni ora passata a litigare con un costruttore di siti è un'ora tolta alla tua attività.",
      },
      {
        titolo: "L'abbonamento infinito",
        testo: "I costruttori automatici si pagano ogni mese, per sempre. Smetti di pagare, e il sito sparisce.",
      },
      {
        titolo: "I clienti che non arrivano",
        testo:
          "Un sito lento o confuso fa scappare le persone in pochi secondi. Non li vedi nemmeno, quei clienti persi.",
      },
      {
        titolo: "Il rifacimento",
        testo: "Un sito in serie invecchia in fretta. Prima o poi lo rifai da capo e ci rimetti il doppio.",
      },
    ],
    chiusaCosti: "Noi ti diamo un sito tuo, pensato per durare. Lo paghi una volta, ed è tuo.",
    titoloBasta: "E quando il fai-da-te può bastare.",
    testoBasta:
      "Se stai ancora testando un'idea, se il budget per ora non c'è, o se hai bisogno di qualcosa di provvisorio, un modello pronto può fare il suo lavoro. Non siamo qui a convincerti a spendere prima che abbia senso farlo. Ma quando la tua attività è pronta a presentarsi sul serio, non esitare a contattarci.",
    titoloFinale: "La tua vetrina, diversa da tutte le altre.",
    ctaFinale: "Parliamone",
  },
  en: {
    eyebrow: "Why us",
    titolo: "Your business is one of a kind. Your website should be too.",
    intro:
      "These days anyone can throw a website together in an afternoon, with a ready-made template or with AI. But a site that looks like a thousand others doesn't make your window stand out. It hides it in the crowd.",
    ctaHero: "Let's dress your window →",
    titoloSerie: "When everyone uses the same cookie cutter, nobody stands out.",
    testoSerie:
      "Website builders and AI tools all start from the same templates. Same layouts, same stock photos, same recycled copy. The result? Thousands of different businesses with the exact same website.",
    nomiInSerie: ["Your Business", "Another Business", "This One Too"],
    dominio: ".com",
    urlEsempio: "yourbusiness.com",
    scopriDiPiù: "Learn more",
    chiusaSerie:
      "Your shop window on the street looks nothing like the one next door. Why should it online?",
    titoloConfronto: "Cookie-cutter, or made to measure.",
    etichettaStampino: "Cookie-cutter",
    etichettaSuMisura: "Made to measure by Studio Vetrina",
    mockupSettore: "Restaurant · Rome",
    mockupTitolo: ["Roman cooking,", "the classic way."],
    mockupCta: "Book a table →",
    mockupCategorie: ["Starters", "Pasta", "Desserts"],
    titoloTabella: "Point by point.",
    intestazioni: ["What matters", "Do it yourself", "Studio Vetrina"],
    righeTabella: [
      { aspetto: "Look and feel", faiDaTe: "Same as a thousand others", vetrina: "Made to measure for you" },
      { aspetto: "Your time", faiDaTe: "Hours or days learning the tool", vetrina: "None. We take care of it all" },
      { aspetto: "Speed", faiDaTe: "Often heavy and slow", vetrina: "Tuned to load fast" },
      { aspetto: "Being found on Google", faiDaTe: "Hard to stand out", vetrina: "Built to be found" },
      { aspetto: "Words and voice", faiDaTe: "Generic, often badly translated", vetrina: "Written for your business, in your language" },
      { aspetto: "Support", faiDaTe: "A forum and a lot of patience", vetrina: "A real person who answers" },
      { aspetto: "Ownership", faiDaTe: "You live on someone else's platform", vetrina: "The site is yours" },
      { aspetto: "On phones", faiDaTe: "Sometimes rough around the edges", vetrina: "Polished on every screen" },
      { aspetto: "Growing over time", faiDaTe: "Often rebuilt from scratch", vetrina: "Grows with you" },
    ],
    titoloCosti: "DIY looks free. It rarely is.",
    costiNascosti: [
      {
        titolo: "Your time",
        testo: "Every hour spent wrestling with a website builder is an hour taken away from your business.",
      },
      {
        titolo: "The never-ending subscription",
        testo: "Website builders charge you every month, forever. Stop paying and your site disappears.",
      },
      {
        titolo: "The customers who never arrive",
        testo:
          "A slow or confusing site sends people away in seconds. You never even see the customers you lost.",
      },
      {
        titolo: "The rebuild",
        testo: "An off-the-shelf site ages fast. Sooner or later you start over, and you end up paying twice.",
      },
    ],
    chiusaCosti: "We give you a site of your own, built to last. You pay once, and it's yours.",
    titoloBasta: "And when DIY is good enough.",
    testoBasta:
      "If you're still testing an idea, if there's no budget for it yet, or if you just need something temporary, a ready-made template can do the job. We're not here to talk you into spending before it makes sense. But when your business is ready to show up properly, get in touch.",
    titoloFinale: "Your window, unlike any other.",
    ctaFinale: "Let's talk",
  },
};

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

function MockupInSerie({ nome }: { nome: string }) {
  const t = useTesti(TESTI);
  return (
    <div
      className="rounded-xl overflow-hidden shadow-lg w-full"
      style={{ border: "1px solid rgba(243,238,228,0.08)" }}
    >
      <BarraBrowser url={nome.toLowerCase().replace(/['\s]+/g, "") + t.dominio} />
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
            {t.scopriDiPiù}
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
  const t = useTesti(TESTI);
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
        {t.etichettaStampino}
      </div>
      <BarraBrowser url={t.urlEsempio} />
      <div style={{ backgroundColor: "#F0F2F5" }}>
        <div className="px-6 py-8 flex flex-col gap-3" style={{ backgroundColor: "#4A6FA5" }}>
          <div className="h-4 rounded" style={{ backgroundColor: "rgba(255,255,255,0.22)", width: "58%" }} />
          <div className="h-2.5 rounded mt-1" style={{ backgroundColor: "rgba(255,255,255,0.14)", width: "78%" }} />
          <div
            className="mt-2 h-7 w-24 rounded text-[10px] flex items-center justify-center font-medium"
            style={{ backgroundColor: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.75)" }}
          >
            {t.scopriDiPiù}
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
  const t = useTesti(TESTI);
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
        {t.etichettaSuMisura}
      </div>
      <BarraBrowser url={t.urlEsempio} scuro />
      <div>
        <div className="px-6 py-8 flex flex-col gap-3" style={{ backgroundColor: "#1B1A18" }}>
          <span
            className="text-[10px] font-medium uppercase tracking-[0.2em]"
            style={{ color: "#BF4D2C", fontFamily: "var(--font-inter)" }}
          >
            {t.mockupSettore}
          </span>
          <p
            className="font-medium leading-[1.05]"
            style={{ fontFamily: "var(--font-fraunces)", color: "#F3EEE4", fontSize: "18px" }}
          >
            {t.mockupTitolo[0]}
            <br />
            {t.mockupTitolo[1]}
          </p>
          <div className="mt-1">
            <span
              className="text-[10px] px-3 py-1.5 rounded-lg font-medium inline-block"
              style={{ backgroundColor: "#BF4D2C", color: "#F3EEE4" }}
            >
              {t.mockupCta}
            </span>
          </div>
        </div>
        <div className="p-4 space-y-2" style={{ backgroundColor: "#F3EEE4" }}>
          <div className="h-1.5 rounded" style={{ backgroundColor: "#8A8578", opacity: 0.28, width: "80%" }} />
          <div className="h-1.5 rounded" style={{ backgroundColor: "#8A8578", opacity: 0.28, width: "60%" }} />
          <div className="mt-3 grid grid-cols-3 gap-2">
            {t.mockupCategorie.map((cat) => (
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

// ═══════════════════════════════════════════════════════════════════════════
// PAGINA
// ═══════════════════════════════════════════════════════════════════════════

export default function PercheScegliercPage() {
  const t = useTesti(TESTI);
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
              {t.eyebrow}
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-[64px] font-medium text-inchiostro leading-[0.92] tracking-tight mb-8 max-w-3xl"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              {t.titolo}
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <p
              className="text-lg md:text-xl text-pietra leading-relaxed max-w-2xl mb-10"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {t.intro}
            </p>
            <Button href="/contatti" variant="primary">
              {t.ctaHero}
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
              {t.titoloSerie}
            </h2>
            <p
              className="text-base leading-relaxed mb-16 max-w-2xl"
              style={{ fontFamily: "var(--font-inter)", color: "#8A8578" }}
            >
              {t.testoSerie}
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
            {t.nomiInSerie.map((nome, i) => (
              <motion.div
                key={i}
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
              {t.chiusaSerie}
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
              {t.titoloConfronto}
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
              {t.titoloTabella}
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
                  {t.intestazioni[0]}
                </span>
                <span
                  className="text-xs font-medium uppercase tracking-[0.15em] text-pietra text-center"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {t.intestazioni[1]}
                </span>
                <span
                  className="text-xs font-medium uppercase tracking-[0.15em] text-cotto text-right"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {t.intestazioni[2]}
                </span>
              </div>

              {/* Righe con stagger */}
              <StaggerContainer className="flex flex-col" stagger={0.06}>
                {t.righeTabella.map((riga, i) => (
                  <StaggerItem key={i}>
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
              {t.titoloCosti}
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {t.costiNascosti.map((card, i) => (
              <StaggerItem key={i}>
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
              {t.chiusaCosti}
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
              {t.titoloBasta}
            </h2>
            <p
              className="text-lg text-pietra leading-relaxed"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {t.testoBasta}
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
              {t.titoloFinale}
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
                  {t.ctaFinale}
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
