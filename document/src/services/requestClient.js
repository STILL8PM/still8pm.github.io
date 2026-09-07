/**
 * Normalized error returned by the workbench API client.
 */
export class RequestError extends Error {
  constructor(message, { status = 0, code = "NETWORK_ERROR", details = null } = {}) {
    super(message);
    this.name = "RequestError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Create the single HTTP client used by frontend services.
 *
 * It centralizes API URL joining, cookie credentials, timeout handling and
 * error normalization so pages never need to duplicate request logic.
 *
 * @param {Object} options Client configuration.
 * @param {string} options.baseUrl Serverless API base URL.
 * @param {number} options.timeoutMs Request timeout in milliseconds.
 * @returns {Object} get, post, put and delete request methods.
 */
export function createRequestClient({ baseUrl = "", timeoutMs = 10000 } = {}) {
  const buildUrl = (path) => {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
    const normalizedPath = path.replace(/^\//, "");
    return normalizedBaseUrl
      ? `${normalizedBaseUrl}/${normalizedPath}`
      : `/${normalizedPath}`;
  };

  const parseResponse = async (response) => {
    const text = await response.text();
    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  };

  const request = async (method, path, body) => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
    const headers = { Accept: "application/json" };

    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    try {
      const response = await fetch(buildUrl(path), {
        method,
        headers,
        credentials: "include",
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
      const payload = await parseResponse(response);

      if (!response.ok) {
        throw new RequestError(
          payload?.error?.message || payload?.message || "Workbench request failed",
          {
            status: response.status,
            code: payload?.error?.code || `HTTP_${response.status}`,
            details: payload,
          }
        );
      }

      return payload;
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      }

      if (error?.name === "AbortError") {
        throw new RequestError("The request timed out. Please try again.", {
          code: "TIMEOUT",
        });
      }

      throw new RequestError("The backend is unavailable. Please try again.", {
        code: "NETWORK_ERROR",
        details: error,
      });
    } finally {
      window.clearTimeout(timeout);
    }
  };

  return {
    get: (path) => request("GET", path),
    post: (path, body) => request("POST", path, body),
    put: (path, body) => request("PUT", path, body),
    delete: (path) => request("DELETE", path),
  };
}
