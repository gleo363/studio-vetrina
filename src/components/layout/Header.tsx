"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";

const navLinks = [
  { href: "/lavori", label: "Lavori" },
  { href: "/studio", label: "Studio" },
  { href: "/perche-sceglierci", label: "Perché noi" },
  { href: "/partner", label: "Partner" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          backgroundColor: "rgba(243, 238, 228, 0.88)",
          padding: scrolled ? "8px 28px" : "16px 28px",
          boxShadow: scrolled ? "0 1px 0 rgba(27,26,24,0.08)" : "none",
          transition: "padding 0.4s ease, box-shadow 0.4s ease",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 no-underline"
            data-cursor="pointer"
          >
            <Logo variant="color" size={30} />
            <span
              className="text-lg font-medium text-inchiostro tracking-tight leading-none"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              vetrina
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-inchiostro/60 hover:text-inchiostro transition-colors duration-200"
                style={{ fontFamily: "var(--font-inter)" }}
                data-cursor="pointer"
              >
                {link.label}
              </Link>
            ))}
            <Button href="/contatti" variant="primary">
              Parliamone
            </Button>
          </nav>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Chiudi menu" : "Apri menu"}
            data-cursor="pointer"
          >
            <motion.span
              className="block w-6 h-px bg-inchiostro rounded-full"
              animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="block w-6 h-px bg-inchiostro rounded-full"
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-6 h-px bg-inchiostro rounded-full"
              animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-inchiostro/40"
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              className="absolute top-0 right-0 bottom-0 w-4/5 max-w-xs bg-travertino flex flex-col p-8 pt-24 gap-0"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-3xl text-inchiostro py-5 border-b border-inchiostro/10 leading-none"
                  style={{ fontFamily: "var(--font-fraunces)" }}
                  onClick={() => setMenuOpen(false)}
                  data-cursor="pointer"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-10">
                <Button
                  href="/contatti"
                  variant="primary"
                  className="w-full justify-center"
                >
                  Parliamone
                </Button>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
