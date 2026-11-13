import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import { getLingua } from "@/lib/i18n/server";

const TESTI = {
  it: {
    eyebrow: "Errore 404",
    titolo: ["Questa pagina", "non esiste."],
    testo: "Forse il link è sbagliato, o la pagina è stata spostata. Torna alla home e riparti da lì.",
    cta: "Torna alla home →",
  },
  en: {
    eyebrow: "Error 404",
    titolo: ["This window", "is empty."],
    testo: "The link might be wrong, or the page has moved. Head back home and start again from there.",
    cta: "Back to home →",
  },
};

export default async function NotFound() {
  const t = TESTI[await getLingua()];
  return (
    <div className="relative min-h-screen bg-travertino alone-ocra flex items-center justify-center px-6 overflow-hidden">
      {/* Watermark decorativo: la cornice resta, anche dove non c'è nulla */}
      <div
        className="absolute bottom-0 right-0 pointer-events-none select-none opacity-[0.05]"
        aria-hidden="true"
      >
        <Logo variant="color" size={240} />
      </div>
      <AnimatedSection className="text-center">
        <p
          className="text-xs font-medium uppercase tracking-[0.2em] text-pietra mb-6"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {t.eyebrow}
        </p>
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-medium text-inchiostro leading-[0.95] tracking-tight mb-6"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          {t.titolo[0]}<br />{t.titolo[1]}
        </h1>
        <p
          className="text-base text-pietra max-w-sm mx-auto leading-relaxed mb-10"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {t.testo}
        </p>
        <Button href="/" variant="primary">
          {t.cta}
        </Button>
      </AnimatedSection>
    </div>
  );
}
