// Rileva i 4 angoli dello schermo del laptop sugli ultimi fotogrammi (s ≥ 0,85).
//   node scripts/vetrina/angoli-schermo.mjs --formato desktop|mobile
// Lo schermo è acceso, caldo, uniforme e centrato: si parte dal pixel più luminoso
// nel riquadro centrale, si riempie la regione con luminanza ≥ 82% del seme e si
// prendono gli estremi di x+y e x−y. Scrive gli angoli nel JSON dei dati e
// un PNG di controllo per fotogramma in .verifiche/angoli/<formato>/.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { argomenti, FORMATI, MASTER, DATI, RADICE, nome, posizioneFotogramma, TEMPI } from "./comune.mjs";

const { formato } = argomenti();
const F = FORMATI[formato];
if (!F) throw new Error("--formato desktop|mobile");

const fileDati = path.join(DATI, `${formato}.json`);
const dati = JSON.parse(fs.readFileSync(fileDati, "utf8"));
const controllo = path.join(RADICE, ".verifiche/angoli", formato);
fs.mkdirSync(controllo, { recursive: true });

const primo = Math.floor(posizioneFotogramma(TEMPI.schermoInizio, F.n, F.n1));
const angoli = {};
for (let i = primo; i < F.n; i++) {
  const file = path.join(MASTER, formato, `${nome(i)}.png`);
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const lum = new Float32Array(w * h);
  for (let p = 0; p < w * h; p++) lum[p] = 0.299 * data[p * 3] + 0.587 * data[p * 3 + 1] + 0.114 * data[p * 3 + 2];

  // Seme: pixel più luminoso nel 30% centrale.
  let seme = -1, max = -1;
  for (let y = Math.floor(h * 0.35); y < h * 0.65; y++) {
    for (let x = Math.floor(w * 0.35); x < w * 0.65; x++) {
      if (lum[y * w + x] > max) { max = lum[y * w + x]; seme = y * w + x; }
    }
  }
  const soglia = max * 0.82;
  const visto = new Uint8Array(w * h);
  const coda = [seme];
  visto[seme] = 1;
  let tl = [0, 0, Infinity], br = [0, 0, -Infinity], tr = [0, 0, -Infinity], bl = [0, 0, Infinity];
  let area = 0;
  while (coda.length) {
    const p = coda.pop();
    const x = p % w, y = (p - x) / w;
    area++;
    if (x + y < tl[2]) tl = [x, y, x + y];
    if (x + y > br[2]) br = [x, y, x + y];
    if (x - y > tr[2]) tr = [x, y, x - y];
    if (x - y < bl[2]) bl = [x, y, x - y];
    for (const q of [p - 1, p + 1, p - w, p + w]) {
      if (q < 0 || q >= w * h || visto[q]) continue;
      if ((q === p - 1 && x === 0) || (q === p + 1 && x === w - 1)) continue;
      if (lum[q] >= soglia) { visto[q] = 1; coda.push(q); }
    }
  }
  // Bordo esterno dei pixel (angolo superiore-sinistro del pixel → +1 sui lati destro e basso).
  const quad = [[tl[0], tl[1]], [tr[0] + 1, tr[1]], [br[0] + 1, br[1] + 1], [bl[0], bl[1] + 1]];
  angoli[String(i)] = quad;
  const larghezzaSchermo = (quad[1][0] + quad[2][0] - quad[0][0] - quad[3][0]) / 2;
  console.log(`${nome(i)}: area ${area}px, larghezza ${(100 * larghezzaSchermo / w).toFixed(1)}% del fotogramma`, JSON.stringify(quad));

  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><polygon points="${quad.map((p) => p.join(",")).join(" ")}" fill="none" stroke="#ff2d55" stroke-width="${Math.max(1, w / 640)}"/></svg>`;
  await sharp(file).composite([{ input: Buffer.from(svg) }]).png().toFile(path.join(controllo, `${nome(i)}.png`));
}

dati.angoli = angoli;
fs.writeFileSync(fileDati, JSON.stringify(dati, null, 2) + "\n");
console.log(`angoli scritti in ${path.relative(RADICE, fileDati)}`);
