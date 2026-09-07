/**
 * Public storage provider metadata.
 *
 * Credentials are intentionally absent. They must be configured in the
 * Serverless backend environment and never exposed through the frontend.
 */
export const storageProviders = Object.freeze([
  {
    key: "github",
    label: "GitHub Repository",
    description: "Versioned files and commits through the GitHub API.",
  },
  {
    key: "nutstore-webdav",
    label: "Nutstore WebDAV",
    description: "Files stored in a Nutstore WebDAV directory.",
  },
]);

/**
 * Find provider metadata by key.
 *
 * @param {string} key Provider key.
 * @returns {Object|undefined} Matching provider metadata.
 */
export function findStorageProvider(key) {
  return storageProviders.find((provider) => provider.key === key);
}
