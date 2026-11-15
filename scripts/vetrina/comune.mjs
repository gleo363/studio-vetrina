// Parti comuni agli script della scena "La vetrina che si accende".
import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

export const RADICE = path.resolve(import.meta.dirname, "../..");
export const SORGENTI = path.join(RADICE, "media-src/vetrina-scroll");
export const VIDEO = path.join(SORGENTI, "video");
/** Master PNG rigenerabili dai video: fuori da OneDrive, nella cartella temporanea. */
export const MASTER = path.join(os.tmpdir(), "vetrina-master");
export const PUBBLICO = path.join(RADICE, "public");
export const DATI = path.join(RADICE, "src/components/home/vetrina/dati");

/** Valori dal piano (Vincoli globali). */
export const FORMATI = {
  desktop: { larghezza: 1920, altezza: 1080, n: 120, n1: 59, tetto: 7_000_000, tettoCopertina: 150_000 },
  mobile: { larghezza: 506, altezza: 900, n: 100, n1: 49, tetto: 3_500_000, tettoCopertina: 80_000 },
};

/** Stessi tempi di src/components/home/vetrina/sequenza.ts (TEMPI). */
export const TEMPI = { clip1Fine: 0.45, schermoInizio: 0.85, fotogrammiFine: 0.92 };

export function posizioneFotogramma(s, n, n1) {
  const x = Math.min(1, Math.max(0, s));
  if (x <= TEMPI.clip1Fine) return (x / TEMPI.clip1Fine) * n1;
  if (x >= TEMPI.fotogrammiFine) return n - 1;
  const u = (x - TEMPI.clip1Fine) / (TEMPI.fotogrammiFine - TEMPI.clip1Fine);
  return n1 + u * (n - 1 - n1);
}

export function argomenti() {
  const a = {};
  const v = process.argv.slice(2);
  for (let i = 0; i < v.length; i++) {
    if (v[i].startsWith("--")) {
      const k = v[i].slice(2);
      a[k] = v[i + 1] && !v[i + 1].startsWith("--") ? v[++i] : true;
    }
  }
  return a;
}

export function contaFotogrammi(file) {
  const out = execFileSync(
    "ffprobe",
    ["-v", "error", "-count_frames", "-select_streams", "v:0", "-show_entries", "stream=nb_read_frames", "-of", "csv=p=0", file],
    { encoding: "utf8" }
  );
  return Number(out.trim());
}

export const nome = (i) => String(i + 1).padStart(4, "0");

/** SSIM sulla luminanza, finestre 8×8 non sovrapposte. a e b: buffer RGB grezzi. */
export function ssim(a, b, w, h) {
  const L = (buf, i) => 0.299 * buf[i] + 0.587 * buf[i + 1] + 0.114 * buf[i + 2];
  const C1 = (0.01 * 255) ** 2;
  const C2 = (0.03 * 255) ** 2;
  let somma = 0;
  let finestre = 0;
  for (let y = 0; y + 8 <= h; y += 8) {
    for (let x = 0; x + 8 <= w; x += 8) {
      let ma = 0, mb = 0;
      const va = [], vb = [];
      for (let yy = 0; yy < 8; yy++) {
        for (let xx = 0; xx < 8; xx++) {
          const i = ((y + yy) * w + (x + xx)) * 3;
          const pa = L(a, i), pb = L(b, i);
          va.push(pa); vb.push(pb);
          ma += pa; mb += pb;
        }
      }
      ma /= 64; mb /= 64;
      let sa = 0, sb = 0, sab = 0;
      for (let k = 0; k < 64; k++) {
        sa += (va[k] - ma) ** 2;
        sb += (vb[k] - mb) ** 2;
        sab += (va[k] - ma) * (vb[k] - mb);
      }
      sa /= 63; sb /= 63; sab /= 63;
      somma += ((2 * ma * mb + C1) * (2 * sab + C2)) / ((ma * ma + mb * mb + C1) * (sa + sb + C2));
      finestre++;
    }
  }
  return somma / finestre;
}

export async function grezzo(input) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}

export async function codifica(pngBuffer, formato, qualita) {
  const s = sharp(pngBuffer);
  return formato === "avif"
    ? s.avif({ quality: qualita, effort: 6, chromaSubsampling: "4:2:0" }).toBuffer()
    : s.webp({ quality: qualita, effort: 6, smartSubsample: true }).toBuffer();
}
