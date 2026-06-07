# Rapporto di Sicurezza — Studio Vetrina
**Data:** 2026-06-07  
**Revisore:** Claude Code (automatico)  
**Progetto:** studio-vetrina

---

## Riepilogo

### Stack rilevato
| Componente | Versione / Dettaglio |
|---|---|
| Framework | Next.js 16.2.7 (App Router) |
| Runtime | Node.js / Vercel Edge |
| Database | Supabase (PostgreSQL + Auth) |
| Email | Resend |
| Package manager | npm (package-lock.json presente) |
| Deploy | Vercel |
| Autenticazione | Supabase Auth (email/password) |

### Conteggio per gravità
| Gravità | Totale |
|---|---|
| 🔴 Critico | 0 |
| 🟠 Alto | 2 |
| 🟡 Medio | 4 |
| 🔵 Basso | 2 |
| ⚪ Informativo | 2 |

---

### 🚨 Azioni urgenti (da fare a mano)
1. **Verifica RLS Supabase**: accedi al dashboard Supabase → Table Editor → controlla che Row Level Security sia attiva su `partner` e `segnalazione`. Senza RLS la `anon key` permette a chiunque di leggere tutti i dati.
2. **NODE_TLS_REJECT_UNAUTHORIZED=0** rilevato nel processo Node (warning `npm audit`): rimuovi questa variabile dall'ambiente se è impostata nella macchina di sviluppo o in Vercel.

### ✅ Correzioni già applicate (categoria A)
- A-1: Header di sicurezza HTTP aggiunti a `next.config.ts`
- A-2: Flag `secure` aggiunto al cookie `vetrina_ref` in `src/proxy.ts`
- A-3: HTML escape dei campi utente nell'email in `src/lib/email.ts`

### ⚠️ Correzioni in attesa di approvazione (categoria B)
- B-1: Aumentare lunghezza minima password (da 6 a 8 caratteri)
- B-2: Rate limiting sul form contatti pubblico
- B-3: Content Security Policy (CSP) — policy di partenza fornita sotto
- B-4: Verifica RLS Supabase su tabelle `partner` e `segnalazione`

---

## Riscontri dettagliati

---

### 🟠 ALTO — HTML Injection nell'email di notifica
**Categoria OWASP:** A05 Injection  
**Dove:** `src/lib/email.ts` righe 28–37  
**Stato:** ✅ Corretto (A-3)

I campi `nome`, `attivita`, `email`, `telefono`, `messaggio` vengono interpolati direttamente nel template HTML dell'email senza escape. Un utente malevolo che submittasse `<img src=x onerror=...>` nel campo nome farebbe eseguire codice HTML arbitrario nel client email del destinatario (te), permettendo phishing visivo o furto di sessione se il client renderizza le immagini.

**Correzione applicata:** aggiunta funzione `escHtml()` che sostituisce `&`, `<`, `>`, `"` con le entità HTML corrispondenti, applicata a tutti i campi inseriti nel template.

---

### 🟠 ALTO — Form contatti pubblico senza anti-abuso
**Categoria OWASP:** A06 Progettazione insicura  
**Dove:** `src/app/actions/segnalazioni.ts` funzione `inviaContatto`  
**Stato:** ⚠️ Patch proposta (B-2)

L'endpoint pubblico `/contatti` accetta POST illimitati. Ogni invio: (1) inserisce una riga nel DB via `adminClient`, (2) invia un'email via Resend. Senza rate limiting un bot può esaurire la quota email Resend, riempire la tabella `segnalazione`, e rendere il form inutilizzabile.

**Patch proposta (B-2):** aggiungere Vercel Edge Rate Limiting oppure un controllo semplice via `headers()` dell'IP. Alternativa leggera: Turnstile (Cloudflare) lato client + verifica token lato server.

```typescript
// src/app/actions/segnalazioni.ts — aggiungere in cima a inviaContatto()
import { headers } from "next/headers";

const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
// soluzione semplice: Vercel KV o upstash/ratelimit
// oppure aggiungere Turnstile token nel form e verificarlo qui
```

---

### 🟡 MEDIO — Header di sicurezza HTTP assenti
**Categoria OWASP:** A02 Configurazione errata  
**Dove:** `next.config.ts`  
**Stato:** ✅ Corretto (A-1)

Mancavano `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Referrer-Policy`, `Permissions-Policy`. Senza questi header il browser permette clickjacking, MIME-sniffing e fuga di referrer verso siti terzi.

**Correzione applicata:** aggiunti 5 header di sicurezza in `next.config.ts` con `async headers()`.

---

### 🟡 MEDIO — Cookie `vetrina_ref` senza flag `secure`
**Categoria OWASP:** A02 Configurazione errata  
**Dove:** `src/proxy.ts` riga 8  
**Stato:** ✅ Corretto (A-2)

Il cookie di tracciamento referral era impostato senza `secure: true`, consentendo la trasmissione su HTTP non cifrato. Il flag `httpOnly` era già stato rimosso intenzionalmente per permettere la lettura da JS client.

