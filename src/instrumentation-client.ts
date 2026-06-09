// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://dafd93f7e0f6b7e1cf1af06e5a18b44c@o4511537916346368.ingest.de.sentry.io/4511537926176848",

  integrations: [Sentry.replayIntegration()],

  tracesSampleRate: 1,

  enableLogs: true,

  replaysSessionSampleRate: 0.1,

  replaysOnErrorSampleRate: 1.0,

  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
