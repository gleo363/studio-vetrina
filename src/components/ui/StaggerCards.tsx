"use client";
import { motion } from "framer-motion";
import { EASE_VETRINA, VIEWPORT_ONCE } from "@/lib/motion";

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_VETRINA },
  },
};

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
}

interface ItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerContainer({
  children,
  className = "",
  stagger = 0.1,
  delayChildren = 0,
}: ContainerProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: ItemProps) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
