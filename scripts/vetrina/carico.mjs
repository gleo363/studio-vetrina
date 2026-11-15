// LCP e CLS della home misurati dentro la pagina, su più caricamenti a freddo.
//   node scripts/vetrina/carico.mjs --url http://localhost:3100 [--giri 5] [--vista mobile|desktop]
// Telefono: 412×915, DPR 2,625, CPU ×4, rete "Slow 4G" di DevTools (latenza 150 ms, ~1,6 Mbit/s giù).
import { chromium } from "playwright";
import { argomenti } from "./comune.mjs";

const arg = argomenti();
const URL = (arg.url ?? "http://localhost:3100").replace(/\/$/, "") + "/";
const giri = Number(arg.giri ?? 5);
const vista = arg.vista ?? "mobile";

const browser = await chromium.launch();
const risultati = [];
for (let g = 0; g < giri; g++) {
  const ctx = await browser.newContext(
    vista === "mobile"
      ? { viewport: { width: 412, height: 915 }, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true }
      : { viewport: { width: 1440, height: 900 } }
  );
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  if (vista === "mobile") {
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8,
    });
  }
  await page.addInitScript(() => {
    window.__cls = [];
    window.__lcp = [];
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        if (e.hadRecentInput) continue;
        window.__cls.push({
          valore: e.value,
          t: Math.round(e.startTime),
          sorgenti: (e.sources ?? []).map((s) => ({
            nodo: s.node ? (s.node.nodeName + "." + String(s.node.className ?? "").slice(0, 60)) : "?",
            prima: [s.previousRect.y, s.previousRect.height].map(Math.round),
            dopo: [s.currentRect.y, s.currentRect.height].map(Math.round),
          })),
        });
      }
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        window.__lcp.push({ t: Math.round(e.startTime), dim: e.size, el: e.element ? e.element.nodeName + "." + String(e.element.className ?? "").slice(0, 50) : "?", url: e.url });
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
  });
  await page.goto(URL, { waitUntil: "load", timeout: 120000 });
  await page.waitForTimeout(6000);
  const m = await page.evaluate(() => ({ cls: window.__cls, lcp: window.__lcp }));
  const cls = m.cls.reduce((a, e) => a + e.valore, 0);
  const ultimo = m.lcp.at(-1);
  risultati.push({ giro: g + 1, lcp: ultimo?.t, elementoLcp: ultimo?.el, cls: +cls.toFixed(4), spostamenti: m.cls });
  console.log(`giro ${g + 1}: LCP ${ultimo?.t} ms (${ultimo?.el}), CLS ${cls.toFixed(4)}`);
  for (const s of m.cls) console.log("   spostamento", JSON.stringify(s));
  await ctx.close();
}
const lcp = risultati.map((r) => r.lcp).sort((a, b) => a - b);
console.log(`MEDIANA LCP ${lcp[Math.floor(lcp.length / 2)]} ms; CLS max ${Math.max(...risultati.map((r) => r.cls))}`);
await browser.close();
