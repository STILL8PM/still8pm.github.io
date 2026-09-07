import { appConfig } from "../config/environment";

/**
 * Create the authentication navigation service.
 *
 * GitHub authorization and session cookies are handled by the backend. The
 * browser only follows the login redirect and never receives a GitHub token.
 *
 * @param {Object} options Service options.
 * @param {string} options.baseUrl Serverless API base URL.
 */
export function createAuthService({ baseUrl = appConfig.apiBaseUrl } = {}) {
  const buildUrl = (path) => {
    const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
    return normalizedBaseUrl ? `${normalizedBaseUrl}${path}` : path;
  };

  return {
    /** Start the backend-managed GitHub login flow. */
    startLogin() {
      window.location.assign(buildUrl("/api/auth/github?mode=login"));
    },

    /** @param {Object} request Shared request client. */
    async logout(request) {
      return request.post("/api/auth/logout");
    },
  };
}
