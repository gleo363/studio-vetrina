# Revamp UI & Animazioni — Avanzamento

Obiettivo: alzare il livello di esecuzione (animazioni, micro-interazioni, ritmo
visivo) senza cambiare l'identità del marchio. Piano completo approvato in
sessione del 12 giugno 2026.

**Fuori scope:** le 4 vetrine demo (`/esempi/ristorante|salone|bottega|studio`),
file sensibili (proxy, server actions, Supabase/auth, logica form), transizioni
di pagina via `template.tsx` (scelta: continuità con entrate per-pagina coerenti).

---

## Fatto

### Fase 0 — Fondamenta (in corso)
- [x] `src/lib/motion.ts`: easing condiviso `EASE_VETRINA`, scala durate
  (micro 0.2 / breve 0.35 / base 0.5 / rivelo 0.8 / scena 1.2), varianti
  `fadeUp`, `riveloMascherato`, `riveloLinea`, `contenitoreStagger`.
- [x] `MotionProvider` con `MotionConfig reducedMotion="user"` agganciato al
  layout (resta server component). Guardie locali dove MotionConfig non copre:
  cursore (`return null`), parallasse e contatori a seguire.
- [x] `globals.css`: variabile `--color-linea`, `--ease-vetrina`, focus visibile
  cotto, `::selection` ocra, fallback CSS `prefers-reduced-motion`, utility
  `.alone-ocra`/`.alone-cotto` (profondità tenue), `.link-sottolineato`, `.freccia`.
- [x] Primitivi estesi retro-compatibili: `AnimatedSection` (prop `y`, `duration`),
  `StaggerCards` (prop `stagger`, `delayChildren`), `Button` (scale 1.02,
  freccia con micro-slide automatica sui testi che terminano con "→").
- [x] `CustomCursor`: disattivato con `prefers-reduced-motion`.

### Fase 1.1 — Hero (fatto)
- [x] Ingresso orchestrato: eyebrow (0s) → righe h1 con reveal mascherato
  "nella cornice" (0.15/0.27s) → subline corsiva (0.65s) → CTA in stagger
  (0.85s) → watermark in sola dissolvenza (0.3→1.5s).
- [x] Parallasse di uscita con range collassati sotto `prefers-reduced-motion`
  (i range condizionali evitano il mismatch di hydration — bug trovato e
  corretto in verifica: lo `style` condizionale produceva HTML diverso
  tra server e client).
- [x] Texture `.alone-ocra` sulla sezione.
- Verificato: screenshot 1440/390, reduced-motion emulato (contenuto sempre
  visibile, zero errori console), solo avviso CSP report-only preesistente
  dello script Analytics in dev.
- Autocritica: l'ingresso è sobrio e coerente col concept "in mostra nella
  vetrina"; l'alone ocra dà profondità senza sporcare il travertino.

### Fase 1.2-1.3 — TransizioneScroll e SezioneProblema (fatto)
- [x] ContainerScroll: card piatta con `prefers-reduced-motion` (guardia
  attivata dopo il mount per evitare mismatch di hydration: la card parte
  ruotata), bezel e ombre riallineati alla palette (inchiostro al posto
  di grigi e neri fuori palette).
- [x] TransizioneScroll: titolo con reveal mascherato condiviso (stessa
  regia della hero).
- [x] SezioneProblema: CountUp con guardia reduced-motion (valore finale
  immediato) e durata da token `scena`; motivo "mensola" ocra sotto i
  numeri (riveloLinea in stagger); alone-cotto tenue sulla sezione scura.
- Verificato: screenshot desktop su entrambe le sezioni, contatori e
  mensole corretti, zero errori console.

### Fase 1.4-1.6 — Card homepage (fatto)
- [x] SezioneSoluzione: `border-linea` a riposo (profondità "cornice"),
  numero 01/02/03 pietra→cotto su hover (CSS group-hover, solo colore).
- [x] SezioneTarget: `border-linea`, icona lucide che sale di 2px e passa
  a cotto su hover (motion-safe).
- [x] SezioneServizi: card "Completa" entra con scale 0.985→1; voci del
  listino che "si compongono" in stagger 0.04; "✓" testuale → icona Check
  di lucide; bordo linea sulle card chiare; easing/durate dai token.
- Verificato: screenshot desktop, controllo programmatico di classi hover,
  15 icone Check, 4 frecce con micro-slide.
- Nota: label "Più scelto" cotto su inchiostro ≈3.7:1 a 12px — borderline,
  preesistente; segnalato qui, non tocco i colori (vincolo di palette).

