"use client";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/ui/StaggerCards";

// SEGNAPOSTO: queste recensioni sono INVENTATE. Sostituirle con recensioni
// reali (testo, nome, attività) prima di pubblicare in produzione.
const recensioni = [
  {
    testo:
      "Mi hanno consegnato il sito nei tempi promessi e senza che dovessi occuparmi di niente. Finalmente una vetrina online che somiglia davvero al mio locale.",
    nome: "Nome Cognome",
    attivita: "Ristorante",
  },
  {
    testo:
      "Prima avevo un sito fatto con un modello, uguale a quello di tanti altri. Ora i clienti mi dicono che si vede la differenza, e mi trovano anche su Google.",
    nome: "Nome Cognome",
    attivita: "Salone",
  },
  {
    testo:
      "Prezzo chiaro fin dall'inizio, una persona sempre pronta a rispondere e un sito che è mio. Non chiedevo altro.",
    nome: "Nome Cognome",
    attivita: "Bottega",
  },
];

export default function SezioneRecensioni() {
  return (
    <section className="bg-glass px-6 py-28">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="mb-20 max-w-3xl">
          <h2
            className="text-3xl md:text-4xl lg:text-[44px] font-medium leading-[1.1] text-inchiostro"
            style={{ fontFamily: "var(--font-fraunces)" }}
          >
            Cosa dicono di noi.
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recensioni.map((r, i) => (
            <StaggerItem key={i} className="h-full">
              <figure className="border border-linea rounded-2xl p-6 md:p-8 h-full flex flex-col bg-travertino">
                <blockquote
                  className="text-lg leading-snug text-inchiostro mb-8 flex-1"
                  style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}
                >
                  &ldquo;{r.testo}&rdquo;
                </blockquote>
                <figcaption style={{ fontFamily: "var(--font-inter)" }}>
                  <span className="block text-sm font-medium text-inchiostro">{r.nome}</span>
                  <span className="block text-sm text-pietra">{r.attivita}</span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
