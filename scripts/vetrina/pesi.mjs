// Elenca i file della sequenza e delle copertine con le dimensioni, e controlla i tetti.
//   node scripts/vetrina/pesi.mjs   → exit 1 se un tetto è superato o mancano fotogrammi
import fs from "node:fs";
import path from "node:path";
import { FORMATI, PUBBLICO } from "./comune.mjs";

let ok = true;
const kb = (b) => `${(b / 1000).toFixed(1)} KB`;

for (const [formato, F] of Object.entries(FORMATI)) {
  const cartella = path.join(PUBBLICO, "sequenza-vetrina", formato);
  const file = fs.existsSync(cartella) ? fs.readdirSync(cartella).sort() : [];
  let totale = 0;
  console.log(`\n## ${formato} (${file.length} file)`);
  for (const f of file) {
    const b = fs.statSync(path.join(cartella, f)).size;
    totale += b;
    console.log(`${f}\t${kb(b)}`);
  }
  const passa = totale <= F.tetto && file.length === F.n;
  ok &&= passa;
  console.log(`TOTALE ${formato}: ${(totale / 1e6).toFixed(2)} MB su ${(F.tetto / 1e6).toFixed(1)} MB, ${file.length}/${F.n} fotogrammi → ${passa ? "OK" : "FUORI"}`);

  for (const ext of ["avif", "webp"]) {
    const cop = path.join(PUBBLICO, "vetrina-copertina", `${formato}.${ext}`);
    if (!fs.existsSync(cop)) { console.log(`copertina ${formato}.${ext}: MANCA`); ok = false; continue; }
    const b = fs.statSync(cop).size;
    const passaCop = b <= F.tettoCopertina;
    ok &&= passaCop;
    console.log(`copertina ${formato}.${ext}: ${kb(b)} su ${kb(F.tettoCopertina)} → ${passaCop ? "OK" : "FUORI"}`);
  }
}
process.exit(ok ? 0 : 1);
