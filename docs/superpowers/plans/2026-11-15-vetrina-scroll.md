# "La vetrina che si accende": piano di implementazione

> **Per chi esegue:** skill obbligatoria superpowers:executing-plans (scelta dall'utente). Passi con checkbox `- [ ]`. Rispettare i CHECKPOINT: a ogni checkpoint ci si ferma e si aspetta l'ok.

**Obiettivo:** sulla home, una sezione fissa a schermo lunga 300 lvh che ingloba l'Hero. Il primo fotogramma è lo sfondo dell'Hero, poi la saracinesca sale, la camera entra fino al laptop e lo schermo diventa la vera SezioneProblema, senza salti.

**Architettura:** `SezioneVetrina` (client, renderizzata anche sul server) contiene lo stage sticky con l'immagine di copertina in `<picture>`, l'Hero e la grana. Dopo l'idratazione monta con `next/dynamic` (ssr:false) `SequenzaVetrina`: canvas, caricatore dei fotogrammi e una copia viva di SezioneProblema proiettata nello schermo con matrix3d. La vera SezioneProblema si sovrappone agli ultimi 100 lvh della sezione: quando il progresso arriva a 1, la copia è identica pixel per pixel e lo stage si nasconde.

**Stack:** Next 16.2.9 App Router, React 19.2, Framer Motion 12 (useScroll, useSpring, useTransform), Tailwind 4, ffmpeg 8 (libaom/libsvtav1, libwebp), sharp (già in node_modules), ElevenLabs MCP (Veo 3.1), `node --test` (Node 26, TS nativo), Playwright (nuova devDependency per gli script di verifica), Chrome DevTools MCP.

**Spec:** il brief dell'utente in questa sessione, più le 3 decisioni prese al brainstorming (sotto). Al Task 0 il piano viene salvato nel repo in `docs/superpowers/plans/2026-11-15-vetrina-scroll.md`, così chi esegue ha brief e decisioni nello stesso file.

## Decisioni prese al brainstorming (approvate dall'utente)
1. **Copia viva, non screenshot.** Nello schermo del laptop va una seconda istanza di `<SezioneProblema />`, impaginata alla larghezza reale della finestra (stage = `100% × 100lvh`) e proiettata con matrix3d sui 4 angoli. Coincide al pixel a qualunque misura. Esiste solo nel componente dinamico, quindi non finisce nell'HTML del server; ha `aria-hidden` e `inert`. Playwright serve solo per le verifiche.
2. **Verticale con lo schermo al ~70% della larghezza del fotogramma 9:16**, così su un telefono 9:19,5 appare largo circa l'85% di ciò che si vede, con gli angoli sempre dentro.
3. **Zoom finale = zoom uniforme + luce che cresce.** Ingrandimento uniforme attorno a un punto fisso finché lo schermo è largo quanto la finestra; intanto la fascia visibile della copia passa dall'altezza dello schermo a 100 lvh. Su computer è in pratica uno zoom puro.

## Scelte mie (correggibili)
- **Colori dell'Hero sulla foto scura:** h1 e sottotitolo in travertino (sottotitolo all'80%), occhiello "Studio Vetrina · Roma" in travertino al 70%. Il pulsante primario resta cotto. Il pulsante ghost usa una nuova variante `ghost-chiaro` (bordo travertino/35, testo travertino). Velatura inchiostro/55 → 0 dal lato del testo per il contrasto, anello di focus travertino dentro l'Hero. Testi invariati.
- **Il watermark del logo esce dall'Hero:** è decorazione e sulla foto peserebbe come un timbro.
- **Posizione del testo:** su computer allineato a sinistra e centrato in verticale, come ora. Su verticale sale nella parte alta. K1 lascia lo spazio negativo a sinistra (16:9) e in alto (9:16).
- **L'Header resta com'è** (barra travertino 88% con sfocatura, fuori ambito). Lo vedrai nelle prove del CP3; se la sfocatura sopra il canvas fa perdere fotogrammi, mi fermo e te lo dico.
- **Insieme di fotogrammi:** `(orientation: portrait)` → telefono, altrimenti computer. La stessa media query vale per `<source>`, quindi niente doppio download. Se l'orientamento cambia a metà, si passa all'altro insieme (caso raro e voluto da chi gira il telefono).
- **Copertina fuori da `/sequenza-vetrina/`:** sta in `public/vetrina-copertina/` (AVIF più fallback WebP). Così il criterio 7 vale anche con reduced-motion. Il caricatore usa l'`<img>` della copertina come fotogramma 0 invece di riscaricarlo.
- **Niente `preload()` o `<link rel=preload>`:** l'`<img fetchPriority="high">` è nell'HTML iniziale e lo scanner lo trova subito. Un hint nel payload RSC partirebbe anche durante il prefetch di "/" dalle altre pagine e violerebbe il criterio 7.
- **Grana statica:** tassello SVG feTurbulence in data URI, opacità 0,05, nessun blend mode. Sfuma a 0 tra p 0,92 e 1, così al passaggio la SezioneProblema è pulita.
- **Video:** Veo 3.1 (`veo-3.1-generate-001`): primo e ultimo fotogramma, 9:16, 1080p, 8 s, `generate_audio: false`. **Fotogrammi chiave:** `gemini-3-pro-image` (Nano Banana Pro), il modello indicato per tenere coerente lo stesso luogo tra più scatti. K2 e K3 vengono generati con K1 come riferimento; i 9:16 con il loro 16:9 come riferimento, ricomposti e non ritagliati. Risoluzione 2K.
- **`media-src/`** va in `.gitignore`: mp4 e PNG master restano su disco (OneDrive).
- **Tutto su un branch `feat/scena-vetrina`**, commit locali e nessun push. L'anteprima si pubblica con la CLI Vercel (progetto già collegato in `.vercel/`).

