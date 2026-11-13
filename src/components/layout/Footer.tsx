"use client";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SelettoreLingua from "@/components/ui/SelettoreLingua";
import { useTesti } from "@/components/providers/LinguaProvider";

const TESTI = {
  it: {
    nav: [
      { href: "/", label: "Home" },
      { href: "/esempi", label: "Esempi" },
      { href: "/studio", label: "Studio" },
      { href: "/perche-sceglierci", label: "Perché noi" },
      { href: "/qa", label: "Q&A" },
      { href: "/partner", label: "Partner" },
      { href: "/partner/accedi", label: "Accedi" },
    ],
    città: "Roma",
    motto: "Un solo segno, tre significati.",
  },
  en: {
    nav: [
      { href: "/", label: "Home" },
      { href: "/esempi", label: "Work" },
      { href: "/studio", label: "Studio" },
      { href: "/perche-sceglierci", label: "Why us" },
      { href: "/qa", label: "FAQ" },
      { href: "/partner", label: "Partners" },
      { href: "/partner/accedi", label: "Log in" },
    ],
    città: "Rome",
    motto: "One mark, three meanings.",
  },
};

export default function Footer() {
  const t = useTesti(TESTI);
  const navLinks = t.nav;
  return (
    <footer className="bg-inchiostro alone-cotto text-travertino border-t border-travertino/10 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection y={24}>
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
                  className="link-sottolineato text-sm text-travertino/50 hover:text-travertino transition-colors duration-200"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Lingua + copyright */}
            <div className="flex flex-col gap-4 md:items-end">
              <SelettoreLingua tono="chiaro" />
              <p
                className="text-sm text-travertino/40 whitespace-nowrap"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                © {new Date().getFullYear()} Studio Vetrina · {t.città}
              </p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection y={16} delay={0.3}>
          <p
            className="text-travertino/25 text-sm"
            style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}
          >
            {t.motto}
          </p>
        </AnimatedSection>
      </div>
    </footer>
  );
}
