// Estrae, ridimensiona e codifica i fotogrammi della scena.
//   node scripts/vetrina/fotogrammi.mjs --formato desktop|mobile --taglio <n> [--fine <n>] [--campione] [--ricalibra]
// Input:  media-src/vetrina-scroll/video/<formato>.mp4 (take unico: saracinesca, poi carrellata)
//   --taglio: indice (da 0) del primo fotogramma con la saracinesca tutta su = inizio della carrellata
//   --fine:   ultimo fotogramma da usare (default: l'ultimo del video)
// Output: public/sequenza-vetrina/<formato>/0001.<ext>…, public/vetrina-copertina/<formato>.{avif,webp},
//         src/components/home/vetrina/dati/<formato>.json (gli angoli esistenti restano).
// --campione: scrive solo 12 fotogrammi distribuiti più quelli da s 0,85 in poi (prova del CP3).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  argomenti, FORMATI, VIDEO, MASTER, PUBBLICO, DATI, SORGENTI,
  contaFotogrammi, nome, ssim, grezzo, codifica, posizioneFotogramma, TEMPI,
} from "./comune.mjs";

const arg = argomenti();
const formato = arg.formato;
const F = FORMATI[formato];
if (!F) throw new Error("--formato desktop|mobile");

const video = path.join(VIDEO, `${formato}.mp4`);
const cartellaMaster = path.join(MASTER, formato);
const n2 = F.n - F.n1;

// 1. Quali fotogrammi del video prendere: n1 sulla saracinesca, n2 sulla carrellata.
const lunghezza = contaFotogrammi(video);
const taglio = Number(arg.taglio);
const fine = arg.fine !== undefined ? Number(arg.fine) : lunghezza - 1;
if (!(taglio > F.n1 && fine - taglio + 1 >= n2 && fine < lunghezza)) {
  throw new Error(`--taglio ${arg.taglio} / --fine ${fine} non validi (video di ${lunghezza} fotogrammi)`);
}
const scelti1 = Array.from({ length: F.n1 }, (_, i) => Math.round((i * taglio) / F.n1));
const scelti2 = Array.from({ length: n2 }, (_, j) => taglio + Math.round((j * (fine - taglio)) / (n2 - 1)));
console.log(`${formato}: ${lunghezza} fotogrammi, taglio ${taglio}, fine ${fine} → ${F.n1} + ${n2}`);

// Color correction del brief, uguale su tutta la sequenza: il nero va verso l'inchiostro
// #1B1A18 (mai nero puro), il bianco verso il travertino #F3EEE4, i mezzitoni restano.
const CORREZIONE =
  "curves=r='0/0.106 0.5/0.5 1/0.953':g='0/0.102 0.5/0.5 1/0.933':b='0/0.094 0.5/0.5 1/0.894'";

// 2. Master PNG ridimensionati (rigenerabili, nella cartella temporanea).
function estrai(video, indici, primo) {
  const sel = indici.map((n) => `eq(n\\,${n})`).join("+");
  const tmp = path.join(cartellaMaster, "_tmp");
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  execFileSync("ffmpeg", [
    "-v", "error", "-y", "-i", video,
    "-vf", `select='${sel}',${CORREZIONE},scale=${F.larghezza}:${F.altezza}:flags=lanczos`,
    "-fps_mode", "vfr", path.join(tmp, "%04d.png"),
  ]);
  const usciti = fs.readdirSync(tmp).sort();
  if (usciti.length !== indici.length) throw new Error(`attesi ${indici.length}, estratti ${usciti.length}`);
  usciti.forEach((f, k) => fs.renameSync(path.join(tmp, f), path.join(cartellaMaster, `${nome(primo + k)}.png`)));
  fs.rmSync(tmp, { recursive: true, force: true });
}
fs.mkdirSync(cartellaMaster, { recursive: true });
const firma = `${fs.statSync(video).mtimeMs}-${taglio}-${fine}-${F.larghezza}-${CORREZIONE}`;
const fileFirma = path.join(cartellaMaster, "firma.txt");
if (!fs.existsSync(fileFirma) || fs.readFileSync(fileFirma, "utf8") !== firma) {
  for (const f of fs.readdirSync(cartellaMaster)) fs.rmSync(path.join(cartellaMaster, f), { recursive: true, force: true });
  estrai(video, [...scelti1, ...scelti2], 0);
  fs.writeFileSync(fileFirma, firma);
}
const master = (i) => path.join(cartellaMaster, `${nome(i)}.png`);

