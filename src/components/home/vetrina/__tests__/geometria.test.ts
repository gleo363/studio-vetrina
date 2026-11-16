import { test } from "node:test";
import assert from "node:assert/strict";
import {
  adattaCopertura,
  fotogrammaInFinestra,
  matrice3d,
  angoliZoom,
  altezzaFascia,
  trasformaZoom,
  quasiFinestra,
  riempimenti,
  type Rett,
  type Quad,
} from "../geometria.ts";

const vicino = (a: number, b: number, eps: number) =>
  assert.ok(Math.abs(a - b) <= eps, `${a} diverso da ${b} (tolleranza ${eps})`);
const quadVicini = (a: Quad, b: Quad, eps: number) =>
  a.forEach((p, i) => {
    vicino(p[0], b[i][0], eps);
    vicino(p[1], b[i][1], eps);
  });
const IDENTITA = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

/** Applica una matrix3d CSS (column-major) a un punto 2D. */
function applica(m: number[], [x, y]: [number, number]): [number, number] {
  const X = m[0] * x + m[4] * y + m[12];
  const Y = m[1] * x + m[5] * y + m[13];
  const W = m[3] * x + m[7] * y + m[15];
  return [X / W, Y / W];
}

// Schermo leggermente prospettico, come in un fotogramma reale.
const schermo: Quad = [
  [288, 150],
  [1152, 156],
  [1150, 700],
  [290, 694],
];

test("adattaCopertura: 16:9 su telefono 390x844 riempie in altezza", () => {
  const a = adattaCopertura(1920, 1080, 390, 844);
  vicino(a.scala, 844 / 1080, 1e-12);
  assert.ok(a.dx < 0);
  vicino(a.dy, 0, 1e-12);
});

test("adattaCopertura: 16:9 su 21:9 (2560x1080) riempie in larghezza", () => {
  const a = adattaCopertura(1920, 1080, 2560, 1080);
  vicino(a.scala, 2560 / 1920, 1e-12);
  vicino(a.dx, 0, 1e-12);
  assert.ok(a.dy < 0);
});

test("fotogrammaInFinestra applica scala e scostamento", () => {
  const q = fotogrammaInFinestra(
    [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
    ],
    { scala: 2, dx: 5, dy: -3 }
  );
  quadVicini(
    q,
    [
      [5, -3],
      [25, -3],
      [25, 17],
      [5, 17],
    ],
    1e-12
  );
});

test("matrice3d(Q,Q) è l'identità", () => {
  const m = matrice3d(schermo, schermo);
  m.forEach((v, i) => vicino(v, IDENTITA[i], 1e-9));
});

test("matrice3d porta i 4 angoli del rettangolo sul quad", () => {
  const rett: Quad = [
    [0, 0],
    [1440, 0],
    [1440, 900],
    [0, 900],
  ];
  const m = matrice3d(rett, schermo);
  rett.forEach((p, i) => {
    const [x, y] = applica(m, p);
    vicino(x, schermo[i][0], 1e-6);
    vicino(y, schermo[i][1], 1e-6);
  });
});

const finestre: [number, number][] = [
  [1440, 900],
  [2560, 1080],
  [1000, 1000],
  [390, 844],
];

for (const [vw, vh] of finestre) {
  test(`angoliZoom(1) coincide con la finestra ${vw}x${vh}`, () => {
    quadVicini(
      angoliZoom(1, schermo, vw, vh),
      [
        [0, 0],
        [vw, 0],
        [vw, vh],
        [0, vh],
      ],
      1e-6
    );
  });

  test(`angoliZoom(0) coincide con lo schermo (${vw}x${vh})`, () => {
    quadVicini(angoliZoom(0, schermo, vw, vh), schermo, 1e-6);
  });

  test(`a t=1 la copia è all'identità (${vw}x${vh})`, () => {
    const h = altezzaFascia(1, schermo, vw, vh);
    const da: Quad = [
      [0, 0],
      [vw, 0],
      [vw, h],
      [0, h],
    ];
    const m = matrice3d(da, angoliZoom(1, schermo, vw, vh));
    m.forEach((v, i) => vicino(v, IDENTITA[i], 1e-9));
  });
}

test("quasiFinestra: vero solo quando ogni angolo è entro mezzo pixel dalla finestra", () => {
  const vw = 1440, vh = 900;
  // Un pixel di scroll prima del passaggio lo zoom è a t ≈ 0,99986: va agganciato.
  assert.equal(quasiFinestra(angoliZoom(0.99986, schermo, vw, vh), vw, vh), true);
  assert.equal(quasiFinestra(angoliZoom(1, schermo, vw, vh), vw, vh), true);
  assert.equal(quasiFinestra(angoliZoom(0.99, schermo, vw, vh), vw, vh), false);
  assert.equal(quasiFinestra(angoliZoom(0.5, schermo, vw, vh), vw, vh), false);
});

test("altezzaFascia va dall'altezza proporzionale dello schermo a vh", () => {
  // schermo largo ~862 e alto ~544: a t=0 la fascia ha le sue proporzioni
  vicino(altezzaFascia(0, schermo, 390, 844), (390 * 544) / 862, 1);
  vicino(altezzaFascia(1, schermo, 390, 844), 844, 1e-9);
});

test("trasformaZoom: identità a t=0, schermo a tutta larghezza a t=1", () => {
  const z0 = trasformaZoom(0, schermo, 1440);
  vicino(z0.k, 1, 1e-12);
  vicino(z0.tx, 0, 1e-9);
  vicino(z0.ty, 0, 1e-9);
  const z1 = trasformaZoom(1, schermo, 1440);
  const x0 = (schermo[0][0] + schermo[3][0]) / 2;
  const y0 = (schermo[0][1] + schermo[1][1]) / 2;
  const x1 = (schermo[1][0] + schermo[2][0]) / 2;
  vicino(z1.k * x0 + z1.tx, 0, 1e-6);
  vicino(z1.k * y0 + z1.ty, 0, 1e-6);
  vicino(z1.k * x1 + z1.tx, 1440, 1e-6);
});

const area = (r: Rett) => Math.max(0, r.w) * Math.max(0, r.h);
const interseca = (r: Rett, W: number, H: number): Rett => {
  const x0 = Math.max(0, r.x), y0 = Math.max(0, r.y);
  const x1 = Math.min(W, r.x + r.w), y1 = Math.min(H, r.y + r.h);
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
};
for (const [nome, r] of [
  ["zoom telefono: il fotogramma sale e lascia scoperto il fondo", { x: -120, y: -900, w: 700, h: 1400 }],
  ["finestra quadrata: zoom che rimpicciolisce, scoperti i lati", { x: 60, y: -20, w: 880, h: 495 }],
  ["scoperti un angolo e due lati", { x: 30, y: 40, w: 300, h: 600 }],
  ["copre tutto", { x: -10, y: -10, w: 2000, h: 2000 }],
] as [string, Rett][]) {
  test("riempimenti: " + nome + ", la tela è coperta esattamente una volta", () => {
    const W = 390, H = 844;
    const parti = riempimenti(r, W, H);
    const totale = area(interseca(r, W, H)) + parti.reduce((a, p) => a + area(p.dest), 0);
    vicino(totale, W * H, 1e-6);
    for (const p of parti) {
      assert.ok(p.dest.x >= -1e-9 && p.dest.y >= -1e-9 && p.dest.x + p.dest.w <= W + 1e-9 && p.dest.y + p.dest.h <= H + 1e-9);
    }
  });
}
