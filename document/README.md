# 之一的工作台

## 项目定位

这是基于 React 18 与 Vite 的前后台一体工作台。当前后台管理界面支持本地
持久化、完整 CRUD、审计日志和数据导入导出，并预留 GitHub Repository 与
坚果云 WebDAV 两种远端存储。Token 和应用密码只能由 Serverless 后端保存。

后台的“模块功能”使用模块与功能两级树，入口为 `/#/admin/modules`。
模块和功能均可独立控制前台显示，模块隐藏时其全部子功能不会出现在前台。
应用默认进入 `/#/login`。只有账号密码登录后且会话包含 `role-admin` 的用户才能
访问后台；注册入口为 `/#/register`，密码不会写入浏览器持久化存储。

## 本地启动

```bash
npm install
npm run dev
```

## 构建与预览

```bash
npm run build
npm run preview
```

## GitHub Pages 部署

```bash
npm run deploy
```

一键构建、提交源码、推送当前分支并发布 GitHub Pages：

```bash
npm run release -- "feat: update workbench"
```

提交说明可以省略，此时脚本会自动生成带时间的发布提交。Windows PowerShell
可以将 `npm` 替换为 `npm.cmd`。脚本会提交仓库中的全部待提交改动，执行前应先
使用 `git status` 检查改动范围。

Vite 使用相对资源路径，路由使用 Hash 模式，因此构建结果可以继续发布到
当前仓库的 `gh-pages` 分支，刷新工作台子页面不会产生静态路由 404。

## 环境变量

复制 `.env.example` 为 `.env.local`，按实际 Serverless 地址填写：

```text
VITE_WORKBENCH_API_BASE_URL=https://你的后台域名
VITE_GITHUB_REPOSITORY_OWNER=STILL8PM
VITE_GITHUB_REPOSITORY_NAME=still8pm.github.io
VITE_GITHUB_REPOSITORY_BRANCH=main
VITE_GITHUB_DATA_ROOT=data
```

未配置后台地址时，工作台仍可启动，但会显示“等待配置”，不会伪装成已
连接 GitHub。
