# AI 修改指南

## 修改前

1. 先读取本目录的 `README.md` 和与任务相关的文档。
2. 执行 `git status --short`，区分已有修改和本次修改。
3. 明确任务类型、修改范围、影响页面和验证方式。
4. 涉及 GitHub 或 WebDAV 写入时，先检查接口约定和版本冲突规则。
5. 不把 `myapp.rar`、`01_old.rar` 当作当前源码，除非任务明确要求比较。

## 修改规则

- 页面逻辑放在 `pages/`，通用展示逻辑放在 `components/`。
- 跨页面基础状态放在 `context/`，不要把具体业务数据无边界放入全局上下文。
- 所有后台请求通过 `services/requestClient.js` 或 `services/storageService.js`。
- 环境配置只能读取公开变量，禁止写入 Secret；坚果云应用密码只能存在后端。
- 新增公共函数时补充中文说明：用途、参数、返回值、异常和边界。
- 不修改 HashRouter、`base: "./"` 或 `build` 输出目录，除非任务明确涉及部署。
- 不顺手重构与当前任务无关的旧页面。
- 后台本地 CRUD 统一通过 `pages/Admin/useAdminStore.js`，不要在组件中直接写 Local Storage。

## 修改后

1. 检查 `git diff --check`。
2. 执行与改动最相关的验证，前端结构改动至少执行 `npm.cmd run build`。
3. 检查路由、响应式布局和未配置后台状态。
4. 更新对应文档，并说明未验证项和剩余风险。
5. 不自动提交 Git，不自动发布远程 `gh-pages`。

## 当前已知风险

- Serverless 后端尚未部署，工作台真实认证和 GitHub/WebDAV 写入暂不可用。
- 构建产物存在大 chunk 警告，主要来自 Ant Design，暂不影响构建。
- 当前仓库仍可能存在与本次任务无关的未提交变更，修改时必须保留。
