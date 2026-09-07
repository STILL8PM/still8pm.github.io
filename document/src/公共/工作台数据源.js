import { 工作台配置 } from "../配置/环境配置";
import { 创建请求客户端 } from "./请求客户端";

/**
 * 工作台 GitHub 数据源。
 *
 * 页面只依赖这些稳定方法，不直接依赖 GitHub Contents API 的具体请求
 * 格式。后续无论后台使用 GitHub App、OAuth 还是替换为其他存储，都只
 * 需要调整后台实现，页面和业务模块不需要跟着改动。
 */
export class 工作台数据源 {
  constructor({ request, config = 工作台配置 } = {}) {
    this.request = request || 创建请求客户端({ baseUrl: config.apiBaseUrl });
    this.config = config;
  }

  /**
   * 获取当前登录会话。
   *
   * @returns {Promise<Object>} 登录状态和当前 GitHub 用户摘要
   */
  async 获取会话() {
    return this.request.get("/api/session");
  }

  /**
   * 查询一个数据集合。
   *
   * @param {string} 集合名称 数据集合名称，只允许字母、数字、下划线和短横线
   * @returns {Promise<Object>} 后台返回的数据列表和版本信息
   */
  async 查询集合(集合名称) {
    this.校验标识(集合名称, "集合名称");
    return this.request.get(`/api/data/${encodeURIComponent(集合名称)}`);
  }

  /**
   * 查询一条数据。
   *
   * @param {string} 集合名称 数据集合名称
   * @param {string} 数据编号 数据唯一编号
   * @returns {Promise<Object>} 后台返回的数据内容
   */
  async 查询数据(集合名称, 数据编号) {
    this.校验标识(集合名称, "集合名称");
    this.校验标识(数据编号, "数据编号");
    return this.request.get(
      `/api/data/${encodeURIComponent(集合名称)}/${encodeURIComponent(数据编号)}`
    );
  }

  /**
   * 保存一条数据。
   *
   * version 用于 GitHub 文件 SHA 或后端版本号的乐观锁校验，避免多个
   * 终端同时编辑时后写入的数据无提示地覆盖先写入的数据。
   *
   * @param {string} 集合名称 数据集合名称
   * @param {string} 数据编号 数据唯一编号
   * @param {Object} data 待保存的数据
   * @param {string|null} version 当前版本号
   * @returns {Promise<Object>} 保存后的数据和新版本号
   */
  async 保存数据(集合名称, 数据编号, data, version = null) {
    this.校验标识(集合名称, "集合名称");
    this.校验标识(数据编号, "数据编号");
    return this.request.put(
      `/api/data/${encodeURIComponent(集合名称)}/${encodeURIComponent(数据编号)}`,
      { data, version }
    );
  }

  /**
   * 删除一条数据。
   *
   * @param {string} 集合名称 数据集合名称
   * @param {string} 数据编号 数据唯一编号
   * @returns {Promise<Object>} 删除结果
   */
  async 删除数据(集合名称, 数据编号) {
    this.校验标识(集合名称, "集合名称");
    this.校验标识(数据编号, "数据编号");
    return this.request.delete(
      `/api/data/${encodeURIComponent(集合名称)}/${encodeURIComponent(数据编号)}`
    );
  }

  /**
   * 获取 GitHub 数据仓库的连接状态。
   *
   * @returns {Promise<Object>} 仓库、分支和后台连接状态
   */
  async 获取仓库状态() {
    return this.request.get("/api/repository/status");
  }

  /**
   * 校验数据路径标识，阻止业务层构造越界路径或不可控的文件名。
   *
   * @param {unknown} value 待校验值
   * @param {string} label 字段名称
   * @throws {Error} 标识不符合数据目录约束时抛出异常
   */
  校验标识(value, label) {
    if (typeof value !== "string" || !/^[a-zA-Z0-9_-]+$/.test(value)) {
      throw new Error(`${label}只能包含字母、数字、下划线和短横线。`);
    }
  }
}

/**
 * 创建默认工作台数据源，供页面和上下文直接使用。
 *
 * @returns {工作台数据源} 配置好的数据源实例
 */
export function 创建工作台数据源() {
  return new 工作台数据源();
}

