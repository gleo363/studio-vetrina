"use client";

import { motion } from "framer-motion";
import { logoutPartner } from "@/app/actions/partner";
import { useLingua } from "@/components/providers/LinguaProvider";

export default function LogoutButton() {
  const lingua = useLingua();
  return (
    <form action={logoutPartner}>
      <motion.button
        type="submit"
        className="text-sm text-pietra hover:text-inchiostro transition-colors"
        style={{ fontFamily: "var(--font-inter)" }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        data-cursor="pointer"
      >
        {lingua === "en" ? "Log out" : "Esci"}
      </motion.button>
    </form>
  );
}
