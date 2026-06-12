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

## Da fare

- [ ] Fase 1.1 — Hero: ingresso orchestrato (eyebrow → righe h1 mascherate →
  subline → CTA → watermark), parallasse dietro guardia, texture alone-ocra.
- [ ] Fase 1.2 — TransizioneScroll/ContainerScroll: guardia reduced-motion,
  bezel e ombre in palette inchiostro, titolo con reveal mascherato.
- [ ] Fase 1.3 — SezioneProblema: CountUp con guardia, motivo "mensola" ocra,
  alone-cotto.
- [ ] Fase 1.4-1.6 — Card homepage: border-linea, hover caratterizzati
  (numeri, icone), listino servizi che "si compone", Check lucide.
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
