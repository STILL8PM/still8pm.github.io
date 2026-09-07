/**
 * 统一请求错误对象。
 *
 * 所有网络错误都通过此类型向上抛出，页面层可以根据 status 和 code
 * 区分认证失败、权限不足、冲突、限流和普通网络异常。
 */
export class 请求错误 extends Error {
  constructor(message, { status = 0, code = "NETWORK_ERROR", details = null } = {}) {
    super(message);
    this.name = "请求错误";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * 创建工作台统一请求客户端。
 *
 * 该客户端负责拼接后端地址、设置跨站会话、处理超时、解析响应和
 * 规范化错误。业务页面不应直接调用 fetch，避免不同页面出现不一致的
 * Token、超时和错误处理逻辑。
 *
 * @param {Object} options 客户端选项
 * @param {string} options.baseUrl 后端 API 地址
 * @param {number} options.timeoutMs 单次请求超时时间
 * @returns {Object} get、post、put、delete 方法
 */
export function 创建请求客户端({ baseUrl = "", timeoutMs = 10000 } = {}) {
  const 标准化地址 = (path) => {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
    const normalizedPath = path.replace(/^\//, "");
    return normalizedBaseUrl
      ? `${normalizedBaseUrl}/${normalizedPath}`
      : `/${normalizedPath}`;
  };

  const 解析响应 = async (response) => {
    const responseText = await response.text();
    if (!responseText) {
      return null;
    }

    try {
      return JSON.parse(responseText);
    } catch {
      return responseText;
    }
  };

  const 请求 = async (method, path, body) => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
    const headers = { Accept: "application/json" };

    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    try {
      const response = await fetch(标准化地址(path), {
        method,
        headers,
        credentials: "include",
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
      const payload = await 解析响应(response);

      if (!response.ok) {
        throw new 请求错误(
          payload?.error?.message || payload?.message || "工作台请求失败",
          {
            status: response.status,
            code: payload?.error?.code || `HTTP_${response.status}`,
            details: payload,
          }
        );
      }

      return payload;
    } catch (error) {
      if (error instanceof 请求错误) {
        throw error;
      }

      if (error?.name === "AbortError") {
        throw new 请求错误("工作台请求超时，请检查网络后重试。", {
          code: "TIMEOUT",
        });
      }

      throw new 请求错误("无法连接工作台后台，请检查服务地址。", {
        code: "NETWORK_ERROR",
        details: error,
      });
    } finally {
      window.clearTimeout(timeout);
    }
  };

  return {
    get: (path) => 请求("GET", path),
    post: (path, body) => 请求("POST", path, body),
    put: (path, body) => 请求("PUT", path, body),
    delete: (path) => 请求("DELETE", path),
  };
}

