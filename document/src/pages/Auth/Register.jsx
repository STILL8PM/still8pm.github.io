import React, { useState } from "react";
import { LockOutlined, MailOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { isBackendConfigured } from "../../config/environment";
import { useWorkbench } from "../../context/WorkbenchContext";
import AuthShell from "./AuthShell";

const { Text } = Typography;

/** Render registration and submit secrets only to the configured backend. */
export default function Register() {
  const navigate = useNavigate();
  const workbench = useWorkbench();
  const [submitting, setSubmitting] = useState(false);
  const backendConfigured = isBackendConfigured();

  const submit = async ({ confirmPassword, ...values }) => {
    if (!backendConfigured) {
      message.info("注册服务尚未配置，请先配置 Serverless 后端。");
      return;
    }

    setSubmitting(true);
    try {
      await workbench.authService.register(workbench.request, values);
      message.success("注册成功，请登录");
      navigate("/login", { replace: true });
    } catch (error) {
      message.error(error.message || "注册失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell eyebrow="CREATE ACCOUNT" title="注册账号" description="创建你的工作台账号，后续可由管理员分配分组和权限。">
      {!backendConfigured && <Alert className="auth-alert" type="warning" showIcon message="注册服务暂不可用" description="页面不会在浏览器保存账号密码。配置 Serverless 后端后即可安全注册。" />}
      <Form className="auth-form" layout="vertical" requiredMark={false} onFinish={submit}>
        <Form.Item name="username" label="用户名" rules={[{ required: true, message: "请输入用户名" }, { pattern: /^[a-zA-Z0-9_-]{3,32}$/, message: "使用 3-32 位英文、数字、_ 或 -" }]}>
          <Input size="large" prefix={<UserOutlined />} placeholder="设置用户名" autoComplete="username" />
        </Form.Item>
        <Form.Item name="email" label="邮箱" rules={[{ required: true, message: "请输入邮箱" }, { type: "email", message: "请输入有效邮箱" }]}>
          <Input size="large" prefix={<MailOutlined />} placeholder="name@example.com" autoComplete="email" />
        </Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true, message: "请输入密码" }, { min: 8, message: "密码至少需要 8 位" }]}>
          <Input.Password size="large" prefix={<LockOutlined />} placeholder="至少 8 位" autoComplete="new-password" />
        </Form.Item>
        <Form.Item name="confirmPassword" label="确认密码" dependencies={["password"]} rules={[{ required: true, message: "请再次输入密码" }, ({ getFieldValue }) => ({ validator(_, value) { return !value || getFieldValue("password") === value ? Promise.resolve() : Promise.reject(new Error("两次输入的密码不一致")); } })]}>
          <Input.Password size="large" prefix={<LockOutlined />} placeholder="再次输入密码" autoComplete="new-password" />
        </Form.Item>
        <Button className="auth-primary-button" type="primary" size="large" htmlType="submit" loading={submitting} block icon={<UserAddOutlined />}>创建账号</Button>
      </Form>
      <div className="auth-switch-link"><Text type="secondary">已有账号？</Text><Link to="/login">返回登录</Link></div>
    </AuthShell>
  );
}
