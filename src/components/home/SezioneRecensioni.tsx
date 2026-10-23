"use client";
import { useRef } from "react";
import Script from "next/script";
import AnimatedSection from "@/components/ui/AnimatedSection";

declare global {
  interface Window {
    Trustpilot?: { loadFromElement: (el: HTMLElement, force?: boolean) => void };
  }
}

export default function SezioneRecensioni() {
  const widgetRef = useRef<HTMLDivElement>(null);

  // Lo script di Trustpilot cerca i widget solo al primo caricamento:
  // a ogni montaggio (anche dopo una navigazione client) lo riavviamo a mano.
  const caricaWidget = () => {
    if (window.Trustpilot && widgetRef.current) {
      window.Trustpilot.loadFromElement(widgetRef.current, true);
    }
  };

  return (
    <section className="bg-glass px-6 py-28">
      <Script
        src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        strategy="afterInteractive"
        onReady={caricaWidget}
      />
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="max-w-xl mx-auto text-center">
          <p
            className="text-lg md:text-xl text-pietra mb-8 leading-snug"
            style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic" }}
          >
            Hai lavorato con noi? Raccontaci com&apos;è andata, con una recensione su Trustpilot.
          </p>

          {/* TrustBox widget - Review Collector */}
          <div
            ref={widgetRef}
            className="trustpilot-widget"
            data-locale="en-US"
            data-template-id="56278e9abfbbba0bdcd568bc"
            data-businessunit-id="6adb6bc791bd82e6106bf5c6"
            data-style-height="52px"
            data-style-width="100%"
          >
            <a
              href="https://www.trustpilot.com/review/studiovetrina.it"
              target="_blank"
              rel="noopener"
            >
              Trustpilot
            </a>
          </div>
          {/* End TrustBox widget */}
        </AnimatedSection>
      </div>
    </section>
  );
}
