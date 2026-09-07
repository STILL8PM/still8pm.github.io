import { useCallback, useMemo, useState } from "react";
import { createInitialAdminData } from "./adminData";

const STORAGE_KEY = "workbench.admin.data.v2";
const LEGACY_STORAGE_KEY = "workbench.admin.data.v1";
const REQUIRED_COLLECTIONS = ["users", "roles", "groups", "permissions", "modules", "auditLogs"];

/** Create a stable identifier without depending on a backend sequence. */
function createId(prefix) {
  const value = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${value}`;
}

/** Format local audit timestamps consistently. */
function formatDateTime(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/** Persist local mode data after every successful mutation. */
function persistState(state) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/** Remove credentials that must never enter browser persistence or backups. */
function sanitizeState(state) {
  const github = state.settings?.storage?.github || {};
  const nutstoreWebdav = state.settings?.storage?.nutstoreWebdav || {};
  const { token, accessToken, ...safeGithub } = github;
  const { password, webdavPassword, applicationPassword, ...safeNutstoreWebdav } = nutstoreWebdav;

  return {
    ...state,
    settings: {
      ...state.settings,
      storage: {
        ...state.settings?.storage,
        github: safeGithub,
        nutstoreWebdav: safeNutstoreWebdav,
      },
    },
  };
}

/** Validate a version 2 administration snapshot before it is used. */
function isVersionTwoState(state) {
  return state?.version === 2
    && Boolean(state.settings)
    && REQUIRED_COLLECTIONS.every((key) => Array.isArray(state[key]));
}

/** Convert the former flat content list into one module with child features. */
function migrateVersionOneState(state) {
  const legacyCollections = ["users", "roles", "groups", "permissions", "content", "auditLogs"];
  if (state?.version !== 1 || !state.settings || legacyCollections.some((key) => !Array.isArray(state[key]))) {
    return null;
  }

  const { content, ...remainingState } = state;
  const legacyModuleId = content.some((item) => item.id === "module-legacy")
    ? "module-legacy-root"
    : "module-legacy";
  const migratedState = {
    ...remainingState,
    version: 2,
    modules: [
      {
        id: legacyModuleId,
        type: "module",
        parentId: null,
        name: "默认模块",
        description: "由旧版内容管理数据自动迁移",
        route: "",
        icon: "AppstoreOutlined",
        visibility: "public",
        permissionId: "",
        status: "enabled",
        sort: 10,
        updatedAt: formatDateTime().slice(0, 16),
      },
      ...content.map((item) => ({
        ...item,
        type: "feature",
        parentId: legacyModuleId,
        sort: Number(item.sort) || 0,
      })),
    ],
  };

  return sanitizeState(migratedState);
}

/** Normalize supported snapshots to the current schema. */
function normalizeState(state) {
  if (isVersionTwoState(state)) {
    return sanitizeState(state);
  }
  return migrateVersionOneState(state);
}

/** Load current or legacy data and recover from corrupted browser storage. */
function loadState() {
  for (const key of [STORAGE_KEY, LEGACY_STORAGE_KEY]) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const normalized = normalizeState(JSON.parse(raw));
      if (normalized) {
        persistState(normalized);
        return normalized;
      }
    } catch {
      // Continue to the next compatible source before restoring defaults.
    }
  }
  return createInitialAdminData();
}

/**
 * Provide complete local administration CRUD operations.
 *
 * The hook is the only local persistence boundary. UI sections receive data
 * and explicit actions, which allows a later API-backed hook to replace local
 * mode without changing tables or forms.
 */
export function useAdminStore() {
  const [state, setState] = useState(loadState);

  const commit = useCallback((nextState, audit) => {
    const nextAuditLog = audit
      ? {
          id: createId("audit"),
          operator: "admin",
          createdAt: formatDateTime(),
          ...audit,
        }
      : null;
    const value = nextAuditLog
      ? { ...nextState, auditLogs: [nextAuditLog, ...nextState.auditLogs].slice(0, 500) }
      : nextState;
    setState(value);
    persistState(value);
  }, []);

  const saveEntity = useCallback((collection, entity, auditModule) => {
    const existing = entity.id
      ? state[collection].find((item) => item.id === entity.id)
      : null;
    const id = entity.id || createId(collection.slice(0, -1));
    const record = { ...entity, id };
    const records = existing
      ? state[collection].map((item) => (item.id === id ? record : item))
      : [...state[collection], record];
    commit(
      { ...state, [collection]: records },
      {
        action: existing ? "UPDATE" : "CREATE",
        module: auditModule,
        target: record.name || record.username || record.id,
      }
    );
    return record;
  }, [commit, state]);

  const deleteEntity = useCallback((collection, id, auditModule) => {
    const target = state[collection].find((item) => item.id === id);
    if (!target) {
      return;
    }
    commit(
      { ...state, [collection]: state[collection].filter((item) => item.id !== id) },
      { action: "DELETE", module: auditModule, target: target.name || target.username || id }
    );
  }, [commit, state]);

  const saveUser = useCallback((user) => saveEntity("users", {
    ...user,
    createdAt: user.createdAt || formatDateTime().slice(0, 16),
    lastLogin: user.lastLogin || "从未登录",
  }, "users"), [saveEntity]);

  const deleteUser = useCallback((id) => {
    if (id === "user-admin") {
      throw new Error("系统管理员账号不能删除。");
    }
    deleteEntity("users", id, "users");
  }, [deleteEntity]);

  const toggleUserStatus = useCallback((id) => {
    const user = state.users.find((item) => item.id === id);
    if (!user) return;
    if (id === "user-admin") throw new Error("系统管理员账号不能禁用。");
    saveEntity("users", { ...user, status: user.status === "active" ? "disabled" : "active" }, "users");
  }, [saveEntity, state.users]);

  const saveRole = useCallback((role) => saveEntity("roles", { ...role, builtIn: role.builtIn || false }, "roles"), [saveEntity]);
  const deleteRole = useCallback((id) => {
    const role = state.roles.find((item) => item.id === id);
    if (role?.builtIn) throw new Error("系统内置角色不能删除。");
    if (state.users.some((user) => user.roleIds.includes(id)) || state.groups.some((group) => group.roleIds.includes(id))) {
      throw new Error("该角色仍被用户或分组使用，不能删除。");
    }
    deleteEntity("roles", id, "roles");
  }, [deleteEntity, state.groups, state.roles, state.users]);

  const saveGroup = useCallback((group) => saveEntity("groups", group, "groups"), [saveEntity]);
  const deleteGroup = useCallback((id) => {
    if (state.users.some((user) => user.groupIds.includes(id))) {
      throw new Error("该分组仍有用户，不能删除。");
    }
    deleteEntity("groups", id, "groups");
  }, [deleteEntity, state.users]);

  const savePermission = useCallback((permission) => saveEntity("permissions", permission, "permissions"), [saveEntity]);
  const deletePermission = useCallback((id) => {
    if (state.roles.some((role) => role.permissionIds.includes(id))) {
      throw new Error("该权限仍被角色使用，不能删除。");
    }
    deleteEntity("permissions", id, "permissions");
  }, [deleteEntity, state.roles]);

  const saveModuleItem = useCallback((item) => {
    const type = item.type === "feature" ? "feature" : "module";
    if (type === "feature" && !state.modules.some((record) => record.id === item.parentId && record.type === "module")) {
      throw new Error("功能必须归属于一个有效模块。");
    }
    return saveEntity("modules", {
      ...item,
      id: item.id || createId(type),
      type,
      parentId: type === "module" ? null : item.parentId,
      route: type === "module" ? "" : item.route,
      permissionId: item.visibility === "permission" ? item.permissionId : "",
      sort: Number(item.sort),
      updatedAt: formatDateTime().slice(0, 16),
    }, "modules");
  }, [saveEntity, state.modules]);

  const deleteModuleItem = useCallback((id) => {
    const target = state.modules.find((item) => item.id === id);
    if (!target) return;
    const childCount = target.type === "module"
      ? state.modules.filter((item) => item.parentId === id).length
      : 0;
    commit(
      {
        ...state,
        modules: state.modules.filter((item) => item.id !== id && item.parentId !== id),
      },
      {
        action: "DELETE",
        module: "modules",
        target: childCount ? `${target.name} (${childCount} features)` : target.name,
      }
    );
  }, [commit, state]);

  const toggleModuleItemStatus = useCallback((id) => {
    const item = state.modules.find((record) => record.id === id);
    if (!item) return;
    saveModuleItem({ ...item, status: item.status === "enabled" ? "disabled" : "enabled" });
  }, [saveModuleItem, state.modules]);

  const saveGeneralSettings = useCallback((settings) => {
    commit(
      { ...state, settings: { ...state.settings, ...settings } },
      { action: "UPDATE", module: "settings", target: "General settings" }
    );
  }, [commit, state]);

  const saveStorageSettings = useCallback((storage) => {
    const sanitizedStorage = {
      provider: storage.provider,
      github: {
        repository: storage.repository,
        branch: storage.branch,
        dataRoot: storage.githubDataRoot,
        credentialConfigured: state.settings.storage.github.credentialConfigured,
      },
      nutstoreWebdav: {
        url: storage.webdavUrl,
        username: storage.webdavUsername,
        path: storage.webdavPath,
        credentialConfigured: state.settings.storage.nutstoreWebdav.credentialConfigured,
      },
    };
    commit(
      { ...state, settings: { ...state.settings, storage: sanitizedStorage } },
      { action: "UPDATE", module: "settings", target: `Storage: ${storage.provider}` }
    );
  }, [commit, state]);

  const clearAuditLogs = useCallback(() => {
    commit(
      { ...state, auditLogs: [] },
      { action: "CLEAR", module: "audit", target: "Audit logs" }
    );
  }, [commit, state]);

  const resetData = useCallback(() => {
    const initial = createInitialAdminData();
    commit(initial, { action: "RESET", module: "system", target: "Local administration data" });
  }, [commit]);

  /** Export a complete portable snapshot without any storage credentials. */
  const exportData = useCallback(() => JSON.stringify(sanitizeState(state), null, 2), [state]);

  /**
   * Import a versioned snapshot after validating its required collections.
   *
   * @param {string} text JSON snapshot text.
   * @throws {Error} When the snapshot is malformed or incompatible.
   */
  const importData = useCallback((text) => {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error("备份文件不是有效的 JSON。");
    }
    const normalized = normalizeState(parsed);
    if (!normalized) {
      throw new Error("备份文件版本或数据结构不兼容。");
    }
    commit(normalized, { action: "IMPORT", module: "system", target: "Administration backup" });
  }, [commit]);

  const roleMap = useMemo(() => Object.fromEntries(state.roles.map((item) => [item.id, item])), [state.roles]);
  const groupMap = useMemo(() => Object.fromEntries(state.groups.map((item) => [item.id, item])), [state.groups]);

  return {
    ...state,
    roleMap,
    groupMap,
    saveUser,
    deleteUser,
    toggleUserStatus,
    saveRole,
    deleteRole,
    saveGroup,
    deleteGroup,
    savePermission,
    deletePermission,
    saveModuleItem,
    deleteModuleItem,
    toggleModuleItemStatus,
    saveGeneralSettings,
    saveStorageSettings,
    clearAuditLogs,
    resetData,
    exportData,
    importData,
  };
}
