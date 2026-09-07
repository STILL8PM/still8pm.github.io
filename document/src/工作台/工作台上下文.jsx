import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  工作台配置,
  是否已配置工作台后台,
} from "../配置/环境配置";
import { 创建认证服务 } from "../公共/认证服务";
import { 创建请求客户端 } from "../公共/请求客户端";
import { 创建工作台数据源 } from "../公共/工作台数据源";

const 工作台Context = createContext(null);

/**
 * 工作台全局状态提供者。
 *
 * 该上下文只管理跨页面共享的基础状态：后台连接、登录会话和仓库状态。
 * 具体业务数据应由业务模块自行调用数据源并管理，避免所有功能耦合到
 * 一个不断膨胀的全局 Store。
 *
 * @param {Object} props React 属性
 * @param {React.ReactNode} props.children 子节点
 * @returns {JSX.Element} 上下文提供者
 */
export function WorkbenchProvider({ children }) {
  const [state, setState] = useState({
    status: "idle",
    session: null,
    repository: null,
    error: null,
  });
  const request = useMemo(
    () => 创建请求客户端({ baseUrl: 工作台配置.apiBaseUrl }),
    []
  );
  const dataSource = useMemo(() => 创建工作台数据源({ request }), [request]);
  const authService = useMemo(
    () => 创建认证服务({ baseUrl: 工作台配置.apiBaseUrl }),
    []
  );

  /**
   * 刷新登录会话和仓库连接状态。
   *
   * 两个请求彼此独立，单个状态接口失败不会覆盖另一个成功结果；但
   * 如果全部失败，则向页面暴露统一错误，页面可以提供重试入口。
   */
  const refresh = useCallback(async () => {
    if (!是否已配置工作台后台()) {
      setState({
        status: "not-configured",
        session: null,
        repository: null,
        error: null,
      });
      return;
    }

    setState((current) => ({ ...current, status: "loading", error: null }));
    const [sessionResult, repositoryResult] = await Promise.allSettled([
      dataSource.获取会话(),
      dataSource.获取仓库状态(),
    ]);
    const session =
      sessionResult.status === "fulfilled" ? sessionResult.value : null;
    const repository =
      repositoryResult.status === "fulfilled"
        ? repositoryResult.value
        : null;
    const error =
      sessionResult.status === "rejected" && repositoryResult.status === "rejected"
        ? sessionResult.reason
        : null;

    setState({
      status: error ? "error" : "ready",
      session,
      repository,
      error,
    });
  }, [dataSource]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      ...state,
      config: 工作台配置,
      request,
      dataSource,
      authService,
      refresh,
    }),
    [state, request, dataSource, authService, refresh]
  );

  return <工作台Context.Provider value={value}>{children}</工作台Context.Provider>;
}

/**
 * 读取工作台上下文。
 *
 * @returns {Object} 工作台基础状态和公共服务
 * @throws {Error} 在提供者之外使用时抛出明确错误
 */
export function useWorkbench() {
  const context = useContext(工作台Context);
  if (!context) {
    throw new Error("useWorkbench 必须在 WorkbenchProvider 内部使用。");
  }
  return context;
}

