"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

interface QrCodePartnerProps {
  url: string;
  codice: string;
}

export default function QrCodePartner({ url, codice }: QrCodePartnerProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  function scaricaQr() {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `vetrina-partner-${codice}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={canvasRef}
        className="bg-white p-3 rounded-xl shadow-sm"
      >
        <QRCodeCanvas value={url} size={160} />
      </div>
      <button
        onClick={scaricaQr}
        className="text-xs font-medium text-pietra hover:text-inchiostro transition-colors uppercase tracking-wider"
        style={{ fontFamily: "var(--font-inter)" }}
        data-cursor="pointer"
      >
        Scarica QR →
      </button>
    </div>
  );
}
