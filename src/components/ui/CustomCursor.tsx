"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const x = useSpring(mouseX, { damping: 25, stiffness: 300, mass: 0.5 });
  const y = useSpring(mouseY, { damping: 25, stiffness: 300, mass: 0.5 });

  useEffect(() => {
    setMounted(true);
    if (window.innerWidth <= 768) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);
      const el = e.target as HTMLElement;
      setIsPointer(
        !!el.closest('[data-cursor="pointer"], a, button, [role="button"]')
      );
    };
    const onLeave = () => setVisible(false);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
        opacity: visible ? 1 : 0,
      }}
    >
      <motion.div
        animate={{
          width: isPointer ? 36 : 12,
          height: isPointer ? 36 : 12,
          backgroundColor: isPointer ? "rgba(191,77,44,0.15)" : "rgba(191,77,44,0)",
        }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          border: "1.5px solid #BF4D2C",
          borderRadius: "50%",
        }}
      />
    </motion.div>
  );
}
