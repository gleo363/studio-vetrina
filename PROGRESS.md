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

## Da fare
- [ ] Fase 1.7 — CtaFinale: vignetta, freccia slide. Verifica homepage completa
  (screenshot 1440/390, reduced-motion, tastiera, console, trace).
- [ ] Fase 2 — Header (sottolineature, stato attivo, hairline) e Footer (reveal).
- [ ] Fase 3 — Pagine secondarie: studio, perché-sceglierci, galleria esempi,
  partner, contatti (solo presentazione), 404.
- [ ] Verifica finale: build, lighthouse, riepilogo prima/dopo.

## Note e autocritica

- Contrasto pietra su travertino ≈3:1: problema preesistente sul testo
  secondario, fuori scope animazioni — da valutare a parte.
- Cotto su travertino ≈4.2:1: ok per testo grande e icone, da evitare su
  testo sotto i 16px.
