/**
 * Public runtime configuration exposed by Vite.
 *
 * Secrets must never be placed in VITE_ variables because Vite embeds them in
 * the browser bundle. GitHub credentials and encryption keys belong to the
 * Serverless backend only.
 */
const env = import.meta.env || {};

export const appConfig = Object.freeze({
  apiBaseUrl: env.VITE_WORKBENCH_API_BASE_URL || "",
  repositoryOwner: env.VITE_GITHUB_REPOSITORY_OWNER || "STILL8PM",
  repositoryName: env.VITE_GITHUB_REPOSITORY_NAME || "still8pm.github.io",
  repositoryBranch: env.VITE_GITHUB_REPOSITORY_BRANCH || "main",
  dataRoot: env.VITE_GITHUB_DATA_ROOT || "data",
});

/**
 * Check whether the Serverless backend is configured.
 *
 * @returns {boolean} True when the frontend can call the backend.
 */
export function isBackendConfigured() {
  return Boolean(appConfig.apiBaseUrl);
}