### Fase 1.7 — CtaFinale + verifica homepage (fatto)
- [x] Vignetta inchiostro tenue sul campo cotto (utility `.vignetta-inchiostro`),
  freccia con micro-slide nel bottone, easing/durate dai token.
- [x] **Bug preesistente trovato e corretto**: il reveal in clip-path del
  titolo non partiva mai — l'IntersectionObserver di Chrome calcola il
  ratio sull'area visibile dopo il clip, quindi un elemento clippato al
  100% con `amount: 0.4` resta in deadlock. Trigger spostato sul
  contenitore, titolo e bottone come varianti figlie.
- Verifica homepage completa: CLS 0.00 su scroll completo (trace), nessun
  long task, zero errori console, focus cotto visibile da tastiera,
  nessun overflow orizzontale a 390px.

### Fase 2 — Header e Footer (fatto)
- [x] Header: link desktop con `.link-sottolineato` + stato attivo via
  `usePathname` (sottolineatura ferma sul percorso corrente, animata su
  hover/focus), fade del lockup al mount (solo opacity), hairline
  `border-b border-linea` allo scroll, voci drawer mobile in stagger 0.05,
  `aria-expanded` sull'hamburger.
- [x] Footer: resta server component, contenuto avvolto in `AnimatedSection`
  (reveal morbido), link `.link-sottolineato` (CSS puro), hairline superiore,
  alone-cotto tenue; tagline come ultimo elemento a comparire (delay 0.3).

### Fase 3 — Pagine secondarie (fatto)
- [x] /studio: h1 con reveal mascherato per riga, processo 01–04 da
  `delay={i*0.1}` a StaggerContainer + linea "mensola" animata; alone-ocra.
- [x] /perche-sceglierci: righe tabella in stagger 0.06; mockup confronto
  convertiti a varianti figlie di un contenitore (fix clip-path/observer);
  CTA finale con stesso fix + vignetta + freccia.
- [x] GalleriaEsempi: hover "cornice" (ring linea→inchiostro/30 + scale 1.02
  della sola anteprima dentro overflow-hidden), freccia su "Visita la
  vetrina"; CTA finale con fix clip-path + vignetta.
- [x] /partner: convertito a client component; h1 reveal mascherato (incluso
  l'`<em>`), step 01–03 con motivo mensola + border-linea, alone-ocra,
  vignetta sulla CTA, link "Accedi" sottolineato.
- [x] /contatti: SOLO presentazione (logica `useActionState`/action intatta);
  h1 reveal mascherato, eyebrow in fade; emoji "☕" → icona lucide `Coffee`.
- [x] /not-found: watermark logo opacità 0.05 + alone-ocra.
- Verificato: screenshot desktop di studio, perché-sceglierci (CTA finale
  rivelata), galleria, partner, contatti, 404; tsc + eslint puliti sui file
  toccati.

### Verifica finale (fatto)
- [x] `npm run build`: pulito. 25 route, TypeScript ok, 0 errori, 0 warning di
  lint. Homepage prerenderizzata statica.
- [x] Performance (trace su build di produzione, server `next start`):
  **LCP 1543 ms** (fascia "buono", <2500 ms), **CLS 0.00**. Il render delay
  è quasi tutto l'ingresso orchestrato della hero (effetto richiesto dal
  brief). Leva se servisse abbassarlo: accorciare delay/durata del reveal
  del titolo, o renderlo già visibile in SSR.
- [x] **Lighthouse desktop**: Accessibilità **96**, Best Practices **96**,
  SEO **100**.
- [x] Reduced-motion sul build di produzione: hero ferma e visibile,
  contatori al valore finale immediato, CTA in clip-path rivelata (opacity 1).

## Note e autocritica (questioni preesistenti, fuori scope animazioni)

I due audit Lighthouse non superati NON derivano da questo lavoro:
- **errors-in-console**: 404 su `/_vercel/insights/script.js` — artefatto
  solo locale (`next start` fuori da Vercel non serve lo script Analytics
  iniettato dall'edge). Sul deploy reale non si verifica.
- **color-contrast**: travertino su cotto = **4.21:1** a 14px (bottoni
  primari), appena sotto il 4.5:1 AA per testo piccolo. È la tensione
  intrinseca tra i due colori del marchio (bloccati dal brief, che la segnala
  esplicitamente). Possibili leve, da decidere con il cliente: testo dei
  bottoni ≥18px (passa come "testo grande") oppure cotto leggermente più
  scuro solo per lo sfondo dei bottoni. Non modificato senza via libera.
- Contrasto pietra su travertino ≈3:1 sul testo secondario: preesistente,
  da valutare a parte.
