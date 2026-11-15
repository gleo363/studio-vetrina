// Misura il rettangolo dello schermo acceso in un'immagine (fotogramma chiave o master).
//   node scripts/vetrina/misura-schermo.mjs <file.png> [...]
import sharp from "sharp";

for (const file of process.argv.slice(2)) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  const L = (p) => 0.299 * data[p * 3] + 0.587 * data[p * 3 + 1] + 0.114 * data[p * 3 + 2];
  let seme = -1, max = -1;
  for (let y = Math.floor(h * 0.3); y < h * 0.7; y++) {
    for (let x = Math.floor(w * 0.3); x < w * 0.7; x++) {
      const l = L(y * w + x);
      if (l > max) { max = l; seme = y * w + x; }
    }
  }
  const soglia = max * 0.82;
  const visto = new Uint8Array(w * h);
  const coda = [seme];
  visto[seme] = 1;
  let x0 = w, x1 = 0, y0 = h, y1 = 0;
  while (coda.length) {
    const p = coda.pop();
    const x = p % w, y = (p - x) / w;
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    for (const q of [p - 1, p + 1, p - w, p + w]) {
      if (q < 0 || q >= w * h || visto[q]) continue;
      if (L(q) >= soglia) { visto[q] = 1; coda.push(q); }
    }
  }
  console.log(file, JSON.stringify({
    w, h, luce: Math.round(max), x0, x1, y0, y1,
    quotaLarghezza: +((x1 - x0 + 1) / w).toFixed(3),
    centro: [+((x0 + x1) / 2 / w).toFixed(3), +((y0 + y1) / 2 / h).toFixed(3)],
  }));
}
