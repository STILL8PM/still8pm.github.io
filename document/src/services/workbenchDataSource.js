import { appConfig } from "../config/environment";
import { createRequestClient } from "./requestClient";

/**
 * API adapter for workbench data.
 *
 * Pages depend on these stable methods instead of GitHub Contents API details.
 * The backend can later switch between GitHub App, OAuth or another storage
 * implementation without changing the page layer.
 */
export class WorkbenchDataSource {
  constructor({ request, config = appConfig } = {}) {
    this.request = request || createRequestClient({ baseUrl: config.apiBaseUrl });
    this.config = config;
  }

  /** @returns {Promise<Object>} Current authentication session. */
  async getSession() {
    return this.request.get("/api/session");
  }

  /** @param {string} collection Collection identifier. */
  async listCollection(collection) {
    this.assertIdentifier(collection, "collection");
    return this.request.get(`/api/data/${encodeURIComponent(collection)}`);
  }

  /**
   * @param {string} collection Collection identifier.
   * @param {string} id Record identifier.
   */
  async getRecord(collection, id) {
    this.assertIdentifier(collection, "collection");
    this.assertIdentifier(id, "id");
    return this.request.get(
      `/api/data/${encodeURIComponent(collection)}/${encodeURIComponent(id)}`
    );
  }

  /**
   * Save a record with optimistic version checking.
   *
   * @param {string} collection Collection identifier.
   * @param {string} id Record identifier.
   * @param {Object} data Record payload.
   * @param {string|null} version Current record version or SHA.
   */
  async saveRecord(collection, id, data, version = null) {
    this.assertIdentifier(collection, "collection");
    this.assertIdentifier(id, "id");
    return this.request.put(
      `/api/data/${encodeURIComponent(collection)}/${encodeURIComponent(id)}`,
      { data, version }
    );
  }

  /**
   * @param {string} collection Collection identifier.
   * @param {string} id Record identifier.
   */
  async deleteRecord(collection, id) {
    this.assertIdentifier(collection, "collection");
    this.assertIdentifier(id, "id");
    return this.request.delete(
      `/api/data/${encodeURIComponent(collection)}/${encodeURIComponent(id)}`
    );
  }

  /** @returns {Promise<Object>} Repository connection state. */
  async getRepositoryStatus() {
    return this.request.get("/api/repository/status");
  }

  /**
   * Keep user-controlled identifiers inside the configured data path.
   *
   * @param {unknown} value Identifier to validate.
   * @param {string} label Identifier label used in the error message.
   * @throws {Error} When the identifier contains unsupported characters.
   */
  assertIdentifier(value, label) {
    if (typeof value !== "string" || !/^[a-zA-Z0-9_-]+$/.test(value)) {
      throw new Error(`${label} may contain only letters, numbers, _ and -.`);
    }
  }
}

/** @returns {WorkbenchDataSource} Default configured data source. */
export function createWorkbenchDataSource() {
  return new WorkbenchDataSource();
}
