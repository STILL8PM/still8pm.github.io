import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * 应用启动入口。
 *
 * Vite 直接加载此模块并挂载 React 应用，替代 CRA 隐式注入的入口流程。
 * 入口保持单一职责，公共配置、路由和页面逻辑由 App 及其子模块负责。
 */
const container = document.getElementById("root");

if (!container) {
  throw new Error("应用挂载节点不存在，无法启动之一的工作台。");
}

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
