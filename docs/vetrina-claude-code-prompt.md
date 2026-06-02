# Studio Vetrina — Prompt per Claude Code

Copia e incolla tutto questo in Claude Code come primo messaggio.

---

## IL PROMPT

Costruisci il sito completo di **Studio Vetrina** in **Next.js 14 (App Router) + Tailwind CSS + Framer Motion**.

Studio Vetrina è uno studio di web design romano che costruisce siti su misura per piccole attività locali (ristoranti, saloni, boutique, artigiani). Il brand parla italiano chiaro — mai anglicismi inutili. Tono: accogliente, curato, diretto, orgoglioso del mestiere.

---

## DESIGN SYSTEM

### Colori (aggiungi in tailwind.config.js)
```js
colors: {
  travertino: '#F3EEE4',
  inchiostro: '#1B1A18',
  cotto:      '#BF4D2C',
  ocra:       '#DA9A47',
  pietra:     '#8A8578',
  glass:      '#FBF9F3',
}
```

### Font (Google Fonts — aggiungi in layout.tsx)
- **Fraunces** (opsz 9..144, weights 300/400/500) — titoli, pay-off, display
- **Inter** (weights 400/500/600) — corpo, UI, etichette
- Fraunces = `font-display`; Inter = `font-sans`

### Logo SVG (inline, riutilizzabile come componente `<Logo />`)
```svg
<svg viewBox="0 0 100 100" aria-label="Studio Vetrina">
  <clipPath id="glass"><rect x="25.5" y="11.5" width="49" height="77" rx="10.5"/></clipPath>
  <rect x="22" y="8" width="56" height="84" rx="14" fill="#FBF9F3" stroke="#1B1A18" stroke-width="6"/>
  <g clip-path="url(#glass)">
    <path d="M25 11 L75 11 L75 34 L52 47 Q50 49 48 47 L25 34 Z" fill="#BF4D2C"/>
  </g>
  <rect x="36" y="78" width="28" height="4.5" rx="2.25" fill="#1B1A18"/>
</svg>
```
Versione su fondo scuro: stroke e shelf diventano `#F3EEE4`, tenda resta `#BF4D2C`.

---

## STRUTTURA PAGINE

### `/` — Home
### `/lavori` — Portfolio
### `/studio` — Chi siamo
### `/contatti` — Contatti

---

## CONTENUTI PAGINA PER PAGINA

### HOME `/`

**Hero (fullscreen, sfondo Travertino)**
- Kicker uppercase: `STUDIO VETRINA · ROMA`
- H1 Fraunces 96–120px: `La tua vetrina sul mondo.`
- Sottotitolo Fraunces italic: `Siti web su misura per le piccole attività di Roma.`
- CTA primario (bg Cotto, testo Travertino, border-radius 10px): `Apriamo la tua vetrina →`
- CTA secondario (link underline): `Guarda i nostri lavori`
- Logo mark grande (180–220px) in basso a destra, opacity 0.07, come watermark decorativo

**Sezione problema (sfondo Inchiostro)**
- Titolo Fraunces: `Il 68% delle piccole attività italiane non ha un sito. O ce l'ha, ma fa più danno che bene.`
- 4 stat card in griglia 2×2:
  - `4,2M` — piccole imprese senza presenza online adeguata
  - `76%` — dei consumatori giudica un'azienda dal suo sito
  - `€0` — guadagni online senza sito web
  - `8"` — secondi per perdere un visitatore

**Sezione soluzione (sfondo Travertino)**
- Titolo: `Curiamo la tua presenza online come tu curi la tua vetrina.`
- 3 card: `Ascoltiamo` / `Progettiamo` / `Consegniamo`

**Sezione target (sfondo Glass)**
- Titolo: `Le attività che danno anima a Roma.`
- 4 card con emoji + nome + bisogno specifico:
  - 🍕 Ristoranti e bar — essere trovati su Google
  - 💇 Saloni e centri estetici — prenotazioni online
  - 🛍️ Boutique e negozi — presenza digitale
  - 🔧 Artigiani e professionisti — credibilità online

**Sezione servizi (sfondo Travertino)**
- Titolo: `Tre pacchetti, zero sorprese.`
- 3 card pricing:
  - **Vetrina Essenziale** — fino a 5 pagine, design su misura, hosting incluso — `€ 990`
  - **Vetrina Completa** *(evidenziata, bordo Cotto)* — fino a 10 pagine, blog, prenotazioni, SEO — `€ 1.890`
  - **Vetrina su Misura** — e-commerce, app, portali — `Su misura`

**Sezione CTA finale (sfondo Cotto)**
- Titolo Fraunces italic grande: `Ogni attività merita la sua vetrina.`
- CTA: `Parliamone davanti a un caffè →`

---

### LAVORI `/lavori`

Portfolio di 6 progetti fittizi ma realistici (ristorante, salone, boutique, studio dentistico, libreria, artigiano). Ogni card mostra:
- Nome attività + categoria
- Screenshot mockup (usa un rettangolo placeholder con gradiente in palette)
- Tag tecnologia (Next.js / Prenotazioni / E-commerce ecc.)
- Link `Vedi il sito →`

Griglia: 3 colonne desktop, 2 tablet, 1 mobile.

---

### STUDIO `/studio`

