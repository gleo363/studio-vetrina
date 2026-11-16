import { test } from "node:test";
import assert from "node:assert/strict";
import {
  TEMPI,
  indiceFotogramma,
  angoliPerProgresso,
  ordineCaricamento,
  piuVicinoCaricato,
  progressoZoom,
  fotogrammaDaMostrare,
  opacitaCopia,
  sceltaFotogramma,
  type DatiSequenza,
} from "../sequenza.ts";

test("TEMPI come da piano", () => {
  assert.deepEqual(TEMPI, {
    titoloFine: 0.1,
    clip1Fine: 0.45,
    schermoInizio: 0.85,
    fotogrammiFine: 0.92,
    zoomInizio: 0.92,
  });
});

test("indiceFotogramma: estremi e confine tra le clip", () => {
  assert.equal(indiceFotogramma(0, 120, 59), 0);
  assert.equal(indiceFotogramma(-0.2, 120, 59), 0);
  assert.equal(indiceFotogramma(0.45, 120, 59), 59);
  assert.equal(indiceFotogramma(0.92, 120, 59), 119);
  assert.equal(indiceFotogramma(1, 120, 59), 119);
  assert.equal(indiceFotogramma(1.3, 120, 59), 119);
});

test("indiceFotogramma: monotono e senza buchi su 1000 campioni", () => {
  let prec = 0;
  const visti = new Set<number>();
  for (let i = 0; i <= 1000; i++) {
    const f = indiceFotogramma(i / 1000, 100, 49);
    assert.ok(f >= prec, `scende al campione ${i}`);
    assert.ok(f - prec <= 1, `salta al campione ${i}`);
    prec = f;
    visti.add(f);
  }
  assert.equal(visti.size, 100);
});

const dati: DatiSequenza = {
  fotogrammi: 120,
  primaClip: 59,
  larghezza: 1920,
  altezza: 1080,
  estensione: "avif",
  angoli: {
    "112": [
      [100, 100],
      [200, 100],
      [200, 200],
      [100, 200],
    ],
    "113": [
      [110, 100],
      [210, 100],
      [210, 200],
      [110, 200],
    ],
  },
};

test("angoliPerProgresso: null prima dello schermo", () => {
  assert.equal(angoliPerProgresso(0.5, dati), null);
  assert.equal(angoliPerProgresso(0.849, dati), null);
});

test("angoliPerProgresso: oltre l'ultimo fotogramma noto usa l'ultimo", () => {
  assert.deepEqual(angoliPerProgresso(1, dati), dati.angoli["113"]);
});

test("angoliPerProgresso: prima del primo noto usa il primo", () => {
  assert.deepEqual(angoliPerProgresso(0.85, dati), dati.angoli["112"]);
});

test("ordineCaricamento: permutazione che parte dalle chiavi", () => {
  const o = ordineCaricamento(120, [0, 59, 119]);
  assert.deepEqual(o.slice(0, 3), [0, 59, 119]);
  assert.deepEqual([...o].sort((a, b) => a - b), [...Array(120).keys()]);
});

test("ordineCaricamento: con partenza prima i vicini", () => {
  const o = ordineCaricamento(120, [0, 59, 119], 80);
  assert.equal(o[0], 80);
  assert.deepEqual(new Set(o.slice(1, 3)), new Set([79, 81]));
  assert.deepEqual([...o].sort((a, b) => a - b), [...Array(120).keys()]);
});

test("piuVicinoCaricato", () => {
  assert.equal(piuVicinoCaricato(10, new Set([3, 14])), 14);
  assert.equal(piuVicinoCaricato(10, new Set([10])), 10);
  assert.equal(piuVicinoCaricato(10, new Set([8, 12])), 8);
  assert.equal(piuVicinoCaricato(10, new Set()), -1);
});

test("progressoZoom: 0 fino a 0,92, 1 a 1, monotono", () => {
  assert.equal(progressoZoom(0.5), 0);
  assert.equal(progressoZoom(0.92), 0);
  assert.equal(progressoZoom(1), 1);
  assert.equal(progressoZoom(1.2), 1);
  let prec = 0;
  for (let i = 0; i <= 100; i++) {
    const z = progressoZoom(0.92 + (0.08 * i) / 100);
    assert.ok(z >= prec);
    prec = z;
  }
});

test("fotogrammaDaMostrare: durante lo zoom sempre l'ultimo, anche se lo spring è indietro", () => {
  assert.equal(fotogrammaDaMostrare(0.5, 0.5, 120, 59), indiceFotogramma(0.5, 120, 59));
  assert.equal(fotogrammaDaMostrare(0.8, 0.95, 120, 59), 119);
  assert.equal(fotogrammaDaMostrare(0.6, 1, 100, 49), 99);
  assert.equal(fotogrammaDaMostrare(0.91, 0.92, 120, 59), indiceFotogramma(0.91, 120, 59));
});

test("opacitaCopia: dissolvenza su s, ma mai a scatto quando lo zoom parte con lo spring indietro", () => {
  assert.equal(opacitaCopia(0.5, 0.5), 0);
  assert.equal(opacitaCopia(0.9, 0.9), 1);
  assert.ok(opacitaCopia(0.875, 0.88) > 0.4 && opacitaCopia(0.875, 0.88) < 0.6);
  // spring indietro (s=0,7) appena dentro lo zoom: la copia entra gradualmente, non a 1
  const appena = opacitaCopia(0.7, 0.925);
  assert.ok(appena > 0 && appena < 0.5, String(appena));
  assert.equal(opacitaCopia(0.7, 1), 1);
});

test("sceltaFotogramma: mai più lontano di quello già a schermo", () => {
  assert.equal(sceltaFotogramma(50, new Set([0]), 48), -1); // resta il 48 già disegnato
  assert.equal(sceltaFotogramma(50, new Set([0, 49]), 48), 49);
  assert.equal(sceltaFotogramma(50, new Set([0]), -1), 0); // niente a schermo: il più vicino
  assert.equal(sceltaFotogramma(1, new Set([0]), 30), 0);
  assert.equal(sceltaFotogramma(50, new Set([50]), 50), -1); // già disegnato
  assert.equal(sceltaFotogramma(50, new Set(), 12), -1);
});
