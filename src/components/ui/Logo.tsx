"use client";
import { useId } from "react";

type LogoVariant = "color" | "light" | "dark";

interface LogoProps {
  variant?: LogoVariant;
  size?: number;
}

export default function Logo({ variant = "color", size = 40 }: LogoProps) {
  const id = useId();
  const clipId = `glass-${id}`;

  const fills: Record<LogoVariant, { frame: string; stroke: string; shelf: string }> = {
    color: { frame: "#FBF9F3", stroke: "#1B1A18", shelf: "#1B1A18" },
    light: { frame: "#FBF9F3", stroke: "#F3EEE4", shelf: "#F3EEE4" },
    dark:  { frame: "#1B1A18", stroke: "#F3EEE4", shelf: "#F3EEE4" },
  };
  const { frame, stroke, shelf } = fills[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-label="Studio Vetrina"
      role="img"
    >
      <clipPath id={clipId}>
        <rect x="25.5" y="11.5" width="49" height="77" rx="10.5" />
      </clipPath>
      <rect
        x="22" y="8" width="56" height="84" rx="14"
        fill={frame}
        stroke={stroke}
        strokeWidth="6"
      />
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M25 11 L75 11 L75 34 L52 47 Q50 49 48 47 L25 34 Z"
          fill="#BF4D2C"
        />
      </g>
      <rect x="36" y="78" width="28" height="4.5" rx="2.25" fill={shelf} />
    </svg>
  );
}
