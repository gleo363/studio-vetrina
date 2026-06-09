import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-travertino flex items-center justify-center px-6">
      <AnimatedSection className="text-center">
        <p
          className="text-xs font-medium uppercase tracking-[0.2em] text-pietra mb-6"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Errore 404
        </p>
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-medium text-inchiostro leading-[0.95] tracking-tight mb-6"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          Questa pagina<br />non esiste.
        </h1>
        <p
          className="text-base text-pietra max-w-sm mx-auto leading-relaxed mb-10"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Forse il link è sbagliato, o la pagina è stata spostata. Torna alla home e riparti da lì.
        </p>
        <Button href="/" variant="primary">
          Torna alla home →
        </Button>
      </AnimatedSection>
    </div>
  );
}