**Correzione applicata:** aggiunto `secure: process.env.NODE_ENV === "production"` (attivo solo in prod, non rompe lo sviluppo locale).

---

### 🟡 MEDIO — Password minima 6 caratteri
**Categoria OWASP:** A07 Errori di autenticazione  
**Dove:** `src/app/actions/partner.ts` riga 28  
**Stato:** ⚠️ Patch proposta (B-1)

6 caratteri è sotto la soglia NIST (8 caratteri minimo). Aumentare non rompe logica esistente ma invalida la registrazione per password attualmente valide di 6-7 caratteri.

**Patch proposta (B-1):**
```typescript
// src/app/actions/partner.ts riga 28 — cambiare
if (password.length < 6) {
// in
if (password.length < 8) {
  return { errore: "La password deve essere di almeno 8 caratteri." };
```

---

### 🟡 MEDIO — RLS Supabase non verificabile da codice
**Categoria OWASP:** A01 Broken Access Control  
**Dove:** Dashboard Supabase — tabelle `partner`, `segnalazione`  
**Stato:** 🚨 Azione manuale richiesta

Il codice usa `createAdminClient()` (service_role key) per tutte le operazioni da Server Action, bypassando la RLS. Questo è corretto **solo se** la RLS è configurata come difesa di default e il codice filtra sempre per `user_id` / `partner_id`. L'unico rischio residuo è se qualcuno accedesse alla tabella direttamente via `anon key` (es. da browser con Supabase JS non tramite l'app).

**Verifica richiesta:**
1. Dashboard Supabase → Authentication → Policies
2. Conferma che `partner` abbia policy: `SELECT where user_id = auth.uid()`
3. Conferma che `segnalazione` non sia accessibile con anon key senza autenticazione

---

### 🔵 BASSO — Dipendenza vulnerabile (postcss in Next.js interno)
**Categoria OWASP:** A03 Catena di fornitura  
**Dove:** `node_modules/next/node_modules/postcss` (postcss < 8.5.10)  
**Stato:** ⚠️ Proposta (B-3 parziale)

CVE: XSS via `</style>` non escaped nell'output CSS. La fix tramite `npm audit fix --force` installerebbe Next.js 9.x (breaking change estremo). La vulnerabilità è nella pipeline di build di Next.js, non nel codice che viene servito agli utenti — rischio concreto molto basso.

**Proposta:** monitorare il rilascio di Next.js che aggiorna postcss internamente. Non applicare `--force`.

---

### 🔵 BASSO — Content Security Policy assente
**Categoria OWASP:** A02 Configurazione errata  
**Dove:** `next.config.ts`  
**Stato:** ⚠️ Patch proposta (B-3)

Nessuna CSP configurata. Una CSP restrittiva richiede test approfonditi (Framer Motion, font Google, Supabase potrebbero richiedere eccezioni). Fornisco una policy di partenza permissiva da restringere progressivamente:

**Policy di partenza (B-3) — aggiungere agli headers in `next.config.ts`:**
```typescript
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",  // unsafe-inline per Framer Motion
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.resend.com",
    "frame-ancestors 'none'",
  ].join('; ')
}
```
**Non applicare senza testare in staging** — `unsafe-inline` e `unsafe-eval` sono temporanei.

---

### ⚪ INFORMATIVO — Autenticazione admin via email match
**Categoria OWASP:** A01  
**Dove:** `src/app/actions/segnalazioni.ts:74`, `src/app/admin/page.tsx:21`

Il check admin `user.email !== process.env.ADMIN_EMAIL` è server-side e verificato tramite JWT Supabase. È funzionalmente sicuro perché Supabase non permette la registrazione di email duplicate. L'approccio alternativo (ruolo custom sulla tabella `partner`) sarebbe più robusto ma non urgente.

---

### ⚪ INFORMATIVO — CVE-2025-29927 (Next.js middleware bypass)
**Categoria OWASP:** A01  
**Dove:** `package.json` — Next.js 16.2.7

Next.js 16.2.7 è una versione successiva alle versioni vulnerabili (< 14.2.25 per 14.x, < 15.2.3 per 15.x). **Non vulnerabile a CVE-2025-29927.** ✓

---

## Scansioni eseguite

| Scansione | Risultato |
|---|---|
| `npm audit` | 2 vulnerabilità moderate (postcss in Next.js interno) |
| Segreti nel codice sorgente | Nessuno trovato ✓ |
| Variabili server in file client | Nessuna trovata ✓ |
| `console.log` con dati sensibili | Nessuno trovato ✓ |
| `dangerouslySetInnerHTML` | Nessuno trovato ✓ |
| `target="_blank"` senza `rel` | Nessuno trovato ✓ (già presente) |
| `.env*` in `.gitignore` | ✓ |
| `SUPABASE_SERVICE_ROLE_KEY` in file client | Non trovata ✓ |
| Next.js vs CVE-2025-29927 | Non vulnerabile ✓ |
