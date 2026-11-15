// Verifiche della scena "La vetrina che si accende" con Playwright.
//   node scripts/vetrina/verifica.mjs --url http://localhost:3100 [--scatti] [--c4] [--c5] [--c7] [--perf] [--resize]
// Output in .verifiche/e2e/ (screenshot, tracce, riepilogo JSON).
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";
import { argomenti, RADICE } from "./comune.mjs";

const arg = argomenti();
const URL = (arg.url ?? "http://localhost:3100").replace(/\/$/, "");
const OUT = path.join(RADICE, ".verifiche/e2e");
fs.mkdirSync(OUT, { recursive: true });
const tutte = !arg.scatti && !arg.c4 && !arg.c5 && !arg.c7 && !arg.perf && !arg.resize;
const esito = {};

const VISTE = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
};

const browser = await chromium.launch();

async function apri(nomeVista, opzioni = {}) {
  const ctx = await browser.newContext({ ...VISTE[nomeVista], ...opzioni });
  // Il banner dei cookie coprirebbe la scena negli screenshot: si rifiuta prima
  // (niente Google Analytics durante le misure).
  await ctx.addInitScript(() => {
    try { localStorage.setItem("vetrina_consent", "denied"); } catch {}
  });
  const page = await ctx.newPage();
  return { ctx, page };
}

async function caricaHome(page) {
  await page.goto(URL + "/", { waitUntil: "load" });
  await page.waitForSelector("[data-scena-vetrina]");
  // La sequenza parte a riposo dopo il load: si aspetta il primo disegno e la rete ferma.
  await page.waitForSelector("canvas[data-fotogramma]", { timeout: 20000 });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2500); // animazioni d'entrata dell'Hero e della copia
}

async function geometria(page) {
  return page.evaluate(() => {
    const s = document.querySelector("[data-scena-vetrina]");
    const st = document.querySelector("[data-stage-vetrina]");
    const top = s.getBoundingClientRect().top + window.scrollY;
    return { top, corsa: s.offsetHeight - st.offsetHeight };
  });
}

async function vaiA(page, y) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
  // Spring a riposo: data-fotogramma fermo per 500 ms.
  let prec = null, fermo = 0;
  for (let i = 0; i < 80 && fermo < 5; i++) {
    await page.waitForTimeout(100);
    const f = await page.evaluate(() => document.querySelector("canvas")?.dataset.fotogramma ?? null);
    fermo = f === prec ? fermo + 1 : 0;
    prec = f;
  }
  await page.waitForTimeout(300);
  return prec;
}

async function diff(a, b) {
  const [ra, rb] = await Promise.all([a, b].map((x) => sharp(x).removeAlpha().raw().toBuffer({ resolveWithObject: true })));
  let diversi = 0;
  const n = ra.info.width * ra.info.height;
  for (let p = 0; p < n; p++) {
    const i = p * 3;
    const d = Math.max(Math.abs(ra.data[i] - rb.data[i]), Math.abs(ra.data[i + 1] - rb.data[i + 1]), Math.abs(ra.data[i + 2] - rb.data[i + 2]));
    if (d > 16) diversi++;
  }
  return diversi / n;
}

const P = [0, 0.25, 0.5, 0.75, 1];

if (tutte || arg.scatti) {
  for (const v of ["desktop", "mobile"]) {
    const { ctx, page } = await apri(v);
    await caricaHome(page);
    const g = await geometria(page);
    for (const p of [0, 0.1, 0.3, 0.45, 0.6, 0.75, 0.85, 0.88, 0.92, 0.96, 0.99, 1]) {
      await vaiA(page, g.top + p * g.corsa);
      await page.screenshot({ path: path.join(OUT, `scatto-${v}-p${String(Math.round(p * 100)).padStart(3, "0")}.png`) });
    }
    await ctx.close();
  }
  console.log("scatti salvati");
}

