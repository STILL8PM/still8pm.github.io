import React, { useState } from "react";
import {
  LockOutlined,
  LoginOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Alert, Button, Form, Input, Typography, message } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isBackendConfigured } from "../../config/environment";
import { useWorkbench } from "../../context/WorkbenchContext";
import { isAdminSession } from "../../services/authService";
import AuthShell from "./AuthShell";

const { Text } = Typography;

/** Render account login without persisting credentials in the browser. */
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const workbench = useWorkbench();
  const [submitting, setSubmitting] = useState(false);
  const backendConfigured = isBackendConfigured();

  const submit = async (values) => {
    if (!backendConfigured) {
      message.info("登录服务尚未配置，请先配置 Serverless 后端。");
      return;
    }

    setSubmitting(true);
    try {
      await workbench.authService.login(workbench.request, values);
      const nextState = await workbench.refresh();
      if (!isAdminSession(nextState.session)) {
        await workbench.authService.logout(workbench.request).catch(() => null);
        message.error("当前账号没有后台管理权限");
        return;
      }
      message.success("登录成功");
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      message.error(error.message || "登录失败，请检查账号和密码");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell eyebrow="ADMIN ACCESS" title="管理员登录" description="验证管理员账号后进入工作台控制台。">
      {location.state?.reason === "admin-required" && backendConfigured && <Alert className="auth-alert" type="warning" showIcon message="请先使用管理员账号登录" />}
      {!backendConfigured && <Alert className="auth-alert" type="info" showIcon message="登录服务尚未配置" description="请先配置 Serverless 后端，管理员密码不会保存在网页代码或浏览器中。" />}
      <Form className="auth-form" layout="vertical" requiredMark={false} onFinish={submit}>
        <Form.Item name="account" label="管理员账号" rules={[{ required: true, message: "请输入管理员账号" }]}>
          <Input size="large" prefix={<UserOutlined />} placeholder="管理员用户名或邮箱" autoComplete="username" />
        </Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true, message: "请输入密码" }]}>
          <Input.Password size="large" prefix={<LockOutlined />} placeholder="请输入密码" autoComplete="current-password" />
        </Form.Item>
        <Button className="auth-primary-button" type="primary" size="large" htmlType="submit" loading={submitting} block icon={<LoginOutlined />}>登录后台管理</Button>
      </Form>
      <div className="auth-security-note"><SafetyCertificateOutlined /><Text type="secondary">密码通过加密连接提交，并由后端安全哈希保存</Text></div>
      <div className="auth-switch-link"><Text type="secondary">还没有账号？</Text><Link to="/register">注册账号</Link></div>
    </AuthShell>
  );
}