## Vincoli globali
- Sezione: `h-[300lvh]`, stage `sticky top-0 h-lvh`. Progresso calcolato a mano: `p = clamp((scrollY − topSezione) / (altezzaSezione − altezzaStage), 0, 1)` (non `offset: end end`, che usa innerHeight e sbaglia con la barra del browser mobile).
- La vera SezioneProblema va avvolta in page.tsx da `<div className="relative z-0 -mt-[100lvh] motion-reduce:mt-0">` e la sezione animata ha `relative z-10`. Il componente SezioneProblema non si tocca.
- **Tempi** (costanti `TEMPI` in `sequenza.ts`): titolo esce p 0 → 0,10 · clip 1 s 0 → 0,45 · clip 2 s 0,45 → 0,92 · ultimo fotogramma fermo s 0,92 → 1 · copia nello schermo s 0,85 → 0,92 (dissolvenza su angoli per fotogramma) · zoom p 0,92 → 1,00 · stage nascosto per p ≥ 1. `s` = progresso con spring (fotogrammi e angoli), `p` = progresso grezzo (titolo, zoom, passaggio).
- Uscita del titolo: opacità 1 → 0 e y 0 → −32 px, ease `[0.25, 0.46, 0.45, 0.94]` (`EASE_VETRINA`).
- Spring leggero: `useSpring(p, { stiffness: 170, damping: 32, mass: 0.6, restDelta: 0.0005 })`.
- Fotogrammi: computer 120 (≈1920×1080), telefono 100 (≈506×900). Ripartizione per segmento: computer 59 + 61, telefono 49 + 51. Nomi `0001`… Tetti: computer ≤ 7 MB, telefono ≤ 3,5 MB, copertina ≤ 150 KB / ≤ 80 KB.
- Densità risultante: 1800 px / 120 = 15 px per fotogramma (computer 900 px), 1688 / 100 ≈ 17 px (telefono). Rientra nelle linee guida (10-20 px).
- Video: tetto rigido di 4 generazioni, `generations_count: 1`, mai ripetere una chiamata. Immagini: al massimo 2 giri, il terzo solo se l'utente lo chiede.
- Nessuna persona, volto, scritta, logo o lettera nei fotogrammi.
- Reduced-motion: sezione `motion-reduce:h-svh`, solo copertina K1 più Hero, nessun download da `/sequenza-vetrina/`, SezioneProblema subito dopo (`motion-reduce:mt-0`).
- Per fotogramma nessun setState React: solo ref, `motion value.on("change")` e un unico rAF per cambio.
- AGENTS.md: prima di scrivere codice si leggono le guide Next pertinenti in `node_modules/next/dist/docs/` (lazy-loading, image, client components).