- Hero: `Siamo a Roma. Facciamo siti.` (Fraunces, grande)
- Paragrafo brand: *"Studio Vetrina è uno studio di web design di Roma. Curiamo la presenza online delle piccole attività con la stessa attenzione con cui un negoziante cura la sua vetrina: con gusto, ordine e un po' di orgoglio. Niente paroloni, niente inglese inutile — solo siti su misura, belli e facili da usare."*
- Sezione valori: 5 pill/card — Accogliente · Curato · Chiaro · Orgoglioso del mestiere · Romano
- Il processo in 4 passi con timing:
  1. Ascolto — Giorno 1–2
  2. Proposta — Giorno 3–5
  3. Costruzione — Giorno 6–18
  4. Consegna — Giorno 19–21

---

### CONTATTI `/contatti`

- Titolo: `Raccontaci la tua attività — al resto pensiamo noi.`
- Form campi: Nome / Attività / Email / Telefono / Messaggio libero
- CTA form: `Apriamo la tua vetrina →`
- Aside info: `ciao@vetrina.it` · `Roma, Italia` · Instagram `@studiovetrina`

---

## NAVIGAZIONE

**Header sticky** (backdrop-blur, sfondo travertino 85% opacità):
- Sinistra: Logo SVG (24px) + wordmark `vetrina` in Fraunces
- Destra: link `Lavori` · `Studio` · `Parliamone` (questo ultimo è un bottone Cotto)
- Mobile: hamburger menu con drawer full-screen

**Footer** (sfondo Inchiostro):
- Sinistra: Logo negativo + `vetrina`
- Centro: link navigazione
- Destra: `© 2026 Studio Vetrina · Roma`
- Frase italic Fraunces: `Un solo segno, tre significati.`

---

## ANIMAZIONI — STILE APPLE

Usa **Framer Motion** per tutto. L'obiettivo è fluidità assoluta — niente pop, niente rimbalzi esagerati. Tutto deve sentirsi fisico e curato.

### Principi
- Easing default: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (ease-out naturale)
- Duration base: 0.7s–1.0s per entrate, 0.3s per hover
- Stagger tra elementi in sequenza: 0.08s–0.12s
- Mai `linear` — sempre curve naturali

### Animazioni specifiche da implementare

**Hero — scroll parallax:**
```js
// Il titolo sale mentre scorri, l'opacità scende
const { scrollY } = useScroll();
const y = useTransform(scrollY, [0, 500], [0, -120]);
const opacity = useTransform(scrollY, [0, 300], [1, 0]);
```

**Entrata elementi (useInView):**
```js
// Ogni sezione entra dal basso con fade
initial={{ opacity: 0, y: 40 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
viewport={{ once: true, margin: "-80px" }}
```

**Stagger cards:**
```js
// Le card entrano in sequenza
variants={{
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}}
// Ogni figlio:
variants={{
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
}}
```

**Hover card:**
```js
whileHover={{ y: -6, boxShadow: "0 24px 48px -16px rgba(27,26,24,0.35)" }}
transition={{ duration: 0.3 }}
```

**CTA button:**
```js
whileHover={{ scale: 1.03, backgroundColor: "#a8431f" }}
whileTap={{ scale: 0.97 }}
transition={{ duration: 0.2 }}
```

**Navigazione sticky — shrink on scroll:**
```js
// Header rimpicciolisce quando si scorre
const scrolled = scrollY > 20;
// padding: scrolled ? "8px 28px" : "16px 28px"
// transizione CSS: transition: padding 0.4s ease
```

**Logo watermark — parallax lento:**
```js
const y = useTransform(scrollY, [0, 600], [0, 60]);
// il mark decorativo scende lentamente mentre scorri
```

**Contatore stats — count-up animation:**
Quando le stat card entrano in view, i numeri salgono da 0 al valore finale con `useSpring`.

**Sezione Cotto finale — clip reveal:**
```js
// La sezione sale da sotto con un clip-path che si apre
initial={{ clipPath: "inset(100% 0 0 0)" }}
whileInView={{ clipPath: "inset(0% 0 0 0)" }}
transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
```

**Cursore custom (desktop):**
Un cerchio piccolo (12px, bordo Cotto) che segue il cursore con `lerp` leggero. Su elementi cliccabili si espande a 36px e cambia fill.

---

## NOTE TECNICHE

- `next/font` per Fraunces e Inter (no Google Fonts CDN)
- `next/image` per tutti i placeholder immagini
- Componente `<Logo />` riutilizzabile con prop `variant="light" | "dark" | "color"`
- Tailwind `darkMode: false` — non serve dark mode
- Tutti i testi UI in italiano come da lexicon del brand
- `metadata` SEO in italiano: title `Studio Vetrina — Siti web su misura per Roma`, description dal boilerplate brand
- Responsive: mobile-first, breakpoints sm/md/lg/xl
- Deploy-ready su Vercel (nessuna env variable necessaria per la versione statica)

---

## QUALITÀ ATTESA

Il risultato deve sembrare un sito premium da €10.000, non un template. Ogni sezione deve avere ritmo visivo, spazio generoso, e le animazioni devono essere così fluide da sentirsi parte del contenuto, non decorazione. Pensa a come Apple presenta i prodotti: lo scroll *è* la narrazione.
