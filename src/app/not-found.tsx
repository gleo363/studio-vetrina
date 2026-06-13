import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";

export default function NotFound() {
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
