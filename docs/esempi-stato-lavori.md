# Stato lavori — Pagina /esempi e vetrine dimostrative

> File di ripresa: se la sessione Claude Code viene riassunta o riavviata,
> leggere QUESTO file + il prompt originale in
> `C:\Users\User\Downloads\vetrina-pagina-esempi-prompt.md`.
> I 4 riferimenti visivi sono nella radice del repo: `ref-ristorazione.png`,
> `ref-salone.png`, `ref-e-commerce.png`, `ref-studio.png` (vanno LETTI prima
> di costruire le vetrine 3 e 4).

## Fatto (approvato dall'utente)

- **Route scelta**: `/esempi`, voce nav "Esempi". `/lavori` andrà reindirizzata (todo).
- **Gate header/footer**: `src/components/layout/SiteChrome.tsx` — header e footer
  di Studio Vetrina nascosti SOLO su `/esempi/<vetrina>` (regex `^\/esempi\/.+`).
  `layout.tsx` usa `SiteHeader`/`SiteFooter`.
- **Galleria** `/esempi`: `src/app/esempi/page.tsx` + `src/components/esempi/GalleriaEsempi.tsx`
  (brand Vetrina: hero Travertino, 4 schede con mini-anteprime nei colori delle
  vetrine, CTA Cotto clip-path "La tua vetrina sarà diversa da tutte queste. Sarà la tua.").
- **Barra ritorno condivisa**: `src/components/esempi/BarraEsempi.tsx`
  (`BarraEsempi` sopra + `ChiusuraEsempi` sotto ogni vetrina, su sfondo inchiostro).
- **Vetrina 1** `/esempi/ristorante` — Osteria del Vicolo (RESPIN approvato in corso di verifica):
  concept "menù stampato/poster": Anton + Karla, crema #FAF2E2 / arancio #D8501C /
  marrone #2E1F14 / giallo #E8B04B, titolo gigante "LA PASTA COME DIO COMANDA.",
  marquee piatti, menù come foglio di carta ruotato, polaroid sovrapposte,
  mappa-cartolina, prenotazione a "biglietto perforato" con timbro RICEVUTO.
- **Vetrina 2** `/esempi/salone` — Atelier Sofia (salone parrucchieri + centro
  estetico, RESPIN approvato in corso di verifica): concept "rivista di moda":
  Manrope + Playfair Display italic, bianco / carbone #1C1C1E / malva #A06CD5 /
  lavanda #F3EBFC, ZERO angoli arrotondati, hairline, listino a indice editoriale
  con numeri fantasma 01/02, manifesto con evidenziature a pennarello, lavori a
  scorrimento orizzontale, form a sottolineatura con fasce orarie a pillole.
- **Vetrina 3** `/esempi/bottega` — Fiori di Trastevere (COSTRUITA, in attesa
  di revisione utente): concept "passeggiata narrativa nella bottega":
  Cormorant Garamond + Mulish, perla #F7F5F0 / salvia #7C8B6F / rosso fiore
  #C94F4F / verde bosco #2F3A2C. STRUTTURA: niente barra di nav — insegna
  circolare rotante con textPath (pausa con reduced-motion) e ancore separate
  da puntini; linee SVG che si disegnano allo scroll (pathLength); prodotti
  come CARTELLINI DA FIORAIO appesi al filo (foro, spago SVG, rotazioni
  alternate, fiori disegnati a 5 petali parametrici); storia a linea verticale
  tracciata con 4 tappe alternate dx/sx (1962→oggi); orari su cartoncino con
  righe tratteggiate; mappa SVG disegnata a mano (Tevere, vicoli, segnaposto a
  fiore); modulo = BIGLIETTINO DA ACCOMPAGNAMENTO (angolo piegato, radio
  "occasione", campo "cosa scriviamo sul bigliettino" in corsivo); chiusura
  scura verde bosco. File: `VetrinaBottega.tsx` + `app/esempi/bottega/page.tsx`.