if (tutte || arg.c4) {
  esito.c4 = {};
  for (const v of ["desktop", "mobile"]) {
    const { ctx, page } = await apri(v);
    await caricaHome(page);
    const g = await geometria(page);
    const avanti = [], indietro = [];
    for (const p of P) {
      const f = await vaiA(page, g.top + p * g.corsa);
      avanti.push({ p, f, png: await page.screenshot() });
    }
    for (const p of [...P].reverse()) {
      const f = await vaiA(page, g.top + p * g.corsa);
      indietro.unshift({ p, f, png: await page.screenshot() });
    }
    esito.c4[v] = [];
    for (let k = 0; k < P.length; k++) {
      const d = await diff(avanti[k].png, indietro[k].png);
      fs.writeFileSync(path.join(OUT, `c4-${v}-p${P[k] * 100}-avanti.png`), avanti[k].png);
      fs.writeFileSync(path.join(OUT, `c4-${v}-p${P[k] * 100}-indietro.png`), indietro[k].png);
      esito.c4[v].push({ p: P[k], avanti: avanti[k].f, indietro: indietro[k].f, diffPixel: +(d * 100).toFixed(3) + "%", ok: avanti[k].f === indietro[k].f && d < 0.005 });
    }
    await ctx.close();
  }
  console.log("C4", JSON.stringify(esito.c4, null, 1));
}

if (tutte || arg.c5) {
  esito.c5 = {};
  for (const v of ["desktop", "mobile"]) {
    const { ctx, page } = await apri(v);
    await caricaHome(page);
    const g = await geometria(page);
    const fine = Math.round(g.top + g.corsa);
    const prove = {};
    // Avanti: un pixel prima del passaggio, poi il passaggio.
    await vaiA(page, fine - 1);
    prove.avantiPrima = await page.screenshot();
    await vaiA(page, fine);
    prove.avantiDopo = await page.screenshot();
    // Indietro: dal sito vero si risale nella scena.
    await vaiA(page, fine + 300);
    await vaiA(page, fine);
    prove.indietroDopo = await page.screenshot();
    await vaiA(page, fine - 1);
    prove.indietroPrima = await page.screenshot();
    for (const [k, png] of Object.entries(prove)) fs.writeFileSync(path.join(OUT, `c5-${v}-${k}.png`), png);
    const dAvanti = await diff(prove.avantiPrima, prove.avantiDopo);
    const dIndietro = await diff(prove.indietroPrima, prove.indietroDopo);
    esito.c5[v] = {
      avanti: +(dAvanti * 100).toFixed(3) + "%",
      indietro: +(dIndietro * 100).toFixed(3) + "%",
      ok: dAvanti < 0.01 && dIndietro < 0.01,
    };
    await ctx.close();
  }
  console.log("C5", JSON.stringify(esito.c5));
}

if (tutte || arg.c7) {
  esito.c7 = {};
  const pagine = ["/esempi", "/studio", "/perche-sceglierci", "/qa", "/contatti", "/partner"];
  for (const v of ["desktop", "mobile"]) {
    const { ctx, page } = await apri(v);
    const viste = [];
    page.on("request", (r) => viste.push(r.url()));
    for (const p of pagine) {
      await page.goto(URL + p, { waitUntil: "networkidle" });
      await page.mouse.move(40, 30); // passa sull'header (link a "/")
      await page.waitForTimeout(1500);
    }
    const seq = viste.filter((u) => u.includes("/sequenza-vetrina/"));
    esito.c7[`altrePagine-${v}`] = { richieste: viste.length, versoSequenza: seq.length, ok: seq.length === 0 };
    await ctx.close();
  }
  for (const v of ["desktop", "mobile"]) {
    const { ctx, page } = await apri(v, { reducedMotion: "reduce" });
    const viste = [];
    page.on("request", (r) => viste.push(r.url()));
    await page.goto(URL + "/", { waitUntil: "networkidle" });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 3));
    await page.waitForTimeout(3000);
    const seq = viste.filter((u) => u.includes("/sequenza-vetrina/"));
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    fs.writeFileSync(path.join(OUT, `c7-ridotto-${v}.png`), await page.screenshot({ fullPage: false }));
    esito.c7[`homeRidotto-${v}`] = { versoSequenza: seq.length, ok: seq.length === 0 };
    await ctx.close();
  }
  console.log("C7", JSON.stringify(esito.c7));
}

