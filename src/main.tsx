
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { initializeTheme } from "./lib/theme.ts";

// Safely get root element - provide fallback if not found
const getRootElement = () => {
  const root = document.getElementById("root");
  if (!root) {
    console.error("Root element not found, creating one");
    const fallbackRoot = document.createElement("div");
    fallbackRoot.id = "root";
    document.body.appendChild(fallbackRoot);
    return fallbackRoot;
  }
  return root;
};

// Create a stable error handler
const handleError = (error: any) => {
  console.error("Application error:", error);
};

// Set up global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Initialize theme before rendering, but don't let it crash the app
try {
  initializeTheme();
} catch (error) {
  console.error("Theme initialization failed, but continuing app rendering:", error);
}

// Make rendering resilient by wrapping in try/catch
try {
  ReactDOM.createRoot(getRootElement()).render(
    <React.StrictMode>
      <React.ErrorBoundary fallback={<div>Something went wrong. Please refresh the page.</div>}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.ErrorBoundary>
    </React.StrictMode>,
  );
} catch (error) {
  handleError(error);
  
  // Display a fallback message if rendering fails
  const rootElement = getRootElement();
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: system-ui, sans-serif;">
      <h1>Something went wrong</h1>
      <p>We're sorry, but the application failed to load. Please try refreshing the page.</p>
      <button onclick="window.location.reload()" style="padding: 8px 16px; margin-top: 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Refresh Page
      </button>
    </div>
  `;
}
