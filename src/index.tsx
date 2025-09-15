import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as Sentry from "@sentry/react";
// Remove the unused import since it's not needed in React
// import { useAuthStore } from './stores/authStore';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [
    // Use Sentry.browserTracingIntegration() for newer versions
    Sentry.browserTracingIntegration(),
    // Or if using older version, use:
    // Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
  environment: process.env.REACT_APP_ENVIRONMENT || "development",
  beforeSend(event) {
    // Optionally attach user context if available
    try {
      const auth = JSON.parse(localStorage.getItem("auth-storage") || "{}");
      if (auth && auth.state && auth.state.user) {
        event.user = {
          id: auth.state.user.id,
          email: auth.state.user.email,
          username: auth.state.user.firstName + " " + auth.state.user.lastName,
          role: auth.state.user.role,
        };
      }
    } catch {}
    return event;
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
