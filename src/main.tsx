import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { applyDesignTokens } from "./lib/tokens";

// Apply design tokens
applyDesignTokens();

// Render app immediately without waiting for MSW
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
