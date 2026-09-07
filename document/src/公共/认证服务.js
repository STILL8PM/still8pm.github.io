import { 工作台配置 } from "../配置/环境配置";

/**
 * 创建工作台认证服务。
 *
 * GitHub 登录由 Serverless 后端完成授权码交换和会话管理。浏览器只
 * 跳转到后端登录入口，不接触 GitHub Client Secret，也不把访问令牌存入
 * localStorage，降低静态站点被注入或误提交配置时的泄露风险。
 *
 * @param {Object} options 服务选项
 * @param {string} options.baseUrl 后端 API 地址
 * @returns {Object} 登录、退出和回到工作台方法
 */
export function 创建认证服务({ baseUrl = 工作台配置.apiBaseUrl } = {}) {
  const 拼接地址 = (path) => {
    const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
    return normalizedBaseUrl ? `${normalizedBaseUrl}${path}` : path;
  };

  return {
    /**
     * 跳转到 GitHub 登录流程。
     *
     * 后端成功建立 HttpOnly 会话后应跳回当前工作台页面。
     */
    开始登录() {
      window.location.assign(拼接地址("/api/auth/github?mode=login"));
    },

    /**
     * 请求后端销毁当前会话。
     *
     * @param {Object} request 统一请求客户端
     * @returns {Promise<Object>} 退出结果
     */
    async 退出登录(request) {
      return request.post("/api/auth/logout");
    },
  };
}

