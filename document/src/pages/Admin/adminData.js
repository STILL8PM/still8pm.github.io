/**
 * Initial administration data used when no persisted workspace exists.
 *
 * The records are intentionally small but relational: users reference roles
 * and groups, groups reference roles, and roles reference permissions. This
 * mirrors the future Serverless data model while keeping local mode usable.
 */
export const initialAdminData = Object.freeze({
  version: 2,
  users: [
    {
      id: "user-admin",
      username: "admin",
      email: "admin@example.com",
      roleIds: ["role-admin"],
      groupIds: ["group-system"],
      status: "active",
      lastLogin: "2026-09-07 10:20",
      createdAt: "2026-09-01 09:00",
    },
    {
      id: "user-editor",
      username: "editor",
      email: "editor@example.com",
      roleIds: ["role-editor"],
      groupIds: ["group-content"],
      status: "active",
      lastLogin: "2026-09-06 16:42",
      createdAt: "2026-09-02 10:30",
    },
    {
      id: "user-viewer",
      username: "viewer",
      email: "viewer@example.com",
      roleIds: ["role-viewer"],
      groupIds: ["group-default"],
      status: "disabled",
      lastLogin: "2026-08-28 09:12",
      createdAt: "2026-09-03 14:10",
    },
  ],
  roles: [
    {
      id: "role-admin",
      name: "超级管理员",
      description: "拥有全部系统权限",
      permissionIds: ["content:read", "content:write", "user:read", "user:write", "role:write", "group:write", "audit:read", "system:config"],
      builtIn: true,
    },
    {
      id: "role-editor",
      name: "内容编辑",
      description: "管理前台内容和功能入口",
      permissionIds: ["content:read", "content:write"],
      builtIn: false,
    },
    {
      id: "role-viewer",
      name: "普通用户",
      description: "访问授权的前台功能",
      permissionIds: ["content:read"],
      builtIn: false,
    },
  ],
  groups: [
    {
      id: "group-system",
      name: "系统管理组",
      description: "负责系统维护和安全管理",
      roleIds: ["role-admin"],
    },
    {
      id: "group-content",
      name: "内容运营组",
      description: "负责工作台内容维护",
      roleIds: ["role-editor"],
    },
    {
      id: "group-default",
      name: "默认用户组",
      description: "新注册用户默认分组",
      roleIds: ["role-viewer"],
    },
  ],
  permissions: [
    { id: "content:read", name: "查看模块功能", module: "模块功能", description: "查看前台模块和功能入口" },
    { id: "content:write", name: "编辑模块功能", module: "模块功能", description: "新增、修改、排序和控制前台模块功能" },
    { id: "user:read", name: "查看用户", module: "用户管理", description: "查看用户基础信息" },
    { id: "user:write", name: "管理用户", module: "用户管理", description: "启用、禁用和修改用户" },
    { id: "role:write", name: "管理角色", module: "角色管理", description: "维护角色和角色权限" },
    { id: "group:write", name: "管理分组", module: "分组管理", description: "维护用户分组" },
    { id: "audit:read", name: "查看日志", module: "系统管理", description: "查看敏感操作审计日志" },
    { id: "system:config", name: "系统配置", module: "系统管理", description: "修改存储和系统配置" },
  ],
  modules: [
    {
      id: "module-productivity",
      type: "module",
      parentId: null,
      name: "效率工具",
      description: "个人效率与任务管理模块",
      route: "",
      icon: "AppstoreOutlined",
      visibility: "public",
      permissionId: "",
      status: "enabled",
      sort: 10,
      updatedAt: "2026-09-07 09:30",
    },
    {
      id: "feature-notes",
      type: "feature",
      parentId: "module-productivity",
      name: "知识笔记",
      description: "记录和整理知识内容",
      route: "/notes",
      icon: "FileTextOutlined",
      visibility: "public",
      permissionId: "content:read",
      status: "enabled",
      sort: 10,
      updatedAt: "2026-09-07 09:30",
    },
    {
      id: "feature-tasks",
      type: "feature",
      parentId: "module-productivity",
      name: "任务管理",
      description: "规划和跟踪待办任务",
      route: "/tasks",
      icon: "CheckCircleOutlined",
      visibility: "authenticated",
      permissionId: "content:read",
      status: "enabled",
      sort: 20,
      updatedAt: "2026-09-06 14:20",
    },
    {
      id: "module-system",
      type: "module",
      parentId: null,
      name: "系统服务",
      description: "系统信息与维护功能",
      route: "",
      icon: "SettingOutlined",
      visibility: "permission",
      permissionId: "system:config",
      status: "enabled",
      sort: 20,
      updatedAt: "2026-09-01 11:08",
    },
    {
      id: "feature-docs",
      type: "feature",
      parentId: "module-system",
      name: "系统文档",
      description: "查看工作台使用文档",
      route: "/docs",
      icon: "BookOutlined",
      visibility: "permission",
      permissionId: "system:config",
      status: "disabled",
      sort: 30,
      updatedAt: "2026-09-01 11:08",
    },
  ],
  settings: {
    siteName: "之一的工作台",
    allowRegistration: true,
    defaultGroupId: "group-default",
    storage: {
      provider: "github",
      github: {
        repository: "STILL8PM/still8pm.github.io",
        branch: "main",
        dataRoot: "data",
        credentialConfigured: false,
      },
      nutstoreWebdav: {
        url: "https://dav.jianguoyun.com/dav/",
        username: "",
        path: "/workbench/data",
        credentialConfigured: false,
      },
    },
  },
  auditLogs: [
    {
      id: "audit-initial",
      action: "SYSTEM_INITIALIZED",
      module: "system",
      target: "Local administration workspace",
      operator: "admin",
      createdAt: "2026-09-07 10:20:00",
    },
  ],
});

/**
 * Return a detached copy so mutations never affect the frozen defaults.
 *
 * @returns {Object} Mutable administration data.
 */
export function createInitialAdminData() {
  return JSON.parse(JSON.stringify(initialAdminData));
}
