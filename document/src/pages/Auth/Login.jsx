import React, { useState } from "react";
import {
  GithubOutlined,
  LockOutlined,
  LoginOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Alert, Button, Divider, Form, Input, Space, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { isBackendConfigured } from "../../config/environment";
import { useWorkbench } from "../../context/WorkbenchContext";
import AuthShell from "./AuthShell";

const { Text } = Typography;

/** Render account login without persisting credentials in the browser. */
export default function Login() {
  const navigate = useNavigate();
  const workbench = useWorkbench();
  const [submitting, setSubmitting] = useState(false);
  const backendConfigured = isBackendConfigured();

  const submit = async (values) => {
    if (!backendConfigured) {
      message.info("登录服务尚未配置，请先进入后台完成 Serverless 配置。");
      return;
    }

    setSubmitting(true);
    try {
      await workbench.authService.login(workbench.request, values);
      await workbench.refresh();
      message.success("登录成功");
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      message.error(error.message || "登录失败，请检查账号和密码");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell eyebrow="WELCOME BACK" title="登录工作台" description="使用你的工作台账号继续访问。">
      {!backendConfigured && <Alert className="auth-alert" type="info" showIcon message="当前为本地管理模式" description="账号登录与注册需要配置 Serverless 后端，后台管理入口仍可正常使用。" />}
      <Form className="auth-form" layout="vertical" requiredMark={false} onFinish={submit}>
        <Form.Item name="account" label="账号" rules={[{ required: true, message: "请输入用户名或邮箱" }]}>
          <Input size="large" prefix={<UserOutlined />} placeholder="用户名或邮箱" autoComplete="username" />
        </Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true, message: "请输入密码" }]}>
          <Input.Password size="large" prefix={<LockOutlined />} placeholder="请输入密码" autoComplete="current-password" />
        </Form.Item>
        <Button className="auth-primary-button" type="primary" size="large" htmlType="submit" loading={submitting} block icon={<LoginOutlined />}>登录</Button>
      </Form>

      <Divider plain>其他入口</Divider>
      <Space className="auth-entry-buttons" direction="vertical" size="middle">
        <Button size="large" block icon={<SettingOutlined />} onClick={() => navigate("/admin/dashboard")}>进入后台管理</Button>
        <Button size="large" block icon={<GithubOutlined />} disabled={!backendConfigured} onClick={() => workbench.authService.startLogin()}>使用 GitHub 登录</Button>
      </Space>
      <div className="auth-switch-link"><Text type="secondary">还没有账号？</Text><Link to="/register">注册账号</Link></div>
    </AuthShell>
  );
}
