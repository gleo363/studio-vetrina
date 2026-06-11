# Rapporto di Sicurezza — Studio Vetrina
**Data:** 2026-06-11
**Revisore:** Claude Code (automatico)
**Progetto:** studio-vetrina
**Rapporto precedente:** RAPPORTO-SICUREZZA-2026-06-07.md (le correzioni A-1, A-2, A-3 risultano applicate e mantenute)

---

## Riepilogo

### Stack rilevato
| Componente | Dettaglio |
|---|---|
| Framework | Next.js 16.2.7 → **aggiornato a 16.2.9** (App Router, Turbopack) |
| Database / Auth | Supabase (PostgreSQL + Auth, RLS definita in `supabase/schema.sql`) |
| Email | Resend |
| Monitoring | Sentry (client + server + edge), Vercel Analytics, GA4 |
| Package manager | npm (package-lock.json) |
| Deploy | Vercel |
| Pagamenti | Nessun pagamento online; commissioni partner calcolate lato server |

### Conteggio per gravità
| Gravità | Totale |
|---|---|
| 🔴 Critico | 0 |
| 🟠 Alto | 1 |
| 🟡 Medio | 4 |
| 🔵 Basso | 3 |
| ⚪ Informativo | 4 |

### Scansioni eseguite
| Scansione | Esito |
|---|---|
| `npm audit` | 2 moderate (postcss bundled in Next — vedi riscontro dedicato, **nessun fix sicuro disponibile**) |
| Segreti nella cronologia git (10 commit, scan manuale a pattern: AWS, chiavi private, JWT, `sk_live_`, `sntrys_`) | ✅ Pulita — nessun segreto mai committato. gitleaks/trufflehog non installati sulla macchina: usato fallback manuale con `git grep` su tutte le revisioni |
| File `.env*` tracciati da git (presente e storia) | ✅ Mai tracciati |
| Fuga di segreti nel bundle client (`.next/static`, build fresca) | ✅ `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `SENTRY_AUTH_TOKEN` assenti dal bundle |
| Variabili non-`NEXT_PUBLIC_` in codice client | ✅ Nessuna |
| `console.log` con dati sensibili | ✅ Nessun console.log nel progetto |
| `eval` / `dangerouslySetInnerHTML` / `target="_blank"` senza noopener | ✅ Nessuno |
| CVE-2025-29927 (bypass middleware) | ✅ Non vulnerabile (richiede Next < 14.2.25 / < 15.2.3; qui 16.2.9) |

### 🚨 Azioni urgenti (da fare a mano)
1. **Verifica che la RLS sia davvero attiva su Supabase** (vedi riscontro #2). Lo schema la definisce, ma va confermato che `schema.sql` sia stato eseguito sul progetto di produzione: Dashboard Supabase → Database → Tables → verifica il badge "RLS enabled" su `partner` e `segnalazione`. Test rapido da terminale (con la sola anon key): una `select` su `partner` senza login deve restituire 0 righe.

### ✅ Correzioni già applicate (categoria A)
- **A-1**: `.gitignore` esteso con `*.key`, `id_rsa*`, `*.p12`, `*.pfx`, `*.dump`, `*.sqlite`, `*.db`
- **A-2**: cookie `vetrina_ref` ora `httpOnly: true` (`src/proxy.ts`) — è letto solo lato server, nessun impatto funzionale
- **A-3**: Next.js aggiornato 16.2.7 → 16.2.9 e `eslint-config-next` allineato (patch release, non-breaking). **Build verificata: passa.**

### ✅ Correzioni categoria B — APPROVATE E APPLICATE (2026-06-11, stessa giornata)
- **B-1** ✅: parametro `next` validato in `src/app/auth/callback/route.ts` — accetta solo percorsi locali
- **B-2** ✅: registrazione partner protetta con honeypot + max 3 registrazioni/ora per IP + tetto globale 20/24h
- **B-3** ✅: form contatti rafforzato con max 5 invii/ora per IP + tetto globale 30/24h (limite per email mantenuto). Nuova libreria condivisa `src/lib/ratelimit.ts`
- **B-4** ✅: CSP aggiunta in modalità **Report-Only** in `next.config.ts` — da promuovere a enforcing dopo un periodo di osservazione senza violazioni
- **B-5** ✅ (parte codice): check admin centralizzato in `src/lib/admin.ts` con confronto case-insensitive, usato in `admin/page.tsx` e nelle action. **Resta manuale:** creare un utente Supabase con email non pubblica e aggiornare `ADMIN_EMAIL` su Vercel
- **B-6** ✅: Sentry con `sendDefaultPii: false` (3 config), `tracesSampleRate: 0.1`, Session Replay rimosso; GA4 ora parte **solo dopo consenso** tramite nuovo banner `src/components/CookieConsent.tsx`

Build di produzione verificata dopo le patch: ✅ passa.

---

## Riscontri dettagliati (dal più grave)

---

### 1. 🟠 ALTO — Open redirect nel callback di autenticazione
**Categoria OWASP:** A01 Broken Access Control (redirect non validato in flusso auth)
**Dove:** `src/app/auth/callback/route.ts` righe 8 e 14
**Stato:** ⚠️ Patch proposta (B-1)

Il parametro `next` arriva dalla query string e viene concatenato a `origin` senza validazione: `NextResponse.redirect(`${origin}${next}`)`. Se `next` non inizia con `/`, l'URL risultante può puntare a un dominio esterno:
- `?next=@evil.com` → `https://tuosito.it@evil.com` → il browser va su **evil.com** (la parte prima di `@` è interpretata come userinfo)
- `?next=.evil.com` → `https://tuosito.it.evil.com` → dominio dell'attaccante

