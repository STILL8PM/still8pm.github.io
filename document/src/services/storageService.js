import { appConfig } from "../config/environment";
import { createRequestClient } from "./requestClient";

/**
 * Provider-neutral storage adapter.
 *
 * The frontend talks to one backend contract while the backend selects GitHub
 * Contents API or Nutstore WebDAV. This keeps provider credentials and protocol
 * details out of the browser and allows the administrator to change storage
 * without rewriting feature pages.
 */
export class StorageService {
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
   * @param {string|null} version Current record version or provider revision.
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

  /** @returns {Promise<Object>} Active storage provider and connection state. */
  async getStorageStatus() {
    return this.request.get("/api/storage/status");
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

/** @returns {StorageService} Default configured storage service. */
export function createStorageService(options) {
  return new StorageService(options);
}
