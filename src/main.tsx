
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { initializeTheme } from "./lib/theme.ts";

// Initialize theme before rendering, but don't let it crash the app
try {
  initializeTheme();
} catch (error) {
  console.error("Theme initialization failed, but continuing app rendering:", error);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