## Punti da sorvegliare
1. **Ricarica con lo scroll a metà o oltre la sezione:** lo stage mostra subito lo stato giusto (copertina finché il primo fotogramma utile non è decodificato), e il caricatore parte dai fotogrammi vicini a quello corrente. Test: `ordineCaricamento` con indice di partenza.
2. **Risalita oltre il passaggio:** per p < 1 lo stage ricompare all'identità, senza lampi. Test E2E nel criterio 5, in entrambi i versi.
3. **Ridimensionamento o rotazione a metà scroll:** canvas e angoli ricalcolati, nessuno spostamento del layout; con la rotazione si cambia insieme di fotogrammi. Test: `adattaCopertura` con più rapporti; E2E con resize in `verifica.mjs`.
4. **Finestre molto larghe o quasi quadrate (21:9, 1:1):** lo schermo può uscire in parte dall'inquadratura ma lo zoom finisce comunque all'identità. Test: `angoliZoom(1, …)` uguale al rettangolo della finestra, per 21:9, 1:1 e 9:19,5.
5. **Rete lenta o fotogramma mancante:** si mostra il più vicino già decodificato, mai un canvas vuoto. Senza AVIF, solo l'immagine statica. Test: `piuVicinoCaricato`.
- Limite noto: con uno scroll velocissimo (meno di ~1,5 s tra l'entrata della SezioneProblema reale e il passaggio), i suoi contatori potrebbero non aver finito di contare. La copia viene montata subito e finisce prima. Non si risolve senza toccare SezioneProblema, quindi lo accetto e lo segnalo.

---

### Task 0: misure di partenza e branch
**File:** Create `docs/superpowers/plans/2026-11-15-vetrina-scroll.md` (copia di questo piano) · Modify `.gitignore` (aggiunge `media-src/`, `.verifiche/`)
- [ ] `git switch -c feat/scena-vetrina`. Non includere `CLAUDE.md` e `docs/scroll-animation-linee-guida.md`, già modificati dall'utente e non committati.
- [ ] `npm run build && npm start`. Con Chrome DevTools MCP: emulazione telefono (Moto G-class, CPU ×4, rete "Slow 4G"), traccia di caricamento della home → **LCP e CLS di partenza**. Lighthouse mobile → **punteggio accessibilità di partenza**. Salva numeri e file in `.verifiche/partenza/`.
- [ ] Commit: piano, `.gitignore`.

### Task 1: fotogrammi chiave su ElevenLabs → CHECKPOINT 2
- [ ] `creative_create_flow` ("Vetrina che si accende"). Il `flow_id` va annotato in `media-src/vetrina-scroll/flow.txt` e usato per tutto.
- [ ] `creative_get_model_guide` per `gemini-3-pro-image`. Nei prompt, in inglese: tutte le parti di look e color correction del brief, le esclusioni in forma positiva ("plain unlettered sign", "a street with no people") e la composizione con lo spazio negativo indicato sopra.
- [ ] K1 16:9 → scelgo io la variazione migliore → fisso con `creative_add_flow_asset_node` → K2 e K3 16:9 con K1 come riferimento → K1, K2, K3 9:16 con il rispettivo 16:9 come riferimento (in K3 lo schermo è al ~70% della larghezza). Lo schermo di K3 è acceso, caldo, uniforme e vuoto, parallelo al sensore.
- [ ] Scarico le immagini in `media-src/vetrina-scroll/chiavi/`.
- [ ] **CHECKPOINT 2:** ti mostro K1, K2 e K3 nei due formati, con i prompt usati. Nessun credito video prima del tuo ok. Se il primo giro non va, faccio il secondo; per un terzo te lo chiedo.

### Task 2: video (4 generazioni, dopo l'ok)
- [ ] Clip 1 16:9: start K1, end K2, camera ferma, la saracinesca sale con velocità costante per tutti gli 8 s. Prompt con la struttura Veo (ripresa, soggetto, azione, contesto, look), `negative_prompt` con scritte, loghi, persone, riflessi sullo schermo e grana. Attendo con `creative_get_flow_run_status`, poi fisso la versione con `creative_add_flow_asset_node`.
- [ ] Estraggo l'ultimo fotogramma reale della clip 1 con `ffmpeg -sseof -0.05 -i clip1.mp4 -frames:v 1 ultimo.png` e lo carico nel flow (`creative_create_asset_upload` → PUT → `creative_finalize_asset_upload`).
- [ ] Clip 2 16:9: start = ultimo fotogramma reale, end K3. Carrellata lenta e regolare attraverso il vetro, senza riflessi sullo schermo, camera ferma nell'ultimo secondo.
- [ ] Stessa cosa per il 9:16 (clip 1 e clip 2). In totale 4 chiamate, nessuna ripetuta. Se un risultato non va: mi fermo e ti chiedo.
- [ ] Scarico in `media-src/vetrina-scroll/video/`. Se il connettore non dà un file scaricabile, mi fermo e ti chiedo di scaricarlo dal flow.

### Task 3: pipeline dei fotogrammi
**File:** Create `scripts/vetrina/fotogrammi.mjs`, `scripts/vetrina/angoli-schermo.mjs`, `scripts/vetrina/pesi.mjs`
- [ ] `fotogrammi.mjs --formato desktop|mobile [--campione 12]`: ffmpeg estrae i master PNG in `media-src/vetrina-scroll/master/<formato>/` (clip 2 senza il primo fotogramma, che è un duplicato) e campiona a intervalli regolari per segmento (59+61 / 49+51). Ridimensiona a 1920×1080 o 506×900. Codifica con sharp in AVIF e in WebP con qualità calibrata su SSIM ≥ 0,97 rispetto al master, e sceglie il formato più leggero. Scrive `public/sequenza-vetrina/<formato>/0001.<ext>…` e la copertina (fotogramma 1, qualità più alta, AVIF più WebP) in `public/vetrina-copertina/<formato>.{avif,webp}`.
- [ ] `angoli-schermo.mjs --formato …`: per i fotogrammi con s ≥ 0,85 fa una soglia di luminanza, prende la regione chiara connessa più grande e ricava i 4 angoli dagli estremi di x+y e x−y. Scrive `src/components/home/vetrina/dati/<formato>.json` → `{ fotogrammi, larghezza, altezza, estensione, angoli: { "<indice>": [[x,y]×4 TL,TR,BR,BL] } }` e PNG di controllo con il quadrilatero disegnato sopra, in `.verifiche/angoli/`. Se il rilevamento sbaglia, correzione a mano nel JSON.
- [ ] `pesi.mjs`: elenca file e dimensioni, somma i totali ed esce con codice ≠ 0 se un tetto è superato.
- [ ] Prima solo il campione: 12 fotogrammi per formato più gli ultimi fotogrammi con i loro angoli, non committati.

### Task 4: geometria e sequenza (funzioni pure, TDD)
**File:** Create `src/components/home/vetrina/geometria.ts`, `src/components/home/vetrina/sequenza.ts`, `src/components/home/vetrina/__tests__/geometria.test.ts`, `src/components/home/vetrina/__tests__/sequenza.test.ts` · Modify `package.json` (`"test": "node --test src/components/home/vetrina/__tests__/"`), `tsconfig.json` (`allowImportingTsExtensions: true`)

**Interfacce prodotte:**
- `type Punto = [number, number]; type Quad = [Punto, Punto, Punto, Punto]` (TL, TR, BR, BL)
- `adattaCopertura(fw, fh, vw, vh): { scala: number; dx: number; dy: number }`: come object-fit cover.
- `fotogrammaInFinestra(q: Quad, a: ReturnType<typeof adattaCopertura>): Quad`
- `matrice3d(da: Quad, a: Quad): number[]`: omografia 4 punti → 16 valori column-major per `matrix3d()`.
- `angoliZoom(t: number, schermo: Quad, vw: number, vh: number): Quad`: dove sta la fascia della copia al tempo t dello zoom. Usa k(t) = k1^t attorno al punto fisso di G1, con k1 = vw / larghezzaSchermo e il residuo prospettico interpolato a 0. L'altezza della fascia h_c(t) va da `vw·altezzaSchermo/larghezzaSchermo` a `vh`.
- `altezzaFascia(t, schermo, vw, vh): number`
- `indiceFotogramma(s: number, n: number, n1: number): number`: n1 fotogrammi della clip 1 su [0, 0,45], gli altri su [0,45, 0,92], fermo dopo 0,92.
- `angoliPerProgresso(s, dati): Quad | null`: interpolazione lineare tra gli angoli dei due fotogrammi vicini; `null` sotto 0,85.
- `ordineCaricamento(n: number, chiavi: number[], partenza?: number): number[]`: prima le chiavi (0, confine tra le clip, ultimi), poi i punti medi per bisezione; con `partenza` prima i vicini.
- `piuVicinoCaricato(i: number, pronti: ReadonlySet<number>): number | -1`
- `TEMPI` (valori dei Vincoli globali).

- [ ] Test (che falliscono):
  - `adattaCopertura(1920,1080,390,844)` → scala 844/1080, dx < 0, dy = 0.
  - `matrice3d(Q,Q)` ≈ identità (1e-9); i 4 angoli mappati da `matrice3d(rett, quad)` coincidono con quad (1e-6).
  - `angoliZoom(1, schermo, vw, vh)` = `[[0,0],[vw,0],[vw,vh],[0,vh]]` (1e-6) per 1440×900, 2560×1080, 1000×1000, 390×844.
  - `angoliZoom(0, …)` = quad dello schermo (prima riga della fascia).
  - `indiceFotogramma(0,120,59)` = 0; `(0.45,120,59)` = 59; `(0.92,120,59)` = `(1,120,59)` = 119; monotono non decrescente su 1000 campioni.
  - `ordineCaricamento(120,[0,59,119])` è una permutazione di 0..119 che inizia con le chiavi.
  - `piuVicinoCaricato(10, {3, 14})` = 14; set vuoto → −1.
- [ ] `npm test` → FAIL. Implementazione. `npm test` → PASS. `npx tsc --noEmit` pulito.
- [ ] Commit.

### Task 5: componenti (sviluppati sul campione)
**File:** Create `src/components/home/vetrina/SezioneVetrina.tsx`, `src/components/home/vetrina/SequenzaVetrina.tsx`, `src/components/home/vetrina/caricatore.ts` · Modify `src/components/home/Hero.tsx`, `src/components/ui/Button.tsx`, `src/app/globals.css` (classe `.grana-vetrina`)

**Interfacce:**
- `SezioneVetrina()` ("use client"): `<section ref className="relative z-10 h-[300lvh] motion-reduce:h-svh">`; dentro, lo stage sticky (`bg-inchiostro overflow-hidden`) con `<picture>` (source `(orientation: portrait)` AVIF e WebP, img AVIF/WebP desktop, `fetchPriority="high"`, `alt=""`, `aria-hidden`, absolute inset-0 object-cover), poi `<SequenzaDinamica progresso={p} />`, `<Hero progresso={p} />` e la grana. Calcola `p: MotionValue<number>` (`useScroll().scrollY` più misure della sezione via ResizeObserver).
- `SequenzaDinamica`: `dynamic(() => import("./SequenzaVetrina"), { ssr: false })`, montata solo se non c'è `prefers-reduced-motion`, se c'è il supporto al formato scelto e dopo `requestIdleCallback` (fallback: setTimeout 200 ms) successivo al load.
- `SequenzaVetrina({ progresso, copertina: RefObject<HTMLImageElement> })`: canvas `aria-hidden` con `data-fotogramma`; backing = min(css × dpr, risoluzione del fotogramma); `useSpring`; un rAF per cambio; disegno in cover. Copia viva: `<div aria-hidden inert>` di dimensione stage, montata in idle, con opacità 0 all'identità finché s < 0,85 (così le sue animazioni d'entrata partono e finiscono subito), poi matrix3d su `angoliPerProgresso` o `angoliZoom` e dissolvenza in entrata, dentro un involucro `overflow:hidden` alto `altezzaFascia`. Canvas: `transform` = G(t) durante lo zoom. Per p ≥ 1 lo stage passa a `visibility:hidden`.
- `class Caricatore { constructor(base: string, dati, copertina: HTMLImageElement); avvia(partenza: number): void; bitmap(i: number): ImageBitmap | null; vicino(i: number): number; chiudi(): void }`: fetch → blob, concorrenza 6, AbortController. Finestra di bitmap decodificate ±8 (computer) o ±12 (telefono) attorno al corrente con `createImageBitmap`, e `close()` fuori finestra. Il fotogramma 0 è la copertina.
- `Hero({ progresso }: { progresso: MotionValue<number> })`: diventa un `<div>` assoluto nello stage; via `useScroll` e watermark; opacità e y da `progresso` [0, 0,10] con `EASE_VETRINA` (fermi con reduced-motion, come lo schema attuale); entrata al caricamento invariata; colori e layout come nelle "Scelte mie"; testi identici.
- `Button`: nuova variante `"ghost-chiaro"`, il resto invariato.
- [ ] Leggere prima `node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md` e la parte client components.
- [ ] Prova provvisoria: monto `SezioneVetrina` al posto di `<Hero />` in page.tsx, con il campione in `public/` non committato.
- [ ] **Prova della transizione** su `npm run dev`, a 1440×900 e 390×844: screenshot a p 0,88 (prima), 0,96 (durante), 1,00 (dopo).
- [ ] **CHECKPOINT 3:** ti mostro 10-12 fotogrammi distribuiti per formato, i PNG di controllo degli angoli, i 3 scatti della transizione per formato e il confronto AVIF/WebP con i pesi stimati. Aspetto l'ok.

