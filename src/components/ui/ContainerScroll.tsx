"use client";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

export function ContainerScroll({
  titleComponent,
  children,
}: {
  titleComponent: React.ReactNode;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = useState(false);
  // La guardia si attiva solo dopo il mount: la card parte ruotata,
  // quindi decidere in fase di hydration creerebbe un mismatch col server.
  const sistemaRiduci = useReducedMotion();
  const [montato, setMontato] = useState(false);
  const riduciMovimento = montato && sistemaRiduci;

  useEffect(() => {
    setMontato(true);
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [0.7, 0.9] : [1.05, 1]
  );
  const translateY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <div
      ref={containerRef}
      className="h-[60rem] md:h-[72rem] flex items-center justify-center relative px-4 md:px-20 bg-travertino"
    >
      <div
        className="py-10 md:py-40 w-full relative"
        style={{ perspective: "1000px" }}
      >
        {/* Titolo che sale mentre scorri */}
        <motion.div
          style={riduciMovimento ? undefined : { translateY }}
          className="max-w-5xl mx-auto text-center mb-8"
        >
          {titleComponent}
        </motion.div>

        {/* Card con prospettiva 3D — piatta se il movimento è ridotto */}
        <motion.div
          style={{
            ...(riduciMovimento
              ? { rotateX: 0, scale: 1 }
              : { rotateX: rotate, scale }),
            boxShadow:
              "0 0 rgba(27,26,24,0.30), 0 9px 20px rgba(27,26,24,0.29), 0 37px 37px rgba(27,26,24,0.26), 0 84px 50px rgba(27,26,24,0.15), 0 149px 60px rgba(27,26,24,0.04), 0 233px 65px rgba(27,26,24,0.01)",
          }}
          className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-inchiostro/65 p-2 md:p-4 bg-inchiostro rounded-[30px]"
        >
          <div className="h-full w-full overflow-hidden rounded-2xl bg-glass">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
