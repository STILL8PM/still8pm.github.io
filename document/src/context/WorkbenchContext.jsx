import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { appConfig, isBackendConfigured } from "../config/environment";
import { createAuthService } from "../services/authService";
import { createRequestClient } from "../services/requestClient";
import { createWorkbenchDataSource } from "../services/workbenchDataSource";

const WorkbenchContext = createContext(null);

/**
 * Provide shared backend state and service instances.
 *
 * This context owns only authentication and repository connection state. A
 * feature page should keep its own domain data instead of growing one global
 * store for every future workbench module.
 */
export function WorkbenchProvider({ children }) {
  const [state, setState] = useState({
    status: "idle",
    session: null,
    repository: null,
    error: null,
  });
  const request = useMemo(
    () => createRequestClient({ baseUrl: appConfig.apiBaseUrl }),
    []
  );
  const dataSource = useMemo(() => createWorkbenchDataSource({ request }), [request]);
  const authService = useMemo(
    () => createAuthService({ baseUrl: appConfig.apiBaseUrl }),
    []
  );

  /** Refresh session and repository state independently. */
  const refresh = useCallback(async () => {
    if (!isBackendConfigured()) {
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
      dataSource.getSession(),
      dataSource.getRepositoryStatus(),
    ]);
    const session =
      sessionResult.status === "fulfilled" ? sessionResult.value : null;
    const repository =
      repositoryResult.status === "fulfilled" ? repositoryResult.value : null;
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
      config: appConfig,
      request,
      dataSource,
      authService,
      refresh,
    }),
    [state, request, dataSource, authService, refresh]
  );

  return <WorkbenchContext.Provider value={value}>{children}</WorkbenchContext.Provider>;
}

/**
 * Read shared workbench services and connection state.
 *
 * @returns {Object} Shared context value.
 * @throws {Error} When called outside WorkbenchProvider.
 */
export function useWorkbench() {
  const context = useContext(WorkbenchContext);
  if (!context) {
    throw new Error("useWorkbench must be used inside WorkbenchProvider.");
  }
  return context;
}
