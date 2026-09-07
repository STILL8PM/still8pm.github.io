import React from "react";
import { Spin, Typography } from "antd";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Admin from "./pages/Admin";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { WorkbenchProvider, useWorkbench } from "./context/WorkbenchContext";
import { isAdminSession } from "./services/authService";
import "./App.css";

const { Text } = Typography;

/** Allow the administration routes only for a verified administrator session. */
function AdminRoute() {
  const location = useLocation();
  const workbench = useWorkbench();

  if (workbench.status === "idle" || workbench.status === "loading") {
    return <div className="route-loading"><Spin size="large" /><Text type="secondary">正在验证管理员身份</Text></div>;
  }

  if (!isAdminSession(workbench.session)) {
    return <Navigate to="/login" replace state={{ from: location.pathname, reason: "admin-required" }} />;
  }

  return <Admin />;
}

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
          <Route path="/admin/*" element={<AdminRoute />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </WorkbenchProvider>
    </HashRouter>
  );
}
