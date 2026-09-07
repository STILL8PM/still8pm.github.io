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
import { createStorageService } from "../services/storageService";

const WorkbenchContext = createContext(null);

/**
 * Provide shared backend state and service instances.
 *
 * This context owns only authentication and storage connection state. A
 * feature page should keep its own domain data instead of growing one global
 * store for every future workbench module.
 */
export function WorkbenchProvider({ children }) {
  const [state, setState] = useState({
    status: "idle",
    session: null,
    storage: null,
    error: null,
  });
  const request = useMemo(
    () => createRequestClient({ baseUrl: appConfig.apiBaseUrl }),
    []
  );
  const storageService = useMemo(() => createStorageService({ request }), [request]);
  const authService = useMemo(() => createAuthService(), []);

  /** Refresh session and storage state independently. */
  const refresh = useCallback(async () => {
    if (!isBackendConfigured()) {
      const nextState = {
        status: "not-configured",
        session: null,
        storage: null,
        error: null,
      };
      setState(nextState);
      return nextState;
    }

    setState((current) => ({ ...current, status: "loading", error: null }));
    const [sessionResult, storageResult] = await Promise.allSettled([
      storageService.getSession(),
      storageService.getStorageStatus(),
    ]);
    const session =
      sessionResult.status === "fulfilled" ? sessionResult.value : null;
    const storage =
      storageResult.status === "fulfilled" ? storageResult.value : null;
    const error =
      sessionResult.status === "rejected" && storageResult.status === "rejected"
        ? sessionResult.reason
        : null;

    const nextState = {
      status: error ? "error" : "ready",
      session,
      storage,
      error,
    };
    setState(nextState);
    return nextState;
  }, [storageService]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      ...state,
      config: appConfig,
      request,
      storageService,
      authService,
      refresh,
    }),
    [state, request, storageService, authService, refresh]
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
