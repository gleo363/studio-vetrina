import Link from "next/link";
import Logo from "@/components/ui/Logo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/esempi", label: "Esempi" },
  { href: "/studio", label: "Studio" },
  { href: "/perche-sceglierci", label: "Perché noi" },
  { href: "/partner", label: "Partner" },
  { href: "/partner/accedi", label: "Accedi" },
  { href: "/contatti", label: "Contatti" },
];

export default function Footer() {
  return (
    <footer className="bg-inchiostro text-travertino px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-14">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Logo variant="light" size={30} />
            <span
              className="text-lg font-medium text-travertino tracking-tight"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              vetrina
            </span>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-travertino/50 hover:text-travertino transition-colors duration-200"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p
            className="text-sm text-travertino/40 whitespace-nowrap"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            © {new Date().getFullYear()} Studio Vetrina · Roma
          </p>
        </div>

        <p
          className="text-travertino/25 text-sm"
          style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}
        >
          Un solo segno, tre significati.
        </p>
      </div>
    </footer>
  );
}
