"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { EASE_VETRINA, DURATA } from "@/lib/motion";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  children: React.ReactNode;
  className?: string;
}

/* Se il testo termina con "→", la freccia scivola in avanti su hover. */
function conFreccia(children: React.ReactNode): React.ReactNode {
  if (typeof children === "string" && children.trimEnd().endsWith("→")) {
    const testo = children.trimEnd().slice(0, -1).trimEnd();
    return (
      <>
        {testo}
        <span className="freccia" aria-hidden="true">
          →
        </span>
      </>
    );
  }
  return children;
}

export default function Button({
  href,
  onClick,
  variant = "primary",
  children,
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 rounded-[10px] px-6 py-3 text-sm font-medium transition-colors cursor-pointer";
  const styles = {
    primary: "bg-cotto text-travertino hover:bg-[#a8431f]",
    ghost: "border border-inchiostro/20 text-inchiostro hover:bg-inchiostro/5",
  };
  const cls = `${base} ${styles[variant]} ${className}`;
  const transizione = { duration: DURATA.micro, ease: EASE_VETRINA };

  if (href) {
    return (
      <motion.div
        className="inline-flex"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={transizione}
        data-cursor="pointer"
      >
        <Link href={href} className={cls}>
          {conFreccia(children)}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      className={cls}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={transizione}
      data-cursor="pointer"
    >
      {conFreccia(children)}
    </motion.button>
  );
}