### Task 6: sequenza completa e integrazione in home (dopo l'ok)
**File:** Modify `src/app/page.tsx` · Create `public/sequenza-vetrina/**`, `public/vetrina-copertina/**`, `src/components/home/vetrina/dati/*.json`
- [ ] `node scripts/vetrina/fotogrammi.mjs --formato desktop` e `mobile`, poi `angoli-schermo.mjs` per entrambi, poi `node scripts/vetrina/pesi.mjs` → exit 0.
- [ ] page.tsx: tolgo import e montaggio di `Hero` e di `TransizioneScroll` (il file resta), monto `<SezioneVetrina />` e avvolgo `<SezioneProblema />` nel div con margine negativo dei Vincoli globali. Il resto della home resta identico.
- [ ] `npm test`, `npx tsc --noEmit`, `npm run lint`, `npm run build` → tutti senza errori.
- [ ] Commit (fotogrammi, JSON, componenti, page.tsx).

### Task 7: verifiche → CHECKPOINT 4
**File:** Create `scripts/vetrina/verifica.mjs` · Modify `package.json` (devDependency `playwright`)
- [ ] `verifica.mjs` (Playwright, Chromium già in cache, su `next start`):
  - **C4:** p 0/0,25/0,5/0,75/1 in avanti e poi all'indietro, a 1440×900 e 390×844; attesa che `data-fotogramma` resti fermo per 500 ms; stesso `data-fotogramma` nei due versi e diff screenshot < 0,5% (sharp, pixel con Δ > 16).
  - **C5:** screenshot a scroll di passaggio − 1 px e a scroll di passaggio, diff < 1%, in tutti e due i versi e alle due misure.
  - **C7:** registra le richieste visitando `/esempi`, `/studio`, `/perche-sceglierci`, `/qa`, `/contatti`, `/partner` (con l'header visibile, quindi col prefetch di "/"): zero URL con `/sequenza-vetrina/`. Home con `reducedMotion: "reduce"`: zero.
  - Più resize 1440 → 1024 → 1440 a metà sezione senza errori in console.
- [ ] **C1, C2:** stessa misura del Task 0 sulla nuova build → LCP ≤ 2,5 s e ≤ partenza + 200 ms; CLS ≤ 0,01. Skill debug-optimize-lcp se serve.
- [ ] **C3:** tracce DevTools durante uno scroll scriptato avanti e indietro, telefono (CPU ×4) e computer. Long task > 50 ms durante lo scroll = 0; fotogrammi persi < 5% (rAF con PerformanceObserver `long-animation-frame`). Tracce salvate in `.verifiche/tracce/`.
- [ ] **C6:** output di `pesi.mjs`. **C8:** Lighthouse accessibilità ≥ partenza, più skill a11y-debugging (tastiera sull'Hero, focus visibile sopra la foto, canvas e copia esclusi dall'albero di accessibilità). **C9:** test, typecheck, lint, build.
- [ ] Agente `vercel:performance-optimizer` sulla home, poi superpowers:verification-before-completion e la skill code-review sul diff del branch. Correggo ciò che viene confermato.
- [ ] **CHECKPOINT 4:** tabella dei 10 criteri con numeri e percorsi delle prove (screenshot, tracce, elenco pesi). Aspetto l'ok.

### Task 8: anteprima Vercel
- [ ] Skill `vercel:deploy` (anteprima, non produzione) → ti do il link. Controllo rapido del link: la home carica e su `/esempi` non c'è nessuna richiesta a `/sequenza-vetrina/`.
