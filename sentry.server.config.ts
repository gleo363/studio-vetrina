// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://dafd93f7e0f6b7e1cf1af06e5a18b44c@o4511537916346368.ingest.de.sentry.io/4511537926176848",

  // 10% delle transazioni: sufficiente per il monitoring, non brucia quota
  tracesSampleRate: 0.1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Niente IP/header degli utenti verso Sentry (GDPR)
  sendDefaultPii: false,
});
