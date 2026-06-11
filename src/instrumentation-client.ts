// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://dafd93f7e0f6b7e1cf1af06e5a18b44c@o4511537916346368.ingest.de.sentry.io/4511537926176848",

  // Session Replay disattivato: registra le sessioni utente e richiederebbe
  // consenso esplicito (GDPR). Riattivabile in futuro dietro opt-in.

  // 10% delle transazioni: sufficiente per il monitoring, non brucia quota
  tracesSampleRate: 0.1,

  enableLogs: true,

  // Niente IP/header degli utenti verso Sentry (GDPR)
  sendDefaultPii: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
