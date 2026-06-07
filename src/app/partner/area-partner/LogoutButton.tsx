"use client";

import { motion } from "framer-motion";
import { logoutPartner } from "@/app/actions/partner";

export default function LogoutButton() {
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
        Esci
      </motion.button>
    </form>
  );
}
