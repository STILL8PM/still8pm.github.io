# 之一的工作台

这是 `STILL8PM/still8pm.github.io` 项目的前端工作台。项目使用 React 18 和
Vite 构建，部署到 GitHub Pages，并预留 Serverless 后端用于安全访问 GitHub
数据。

## 项目地址

- GitHub 仓库：`STILL8PM/still8pm.github.io`
- 工作台入口：`/#/workbench`
- 发布方式：GitHub Pages 的 `gh-pages` 分支

## 技术栈

- React 18
- Vite
- React Router 6
- Ant Design 4
- GitHub Pages
- GitHub 数据服务接口

## 目录

```text
document/                 前端项目
├─ src/                   页面、组件和公共服务
├─ index.html             Vite 入口
├─ vite.config.js         Vite 与 GitHub Pages 配置
├─ package.json            项目命令和依赖
└─ .env.example            环境变量模板

docs/                     项目知识库
├─ README.md              AI 文档阅读入口
├─ 项目总览.md             技术架构和目录说明
├─ 功能与逻辑.md           页面和数据流程
├─ 公共方法.md             公共服务使用方式
├─ 接口与数据模型.md       后台接口和数据规则
├─ 路由与部署.md           构建和发布规则
└─ AI修改指南.md           AI 修改规范
```

## 本地运行

进入前端目录：

```bash
cd document
npm install
npm run dev
```

Windows PowerShell 如果禁止执行 `npm.ps1`，使用对应的 `npm.cmd`：

```bash
npm.cmd install
npm.cmd run dev
```

## 构建和部署

```bash
cd document
npm run build
npm run preview
npm run deploy
```

构建输出目录为 `document/build/`，部署命令会将构建结果发布到 `gh-pages`
分支。路由使用 Hash 模式，GitHub Pages 刷新工作台子页面不会产生服务端
路由 404。

## 环境变量

复制 `document/.env.example` 为 `document/.env.local`，再配置后台地址：

```text
VITE_WORKBENCH_API_BASE_URL=https://你的Serverless后台地址
VITE_GITHUB_REPOSITORY_OWNER=STILL8PM
VITE_GITHUB_REPOSITORY_NAME=still8pm.github.io
VITE_GITHUB_REPOSITORY_BRANCH=main
VITE_GITHUB_DATA_ROOT=data
```

`VITE_` 变量会进入前端构建产物，只能放公开配置。GitHub Token、OAuth
Secret 等敏感信息必须由 Serverless 后端保存，禁止写入前端代码或浏览器存储。

## 修改项目前

请先阅读 [`docs/README.md`](./docs/README.md)，再根据任务读取对应文档。页面
不能直接调用 GitHub API，必须通过 `document/src/services/` 下的公共服务访问后台。

新增页面、公共方法、接口或数据字段时，需要同步更新 `docs/` 中的相关说明。

## 当前状态

- Vite + React 前端框架已完成。
- “之一的工作台”基础页面已完成。
- GitHub 数据源、认证服务和接口约定已预留。
- Serverless 后端、GitHub OAuth 和真实 GitHub 读写待后续实现。
