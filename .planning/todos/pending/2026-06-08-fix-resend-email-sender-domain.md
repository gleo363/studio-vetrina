---
created: 2026-06-08T12:42:33.696Z
title: Fix Resend email sender domain
area: general
files:
  - src/lib/email.ts
---

## Problem

Tutte le email inviate da Studio Vetrina usano `from: "Studio Vetrina <onboarding@resend.dev>"` che è il dominio test di Resend. I destinatari (sia lo studio che i partner) ricevono email con mittente `onboarding@resend.dev` invece di un indirizzo professionale come `noreply@vetrina.it`.

Rimandato perché il dominio `vetrina.it` non è ancora attivo — serve prima attivare il DNS.

## Solution

1. Quando `vetrina.it` è attivo: aggiungere il dominio in Resend dashboard → Settings → Domains → Add Domain → aggiungere i record DNS richiesti
2. Aggiornare il campo `from` in `src/lib/email.ts` (3 funzioni: `inviaEmailContatto`, `inviaEmailBenvenutoPartner`, `inviaEmailStatoSegnalazione`) con il nuovo indirizzo verificato (es. `noreply@vetrina.it`)
3. Aggiungere variabile `RESEND_FROM_EMAIL` su Vercel con il valore del nuovo indirizzo
4. Aggiornare anche i link hardcoded in `email.ts` (righe ~164, 182, 195) che puntano a `https://vetrina.it/partner/area-partner` — usare `process.env.NEXT_PUBLIC_SITE_URL`
