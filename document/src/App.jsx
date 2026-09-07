import React from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import Admin from "./pages/Admin";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { WorkbenchProvider } from "./context/WorkbenchContext";
import "./App.css";

/**
 * Application shell for the administration-first workbench.
 *
 * HashRouter is required by the current GitHub Pages deployment because the
 * static host cannot provide server-side route fallback for nested URLs.
 */
export default function App() {
  return (
    <HashRouter>
      <WorkbenchProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </WorkbenchProvider>
    </HashRouter>
  );
}
