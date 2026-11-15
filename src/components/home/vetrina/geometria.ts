/**
 * Geometria della scena "La vetrina che si accende".
 * Funzioni pure: nessun accesso al DOM, testate con `npm test`.
 *
 * Coordinate: pixel CSS della finestra (stage = vw × vh), origine in alto a sinistra.
 * Un Quad elenca gli angoli in ordine TL, TR, BR, BL.
 */

export type Punto = [number, number];
export type Quad = [Punto, Punto, Punto, Punto];

export interface Copertura {
  scala: number;
  dx: number;
  dy: number;
}

/** Come object-fit: cover, con il fotogramma centrato. */
export function adattaCopertura(
  fw: number,
  fh: number,
  vw: number,
  vh: number
): Copertura {
  const scala = Math.max(vw / fw, vh / fh);
  return { scala, dx: (vw - fw * scala) / 2, dy: (vh - fh * scala) / 2 };
}

/** Porta un quad dalle coordinate del fotogramma a quelle della finestra. */
export function fotogrammaInFinestra(q: Quad, a: Copertura): Quad {
  return q.map(([x, y]) => [x * a.scala + a.dx, y * a.scala + a.dy]) as Quad;
}

/** Risolve A·x = b (8×8) con eliminazione di Gauss e pivot parziale. */
function risolvi(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M = A.map((riga, i) => [...riga, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) {
      if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    }
    [M[c], M[p]] = [M[p], M[c]];
    const piv = M[c][c];
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = M[r][c] / piv;
      if (f === 0) continue;
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  return M.map((riga, i) => riga[n] / riga[i]);
}

/**
 * Omografia che porta i 4 angoli `da` sui 4 angoli `a`, come 16 valori
 * column-major per `matrix3d()` (con transform-origin 0 0).
 */
export function matrice3d(da: Quad, a: Quad): number[] {
  const A: number[][] = [];
  const b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = da[i];
    const [u, v] = a[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    b.push(v);
  }
  const [h0, h1, h2, h3, h4, h5, h6, h7] = risolvi(A, b);
  // H = [[h0 h1 h2], [h3 h4 h5], [h6 h7 1]] → matrice 4×4 column-major
  return [h0, h3, 0, h6, h1, h4, 0, h7, 0, 0, 1, 0, h2, h5, 0, 1];
}

/** Rettangolo medio dello schermo (bordi = medie dei lati opposti). */
function rettangoloSchermo(s: Quad) {
  const x0 = (s[0][0] + s[3][0]) / 2;
  const x1 = (s[1][0] + s[2][0]) / 2;
  const y0 = (s[0][1] + s[1][1]) / 2;
  const y1 = (s[3][1] + s[2][1]) / 2;
  return { x0, y0, w: x1 - x0, h: y1 - y0 };
}

/**
 * Zoom uniforme attorno a un punto fisso: a t=0 identità, a t=1 il bordo
 * alto dello schermo occupa tutta la larghezza della finestra a partire da (0,0).
 * La scala cresce in modo esponenziale (k = k1^t), così lo zoom appare costante.
 * Restituisce la trasformazione p' = k·p + (tx, ty).
 */
export function trasformaZoom(
  t: number,
  schermo: Quad,
  vw: number
): { k: number; tx: number; ty: number } {
  const { x0, y0, w } = rettangoloSchermo(schermo);
  const k1 = vw / w;
  const k = Math.pow(k1, t);
  if (Math.abs(k1 - 1) < 1e-9) {
    return { k: 1, tx: -x0 * t, ty: -y0 * t };
  }
  // Punto fisso P di G1(p) = k1·(p − X0): P = k1·X0 / (k1 − 1)
  const px = (k1 * x0) / (k1 - 1);
  const py = (k1 * y0) / (k1 - 1);
  return { k, tx: px * (1 - k), ty: py * (1 - k) };
}

/**
 * Altezza (in pixel CSS della copia) della fascia di SezioneProblema visibile
 * nello schermo: a t=0 ha le proporzioni dello schermo, a t=1 è alta vh.
 */
export function altezzaFascia(
  t: number,
  schermo: Quad,
  vw: number,
  vh: number
): number {
  const { w, h } = rettangoloSchermo(schermo);
  const h0 = (vw * h) / w;
  return h0 + (vh - h0) * t;
}

const lerp = (a: Punto, b: Punto, t: number): Punto => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
];

/**
 * Dove stanno gli angoli della fascia della copia al tempo t dello zoom.
 * t=0: esattamente il quad dello schermo. t=1: esattamente la finestra.
 * In mezzo: zoom uniforme, residuo prospettico che si annulla e fascia che
 * si allunga verso il basso ("luce che cresce").
 */
export function angoliZoom(
  t: number,
  schermo: Quad,
  vw: number,
  vh: number
): Quad {
  const r = rettangoloSchermo(schermo);
  const { k, tx, ty } = trasformaZoom(t, schermo, vw);
  const G = (p: Punto): Punto => [k * p[0] + tx, k * p[1] + ty];
  const rett: Quad = [
    [r.x0, r.y0],
    [r.x0 + r.w, r.y0],
    [r.x0 + r.w, r.y0 + r.h],
    [r.x0, r.y0 + r.h],
  ];
  const base = schermo.map((p, i) => G(lerp(p, rett[i], t))) as Quad;
  // Altezza della fascia in pixel della finestra, meno quella già data dallo zoom.
  const scalaCopia = (k * r.w) / vw;
  const extra = altezzaFascia(t, schermo, vw, vh) * scalaCopia - k * r.h;
  base[2] = [base[2][0], base[2][1] + extra];
  base[3] = [base[3][0], base[3][1] + extra];
  return base;
}