// 3. Calibrazione: qualità minima con SSIM medio ≥ 0,97, per AVIF e WebP; vince il più leggero.
const fileCodifica = path.join(SORGENTI, `codifica-${formato}.json`);
let scelta = fs.existsSync(fileCodifica) && !arg.ricalibra ? JSON.parse(fs.readFileSync(fileCodifica, "utf8")) : null;
if (!scelta) {
  const prova = Array.from({ length: 6 }, (_, k) => Math.round((k * (F.n - 1)) / 5));
  const riferimenti = await Promise.all(prova.map((i) => grezzo(master(i))));
  const pngs = prova.map((i) => fs.readFileSync(master(i)));
  async function misura(fmt, q) {
    let byte = 0, s = 0;
    for (let k = 0; k < prova.length; k++) {
      const buf = await codifica(pngs[k], fmt, q);
      byte += buf.length;
      const d = await grezzo(buf);
      s += ssim(riferimenti[k].data, d.data, d.w, d.h);
    }
    return { media: byte / prova.length, ssim: s / prova.length };
  }
  const risultati = {};
  for (const fmt of ["avif", "webp"]) {
    let lo = 20, hi = 95, migliore = null;
    while (lo <= hi) {
      const q = Math.floor((lo + hi) / 2);
      const m = await misura(fmt, q);
      if (m.ssim >= 0.97) { migliore = { qualita: q, ...m }; hi = q - 1; } else lo = q + 1;
    }
    risultati[fmt] = migliore ?? { qualita: 95, ...(await misura(fmt, 95)) };
    console.log(fmt, risultati[fmt]);
  }
  const fmt = risultati.avif.media <= risultati.webp.media ? "avif" : "webp";
  scelta = { formato: fmt, ...risultati[fmt], confronto: risultati };
  // Rispetto del tetto: se la stima lo supera, si scende di qualità.
  while (scelta.media * F.n > F.tetto * 0.97 && scelta.qualita > 20) {
    const q = scelta.qualita - 3;
    const m = await misura(fmt, q);
    scelta = { ...scelta, qualita: q, ...m, ridottaPerTetto: true };
  }
  fs.writeFileSync(fileCodifica, JSON.stringify(scelta, null, 2));
}
console.log(`scelta: ${scelta.formato} q${scelta.qualita}, SSIM ${scelta.ssim.toFixed(4)}, stima ${(scelta.media * F.n / 1e6).toFixed(2)} MB`);

// 4. Fotogrammi della sequenza.
const cartellaSeq = path.join(PUBBLICO, "sequenza-vetrina", formato);
fs.rmSync(cartellaSeq, { recursive: true, force: true });
fs.mkdirSync(cartellaSeq, { recursive: true });
const primoSchermo = Math.floor(posizioneFotogramma(TEMPI.schermoInizio, F.n, F.n1));
const indici = arg.campione
  ? [...new Set([...Array.from({ length: 12 }, (_, k) => Math.round((k * (F.n - 1)) / 11)), ...Array.from({ length: F.n - primoSchermo }, (_, k) => primoSchermo + k)])].sort((a, b) => a - b)
  : Array.from({ length: F.n }, (_, i) => i);
let totale = 0;
for (const i of indici) {
  const buf = await codifica(fs.readFileSync(master(i)), scelta.formato, scelta.qualita);
  fs.writeFileSync(path.join(cartellaSeq, `${nome(i)}.${scelta.formato}`), buf);
  totale += buf.length;
}
console.log(`${indici.length} fotogrammi, ${(totale / 1e6).toFixed(2)} MB`);

// 5. Copertina: fotogramma 1, qualità più alta che sta nel tetto, AVIF + WebP.
const cartellaCop = path.join(PUBBLICO, "vetrina-copertina");
fs.mkdirSync(cartellaCop, { recursive: true });
const png0 = fs.readFileSync(master(0));
for (const fmt of ["avif", "webp"]) {
  let q = 90, buf;
  do { buf = await codifica(png0, fmt, q); q -= 4; } while (buf.length > F.tettoCopertina && q > 20);
  fs.writeFileSync(path.join(cartellaCop, `${formato}.${fmt}`), buf);
  console.log(`copertina ${formato}.${fmt}: ${(buf.length / 1000).toFixed(1)} KB (q${q + 4})`);
}

// 6. Dati per il componente (gli angoli li scrive angoli-schermo.mjs).
fs.mkdirSync(DATI, { recursive: true });
const fileDati = path.join(DATI, `${formato}.json`);
const prec = fs.existsSync(fileDati) ? JSON.parse(fs.readFileSync(fileDati, "utf8")) : {};
fs.writeFileSync(fileDati, JSON.stringify({
  fotogrammi: F.n, primaClip: F.n1, larghezza: F.larghezza, altezza: F.altezza,
  estensione: scelta.formato, angoli: prec.angoli ?? {},
}, null, 2) + "\n");
