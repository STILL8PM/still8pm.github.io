import React from "react";
import { Alert, Button, Card, Col, Row, Space, Tag } from "antd";
import {
  CloudServerOutlined,
  GithubOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useWorkbench } from "../../工作台/工作台上下文";
import "./index.css";

/**
 * 之一的工作台首页。
 *
 * 当前页面只展示基础连接状态和后续功能入口，不提前绑定具体业务。
 * 这样 GitHub 数据层、认证层和响应式布局可以先稳定下来，后续按目标
 * 增加笔记、任务或其他模块时，不需要重新调整应用骨架。
 */
export default function Workbench() {
  const {
    status,
    session,
    repository,
    error,
    config,
    request,
    refresh,
    authService,
  } = useWorkbench();

  const isAuthenticated = Boolean(session?.authenticated || session?.user);
  const statusText = {
    idle: "准备中",
    loading: "连接中",
    ready: "运行正常",
    error: "连接异常",
    "not-configured": "等待配置",
  }[status];

  return (
    <main className="workbench-page">
      <section className="workbench-hero">
        <div>
          <Tag color="blue">之一的工作台</Tag>
          <h1>把想法、知识和行动放在一起。</h1>
          <p>
            当前先完成工作台公共框架，后续功能将通过统一数据服务接入 GitHub。
          </p>
        </div>
        <Button
          icon={<ReloadOutlined />}
          loading={status === "loading"}
          onClick={refresh}
        >
          刷新状态
        </Button>
      </section>

      {error && (
        <Alert
          showIcon
          type="error"
          message="工作台后台连接失败"
          description={error.message}
          action={<Button onClick={refresh}>重试</Button>}
        />
      )}

      <Row gutter={[16, 16]} className="workbench-cards">
        <Col xs={24} md={12} lg={8}>
          <Card title="运行状态" extra={<CloudServerOutlined />}>
            <div className="status-value">{statusText}</div>
            <p className="status-description">
              {status === "not-configured"
                ? "配置 VITE_WORKBENCH_API_BASE_URL 后启用后台连接。"
                : "前端已通过统一请求客户端管理后台通信。"}
            </p>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card title="GitHub 数据仓库" extra={<GithubOutlined />}>
            <div className="status-value">{config.repositoryName}</div>
            <p className="status-description">
              {repository?.branch || config.repositoryBranch} 分支 · 数据目录：
              {config.dataRoot}
            </p>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card title="访问会话" extra={<GithubOutlined />}>
            <div className="status-value">
              {isAuthenticated ? "已登录" : "未登录"}
            </div>
            <p className="status-description">
              {isAuthenticated
                ? session.user?.login || "GitHub 用户会话有效"
                : "登录后才能执行 GitHub 数据写入操作。"}
            </p>
            <Space>
              {!isAuthenticated && status !== "not-configured" && (
                <Button type="primary" onClick={authService.开始登录}>
                  GitHub 登录
                </Button>
              )}
              {isAuthenticated && (
                <Button onClick={() => authService.退出登录(request).then(refresh)}>
                  退出登录
                </Button>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </main>
  );
}
