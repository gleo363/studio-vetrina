"use client";
import Link from "next/link";
import { motion } from "framer-motion";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  children: React.ReactNode;
  className?: string;
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

  if (href) {
    return (
      <motion.div
        className="inline-flex"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2 }}
        data-cursor="pointer"
      >
        <Link href={href} className={cls}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      className={cls}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      data-cursor="pointer"
    >
      {children}
    </motion.button>
  );
}