- **Vetrina 4** `/esempi/studio` — Falegnameria Marini (COSTRUITA, in attesa
  di revisione utente): concept "capitolato / disegno tecnico": Archivo
  extralight + IBM Plex Mono, quasi-nero #161412 / osso #F5F3EF / legno
  #B08968. STRUTTURA: testata a cartiglio con indice numerato 01–04 ancorato;
  hero a dichiarazione grande font-extralight con QUOTA DI MISURA da disegno
  tecnico (frecce + etichetta mono); venatura del legno SVG che si disegna
  (nodo compreso); portfolio a RIGHE FULL-BLEED APRIBILI COME CASSETTI
  (accordion con numero, luogo·anno mono, bottone +→×, scheda essenza/
  finitura/tempi); banda chiara invertita "il mestiere" con manifesto e 3
  colonne Materiale/Disegno/Garanzia; competenze a righe sottili A./B./C./D.;
  modulo = SCHEDA DI CAPITOLATO a griglia bordata con campi etichettati
  A.Nome/B.Telefono/C.Lavoro(radio quadrate)/D.Descrizione; piè di pagina a
  cartiglio. File: `VetrinaStudio.tsx` + `app/esempi/studio/page.tsx`.
- **Build** dopo le vetrine 3 e 4: verde (26/26 pagine, Next 16.2.7 Turbopack).
- **Vetrine 3 e 4 APPROVATE dall'utente.**
- **Nav + redirect** (punto 3 originale, COMPLETATO): voce "Esempi" al posto di
  "Lavori / coming soon" in `Header.tsx` e `Footer.tsx` (rimossi anche i rami
  `comingSoon` ormai inutilizzati); nel `Hero.tsx` della home il segnaposto
  "Guarda i nostri lavori / coming soon" è ora `Button` ghost "Guarda gli
  esempi" → `/esempi`; cartella `src/app/lavori/` eliminata (page + layout);
  `next.config.ts` con `redirects()`: `/lavori` → `/esempi` (301 permanente);
  `sitemap.ts` aggiornato con `/esempi` (0.9) e le 4 vetrine (0.5).
- **Build finale** (punto 4 originale, COMPLETATO): verde, 25/25 pagine,
  `/lavori` non esiste più tra le route.

## Lezione chiave del respin (NON ripetere l'errore)

La prima versione era "template": nav logo-sx+link+pillola, hero kicker+titolo+
paragrafo+2 bottoni, striscia colore, griglia card arrotondate, spiegone a 3
colonne numerate, form boxato centrato in fondo. TROPPO simile a Studio Vetrina
e tra le vetrine. Ogni vetrina deve avere **struttura** propria, non solo
palette: nav diverse, heroes diversi, modi diversi di presentare listini/portfolio,
form diversi. Usare le skill `frontend-design` e `ui-ux-pro-max` prima di costruire.

## Da fare

Niente: tutti i punti del piano sono completati. Resta solo l'eventuale
commit + deploy in produzione (Vercel), da fare su richiesta dell'utente.

## Regole trasversali (dal prompt originale)

- Pattern pagine vetrina: `src/app/esempi/<nome>/page.tsx` (server, con
  `metadata` che dichiara "esempio/vetrina dimostrativa") che renderizza
  `<BarraEsempi /> + <VetrinaX (client) /> + <ChiusuraEsempi />`.
- Form SEMPRE finti (stato locale, messaggio gentile, nessun DB/segnalazioni).
- Dicitura "Vetrina dimostrativa · attività di fantasia" su ogni vetrina (footer interno).
- Zero anglicismi nei testi. Zero lorem ipsum. Niente foto esterne: gradienti/SVG/CSS.
- **REGOLA UTENTE (vale ovunque, tutto il sito)**: MAI il trattino lungo "—"
  nei testi visibili. Riscrivere con virgola, due punti, punto o "·". Il testo
  deve suonare umano (colloquiale o professionale a seconda del contesto).
  Ammesso solo come segnaposto di valore mancante in tabelle/email.
- Animazioni: framer-motion, ease [0.25,0.46,0.45,0.94], whileInView once,
  rispettare prefers-reduced-motion per le animazioni in loop.
- Font con `next/font/google` dentro al componente client della vetrina.
  Già usati: Fraunces+Inter (brand), Anton+Karla (osteria), Manrope+Playfair (salone).
- Tutto responsivo (375px in su). Verificare gli appunti build: Next 16.2.7, Tailwind v4.

## Stato verifica utente

- Tutte e 4 le vetrine approvate dall'utente. Nav, redirect, sitemap e build
  finale completati. Il lavoro della pagina /esempi è CONCLUSO in locale;
  manca solo commit + deploy su Vercel (su richiesta).