Un attaccante può confezionare un link di login/reset che, a flusso completato con successo, deposita l'utente su un sito di phishing identico al tuo — con la fiducia di "arrivare dal sito vero".

**Patch proposta (B-1):**
```typescript
// src/app/auth/callback/route.ts
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/partner/area-partner";
  // Accetta solo percorsi locali: deve iniziare con "/" singolo (non "//", non "/\")
  const next = /^\/(?![\/\\])/.test(rawNext) ? rawNext : "/partner/area-partner";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/partner/accedi`);
}
```

---

### 2. 🟡 MEDIO — RLS definita nel codice ma non verificabile da qui
**Categoria OWASP:** A01 Broken Access Control
**Dove:** `supabase/schema.sql` righe 38–56
**Stato:** 🚨 Azione manuale

Lo schema abilita correttamente la Row Level Security su `partner` e `segnalazione` con policy `select`/`insert` legate a `auth.uid()`. Ma il file è solo la "ricetta": se sul progetto Supabase di produzione lo script non è stato eseguito (o le tabelle sono state ricreate dopo), la anon key — pubblica per design — permetterebbe a chiunque di leggere nomi, email, telefoni, IBAN e commissioni.

**Procedura (non eseguita da me):** Dashboard Supabase → Database → Tables → badge "RLS enabled" su entrambe le tabelle. Controlla anche Advisors → Security Advisor, che segnala tabelle esposte. Nota: non esistono policy di `update`/`delete` per gli utenti — corretto, perché gli aggiornamenti passano dal service role lato server.

---

### 3. 🟡 MEDIO — Registrazione partner senza alcun anti-abuso
**Categoria OWASP:** A06 Insecure Design / A07 Authentication Failures
**Dove:** `src/app/actions/partner.ts` funzione `registraPartner`
**Stato:** ⚠️ Patch proposta (B-2)

La Server Action pubblica crea utenti via `admin.auth.admin.createUser` con `email_confirm: true` (nessuna verifica email!) e invia un'email di benvenuto via Resend. Un bot può: creare account illimitati con email altrui (che ricevono email indesiderate dal tuo dominio → danno reputazionale e quota Resend), gonfiare la tabella `partner` e generare codici referral spazzatura.

**Patch proposta (B-2)** — honeypot + limite per IP sulle registrazioni recenti (stesso pattern già usato per i contatti):
```typescript
// src/app/actions/partner.ts — in cima a registraPartner(), dopo la validazione campi
import { headers } from "next/headers";

const honeypot = (formData.get("website") as string) ?? "";
if (honeypot) return { errore: "Errore di rete. Riprova." };