if (tutte || arg.resize) {
  const { ctx, page } = await apri("desktop");
  const errori = [];
  page.on("pageerror", (e) => errori.push(String(e)));
  // Lo script di Vercel Analytics esiste solo su Vercel: in locale dà 404, non conta.
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    if ((m.location()?.url ?? "").includes("/_vercel/") || m.text().includes("/_vercel/")) return;
    errori.push(m.text());
  });
  await caricaHome(page);
  const g = await geometria(page);
  await vaiA(page, g.top + 0.5 * g.corsa);
  for (const w of [1024, 1440, 1280]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(800);
  }
  const g2 = await geometria(page);
  await vaiA(page, g2.top + g2.corsa);
  fs.writeFileSync(path.join(OUT, "resize-fine-1280.png"), await page.screenshot());
  esito.resize = { errori, ok: errori.length === 0 };
  console.log("RESIZE", JSON.stringify(esito.resize));
  await ctx.close();
}

if (tutte || arg.perf) {
  esito.perf = {};
  for (const v of ["mobile", "desktop"]) {
    const { ctx, page } = await apri(v);
    const cdp = await ctx.newCDPSession(page);
    await caricaHome(page);
    if (v === "mobile") await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.evaluate(() => {
      window.__misure = { lunghi: [], loaf: [], intervalli: [], attivo: false };
      new PerformanceObserver((l) => {
        if (window.__misure.attivo) for (const e of l.getEntries()) window.__misure.lunghi.push(e.duration);
      }).observe({ type: "longtask", buffered: false });
      try {
        new PerformanceObserver((l) => {
          if (window.__misure.attivo) for (const e of l.getEntries()) window.__misure.loaf.push(e.duration);
        }).observe({ type: "long-animation-frame", buffered: false });
      } catch {}
      let t0 = 0;
      const giro = (t) => {
        if (window.__misure.attivo && t0) window.__misure.intervalli.push(t - t0);
        t0 = t;
        requestAnimationFrame(giro);
      };
      requestAnimationFrame(giro);
    });
    const g = await geometria(page);
    const traccia = path.join(OUT, `traccia-scroll-${v}.json`);
    if (!arg["senza-traccia"]) await browser.startTracing(page, { path: traccia, screenshots: false });
    await page.evaluate(() => (window.__misure.attivo = true));
    await page.mouse.move(200, 400);
    const passo = Math.round((g.corsa + 300) / 180); // ~3 s per verso a 60 Hz
    for (let i = 0; i < 180; i++) { await page.mouse.wheel(0, passo); await page.waitForTimeout(16); }
    for (let i = 0; i < 180; i++) { await page.mouse.wheel(0, -passo); await page.waitForTimeout(16); }
    await page.waitForTimeout(800);
    await page.evaluate(() => (window.__misure.attivo = false));
    if (!arg["senza-traccia"]) await browser.stopTracing();
    const m = await page.evaluate(() => window.__misure);
    const frame = 1000 / 60;
    const attesi = m.intervalli.reduce((a, b) => a + b, 0) / frame;
    const persi = m.intervalli.reduce((a, d) => a + Math.max(0, Math.round(d / frame) - 1), 0);
    esito.perf[v] = {
      cpu: v === "mobile" ? "x4" : "x1",
      longTaskOltre50ms: m.lunghi.filter((d) => d > 50).length,
      longTaskMaxMs: Math.round(Math.max(0, ...m.lunghi)),
      loafMaxMs: Math.round(Math.max(0, ...m.loaf)),
      fotogrammiPersi: +((100 * persi) / Math.max(1, attesi)).toFixed(2) + "%",
      traccia: path.relative(RADICE, traccia),
    };
    await ctx.close();
  }
  console.log("PERF", JSON.stringify(esito.perf, null, 1));
}

fs.writeFileSync(path.join(OUT, `esito-${Date.now()}.json`), JSON.stringify(esito, null, 2));
await browser.close();
