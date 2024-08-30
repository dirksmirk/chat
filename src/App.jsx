import SideNav from './components/SideNav.jsx';
import Switch from './components/Switch.jsx';
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://8d143b8812ab97d6fe73f99c6fdb2603@o4507868484993024.ingest.de.sentry.io/4507868486762576",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["http://localhost:5173/"],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

function App() {
  return (
      <div style={({ display: "flex" })}>
        <SideNav />
        <Switch />
      </div>
  )
}

export default App;