const ip = ((await headers()).get("x-forwarded-for") ?? "").split(",")[0].trim();
// Esiste già una colonna per tracciare l'IP? Se no, alternativa senza modifiche al DB:
// limita per dominio email i tentativi ravvicinati, oppure integra Cloudflare Turnstile.
```
La soluzione robusta è **Cloudflare Turnstile** (gratuito) sul form di registrazione + verifica del token nella action. In aggiunta, valuta di riattivare la verifica email (`email_confirm: false` + email di conferma) ora che il dominio Resend sarà verificato.

---

### 4. 🟡 MEDIO — Rate limiting del form contatti aggirabile
**Categoria OWASP:** A06 Insecure Design
**Dove:** `src/app/actions/segnalazioni.ts` righe 28–38
**Stato:** ⚠️ Patch proposta (B-3) — miglioramento del controllo esistente

Il limite "max 3 invii / 24h" è calcolato sull'**email dichiarata dal mittente**: a un bot basta cambiare email a ogni invio per aggirarlo del tutto. L'honeypot aiuta contro i bot generici, ma non contro un attacco mirato. Ogni invio costa una riga su DB + un'email Resend.

**Patch proposta (B-3):** affiancare un limite per IP (`x-forwarded-for`, prima voce) con la stessa query `count` su una colonna `ip` da aggiungere a `segnalazione`, oppure — senza toccare il DB — Cloudflare Turnstile sul form. Mantieni comunque il limite per email come secondo livello.

---

### 5. 🟡 MEDIO — Dipendenza vulnerabile senza fix sicuro: postcss < 8.5.10 dentro Next
**Categoria OWASP:** A03 Software Supply Chain
**Dove:** `node_modules/next/node_modules/postcss` (bundled da Next.js, anche su 16.2.9)
**Stato:** ⚠️ Nessuna azione automatica possibile — **NON eseguire `npm audit fix --force`** (installerebbe Next 9.3.3, distruttivo)

`npm audit` segnala GHSA-qx2v-qp2m-jg93 (XSS via `</style>` non escapato nell'output di stringify). Riguarda chi stringifica CSS non fidato: questo progetto compila solo il proprio CSS via Tailwind in build, quindi l'esposizione pratica è ~nulla. Da risolvere quando Next pubblicherà una release con postcss ≥ 8.5.10: ricontrolla con `npm audit` ai prossimi aggiornamenti di Next.

---

### 6. 🔵 BASSO — L'email admin coincide con l'email pubblica di contatto
**Categoria OWASP:** A07 Authentication Failures
**Dove:** `src/app/contatti/page.tsx` (email visibile) vs `ADMIN_EMAIL` usata come check di autorizzazione in `src/app/admin/page.tsx:14` e `src/app/actions/segnalazioni.ts:90,165`
**Stato:** ⚠️ Proposta (B-5)

L'autorizzazione admin è "utente loggato con email === ADMIN_EMAIL". Quella stessa email è pubblicata sulla pagina contatti (è nel bundle client — verificato): chiunque conosce l'identità esatta dell'account admin e può mirarci phishing/credential stuffing. Il meccanismo in sé regge (serve comunque la password Supabase), ma riduce il margine di sicurezza.

**Proposta:** crea un utente Supabase dedicato con email non pubblica e aggiorna `ADMIN_EMAIL` su Vercel; in alternativa passa a un claim di ruolo (`app_metadata.role === "admin"`). Nel frattempo, attiva una password molto robusta sull'account attuale. Nota minore: il confronto email è case-sensitive — `user.email !== process.env.ADMIN_EMAIL` può dare falsi negativi se la casing differisce; usa `.toLowerCase()` su entrambi.

---

### 7. 🔵 BASSO — Sentry con `sendDefaultPii: true` + Session Replay + GA senza banner consenso
**Categoria OWASP:** A09 Logging & Alerting (over-logging) / privacy GDPR
**Dove:** `src/instrumentation-client.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` (`sendDefaultPii: true`, `tracesSampleRate: 1`, replay attivo); `src/components/GoogleAnalytics.tsx` caricato incondizionatamente in `layout.tsx`
**Stato:** ⚠️ Proposta (B-6)

`sendDefaultPii: true` invia a Sentry IP e header degli utenti; Session Replay registra le sessioni (il testo è mascherato di default, ma resta tracciamento). GA4 parte senza consenso. Per un sito italiano rivolto al pubblico, il Garante richiede consenso preventivo per analytics/tracciamento non essenziale. C'è anche un costo: `tracesSampleRate: 1` campiona il 100% delle transazioni e brucia quota.

**Proposta:** `sendDefaultPii: false` (o consenso), `tracesSampleRate: 0.1–0.2` in produzione, e un banner consenso (es. iubenda, Cookiebot, o `gtag('consent', ...)` in modalità default-denied) che attivi GA/Replay solo dopo l'opt-in. Nota: il DSN Sentry hardcoded nel client è normale e non è un segreto.

---

### 8. 🔵 BASSO — Content-Security-Policy assente
**Categoria OWASP:** A02 Security Misconfiguration
**Dove:** `next.config.ts` (gli altri 5 header di sicurezza ci sono già)
**Stato:** ⚠️ Policy di partenza fornita (B-4) — da testare prima in Report-Only

Senza CSP, un eventuale XSS futuro non ha contenimento. Policy di partenza calibrata sullo stack attuale (GA, Vercel Analytics, Sentry tunnel `/monitoring`, Supabase, Google Fonts via next/font = self-hosted):

```typescript
// next.config.ts — da aggiungere a securityHeaders DOPO un periodo in Report-Only
{
  key: "Content-Security-Policy-Report-Only", // poi: "Content-Security-Policy"
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://www.googletagmanager.com",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
}
```
Nota: `'unsafe-inline'` negli script serve per lo snippet GA inline e gli script Next; per eliminarlo servono nonce (lavoro maggiore). Inizia in Report-Only e controlla le violazioni in console/Sentry per qualche giorno.

---

### 9. ⚪ INFORMATIVO — Protezione /admin nel proxy è solo un primo filtro (corretto così)
**Categoria OWASP:** A01
**Dove:** `src/proxy.ts` righe 18–25 e `src/app/admin/page.tsx` righe 8–14

Il proxy controlla solo la **presenza** di un cookie `sb-*-auth-token` (falsificabile), ma la pagina `/admin` e tutte le Server Actions admin ricontrollano identità + email lato server con `supabase.auth.getUser()`. Questa è esattamente la "difesa in profondità" raccomandata: il middleware è UX, l'autorizzazione vera vive nelle route. Nessuna azione necessaria.

---

### 10. ⚪ INFORMATIVO — robots.txt rivela i percorsi riservati
**Dove:** `src/app/robots.ts` riga 9

`disallow: ["/admin", "/partner/area-partner"]` comunica ai crawler (e ai curiosi) dove stanno le aree riservate. Dato che la protezione server-side è solida, è un'informazione a basso valore per un attaccante; è il compromesso standard per tenerle fuori dagli indici. Nessuna azione.

---

### 11. ⚪ INFORMATIVO — Brute force sul login mitigato solo dai limiti di Supabase
**Dove:** `src/app/partner/accedi/page.tsx` (signInWithPassword client-side)

Il login usa direttamente Supabase Auth, che applica rate limit propri lato server (es. limiti su tentativi falliti e su invio email per il reset — il codice gestisce già il messaggio "security purposes"). Per il profilo di rischio attuale è accettabile. Se l'area partner crescerà di valore, valuta protezioni aggiuntive (captcha su tentativi ripetuti, Supabase Auth ha l'integrazione captcha nativa).

---

### 12. ⚪ INFORMATIVO — Buone pratiche confermate
- Escape HTML (`escHtml`) applicato a tutti i campi utente nelle email (fix del rapporto precedente, mantenuto).
- Flussi di denaro: `valore_progetto` e commissioni sono impostati/calcolati **solo** da azioni protette da check admin server-side (`calcolaCommissione` in `src/lib/commissioni.ts`); il client non può influenzarli.
- IBAN: validato in formato e aggiornabile solo dall'utente proprietario (filtro `eq("user_id", user.id)`).
- Service role key: usata solo in file server (5 file verificati, nessuno `"use client"`).
- Errori: nessuno stack trace esposto; `global-error.tsx` presente; messaggi generici verso l'utente.
- Cookie di sessione Supabase: gestiti da `@supabase/ssr` con flag sicuri di default.
- Source map: non serviti pubblicamente (upload solo verso Sentry via auth token, che è in `.env.sentry-build-plugin`, ignorato da git — verificato).

---

## Cronologia correzioni automatiche di questa sessione (categoria A)
| # | File | Modifica |
|---|---|---|
| A-1 | `.gitignore` | Aggiunti pattern `*.key`, `id_rsa*`, `*.p12`, `*.pfx`, `*.dump`, `*.sqlite`, `*.db` |
| A-2 | `src/proxy.ts` | `httpOnly: true` sul cookie `vetrina_ref` (letto solo lato server) |
| A-3 | `package.json` / `package-lock.json` | Next.js 16.2.7 → 16.2.9, eslint-config-next allineato. Build di produzione verificata ✅ |

**Nessun commit/push eseguito.** Le modifiche sono nell'area di lavoro: rivedile con `git diff`.
