import React from "react";
import { CheckCircleOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Space, Typography } from "antd";
import "./index.css";

const { Paragraph, Text, Title } = Typography;

/** Provide the shared responsive frame for account entry pages. */
export default function AuthShell({ eyebrow, title, description, children }) {
  return (
    <main className="auth-page">
      <section className="auth-showcase" aria-label="工作台介绍">
        <Link className="auth-brand auth-brand-light" to="/login" aria-label="之一的工作台首页">
          <span className="auth-brand-mark">之</span>
          <span>
            <strong>之一的工作台</strong>
            <small>ONE WORKBENCH</small>
          </span>
        </Link>
        <div className="auth-showcase-content">
          <Text className="auth-eyebrow">PERSONAL DIGITAL WORKSPACE</Text>
          <Title>一个入口，管理你的全部工作。</Title>
          <Paragraph>跨设备访问常用模块，让内容、权限和数据存储始终保持清晰可控。</Paragraph>
          <Space className="auth-benefits" direction="vertical" size="middle">
            <Text><CheckCircleOutlined /> 响应式桌面与移动端体验</Text>
            <Text><CheckCircleOutlined /> GitHub 与坚果云 WebDAV 存储</Text>
            <Text><SafetyCertificateOutlined /> 凭据仅由安全后端处理</Text>
          </Space>
        </div>
        <Text className="auth-showcase-footer">STILL8PM / WORKBENCH</Text>
      </section>

      <section className="auth-panel">
        <div className="auth-mobile-brand">
          <Link className="auth-brand" to="/login">
            <span className="auth-brand-mark">之</span>
            <span><strong>之一的工作台</strong><small>ONE WORKBENCH</small></span>
          </Link>
        </div>
        <div className="auth-card">
          <Text className="auth-form-eyebrow">{eyebrow}</Text>
          <Title level={2}>{title}</Title>
          <Paragraph className="auth-description">{description}</Paragraph>
          {children}
        </div>
        <Text className="auth-copyright">© 2026 之一的工作台</Text>
      </section>
    </main>
  );
}
