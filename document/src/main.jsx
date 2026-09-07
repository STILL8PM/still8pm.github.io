import React from "react";
import { createRoot } from "react-dom/client";
import "antd/dist/antd.css";
import App from "./App";
import "./index.css";

/**
 * Mount the React application from the Vite entry module.
 *
 * Routing, shared services and page composition remain outside this bootstrap
 * module so startup stays deterministic and easy to test.
 */
const container = document.getElementById("root");

if (!container) {
  throw new Error("The root element is missing. The application cannot start.");
}

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
