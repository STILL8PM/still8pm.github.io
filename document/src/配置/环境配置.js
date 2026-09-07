/**
 * 工作台运行环境配置。
 *
 * 配置来源是 Vite 构建时注入的 VITE_ 前缀环境变量。前端只读取后端
 * 地址和公开仓库标识，不读取也不保存任何 GitHub Token；真正的 GitHub
 * 认证凭据必须由后端 Serverless 服务管理。
 */
const 环境变量 = import.meta.env || {};

export const 工作台配置 = Object.freeze({
  apiBaseUrl: 环境变量.VITE_WORKBENCH_API_BASE_URL || "",
  repositoryOwner: 环境变量.VITE_GITHUB_REPOSITORY_OWNER || "STILL8PM",
  repositoryName:
    环境变量.VITE_GITHUB_REPOSITORY_NAME || "still8pm.github.io",
  repositoryBranch: 环境变量.VITE_GITHUB_REPOSITORY_BRANCH || "main",
  dataRoot: 环境变量.VITE_GITHUB_DATA_ROOT || "data",
});

/**
 * 判断工作台后台地址是否已经配置。
 *
 * 未配置时页面仍然可以正常运行，但不会误请求旧的一言接口，也不会
 * 假装 GitHub 数据已经可用，便于本地开发和 GitHub Pages 静态预览。
 *
 * @returns {boolean} 后台地址是否可用
 */
export function 是否已配置工作台后台() {
  return Boolean(工作台配置.apiBaseUrl);
}

