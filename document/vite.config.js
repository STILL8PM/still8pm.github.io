import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Vite 构建配置。
 *
 * 工作台当前仍然发布到 GitHub Pages 的 gh-pages 分支，因此使用相对
 * 资源路径；这样无论站点使用自定义域名还是仓库子路径，静态资源都能
 * 按当前页面位置正确加载。开发环境中的 /api 代理仅用于保留现有一言
 * 页面能力，工作台后台接口通过环境变量单独配置。
 */
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://v.api.aa1.cn",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "build",
    emptyOutDir: true,
  },
});
