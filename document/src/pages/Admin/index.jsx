import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Form,
  Grid,
  Input,
  Layout,
  Menu,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  AppstoreOutlined,
  AuditOutlined,
  BarChartOutlined,
  CloudServerOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  KeyOutlined,
  LockOutlined,
  MenuOutlined,
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { appConfig, isBackendConfigured } from "../../config/environment";
import { useWorkbench } from "../../context/WorkbenchContext";
import "./index.css";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const menuItems = [
  { key: "dashboard", label: "仪表盘", icon: <BarChartOutlined /> },
  { key: "content", label: "内容管理", icon: <FileTextOutlined /> },
  { key: "users", label: "用户管理", icon: <UserOutlined /> },
  { key: "roles", label: "角色管理", icon: <KeyOutlined /> },
  { key: "groups", label: "分组管理", icon: <UsergroupAddOutlined /> },
  { key: "permissions", label: "权限管理", icon: <LockOutlined /> },
  { key: "settings", label: "系统设置", icon: <SettingOutlined /> },
];

const initialUsers = [
  {
    key: "1",
    username: "admin",
    email: "admin@example.com",
    role: "超级管理员",
    group: "系统管理组",
    status: "active",
    lastLogin: "2026-09-07 10:20",
  },
  {
    key: "2",
    username: "editor",
    email: "editor@example.com",
    role: "内容编辑",
    group: "内容运营组",
    status: "active",
    lastLogin: "2026-09-06 16:42",
  },
  {
    key: "3",
    username: "visitor",
    email: "visitor@example.com",
    role: "普通用户",
    group: "默认用户组",
    status: "disabled",
    lastLogin: "2026-08-28 09:12",
  },
];

const contentItems = [
  {
    key: "1",
    name: "知识笔记",
    route: "/notes",
    icon: "FileTextOutlined",
    visibility: "公开",
    status: "enabled",
    updatedAt: "2026-09-07 09:30",
  },
  {
    key: "2",
    name: "任务管理",
    route: "/tasks",
    icon: "CheckCircleOutlined",
    visibility: "登录可见",
    status: "enabled",
    updatedAt: "2026-09-06 14:20",
  },
  {
    key: "3",
    name: "系统文档",
    route: "/docs",
    icon: "BookOutlined",
    visibility: "管理员可见",
    status: "disabled",
    updatedAt: "2026-09-01 11:08",
  },
];

const roleItems = [
  { key: "1", name: "超级管理员", description: "拥有全部系统权限", members: 1, status: "系统内置" },
  { key: "2", name: "内容编辑", description: "管理前台内容和功能入口", members: 1, status: "正常" },
  { key: "3", name: "普通用户", description: "访问授权的前台功能", members: 1, status: "正常" },
];

const groupItems = [
  { key: "1", name: "系统管理组", description: "负责系统维护和安全管理", members: 1, roles: "超级管理员" },
  { key: "2", name: "内容运营组", description: "负责工作台内容维护", members: 1, roles: "内容编辑" },
  { key: "3", name: "默认用户组", description: "新注册用户默认分组", members: 1, roles: "普通用户" },
];

const permissionItems = [
  { key: "content:read", name: "查看内容", module: "内容管理", description: "查看前台内容和功能入口" },
  { key: "content:write", name: "编辑内容", module: "内容管理", description: "新增、修改和排序前台内容" },
  { key: "user:read", name: "查看用户", module: "用户管理", description: "查看用户基础信息" },
  { key: "user:write", name: "管理用户", module: "用户管理", description: "启用、禁用和修改用户" },
  { key: "role:write", name: "管理角色", module: "角色管理", description: "维护角色和角色权限" },
  { key: "group:write", name: "管理分组", module: "分组管理", description: "维护用户分组" },
  { key: "audit:read", name: "查看日志", module: "系统管理", description: "查看敏感操作审计日志" },
];

const statusLabels = {
  active: { text: "正常", color: "success" },
  disabled: { text: "已禁用", color: "default" },
  enabled: { text: "已启用", color: "success" },
};

/**
 * Administration shell and local demonstration state.
 *
 * The page is intentionally separated from the backend adapter. The local
 * records make the first UI iteration usable before Serverless endpoints are
 * deployed; each action is isolated so it can later be replaced by a service
 * call without changing the responsive layout.
 */
export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const { config, status: backendStatus } = useWorkbench();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [users, setUsers] = useState(initialUsers);
  const [content, setContent] = useState(contentItems);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userForm] = Form.useForm();

  const currentSection = useMemo(() => {
    const lastSegment = location.pathname.split("/").filter(Boolean).pop();
    return menuItems.some((item) => item.key === lastSegment) ? lastSegment : "dashboard";
  }, [location.pathname]);

  const currentMenuItem = menuItems.find((item) => item.key === currentSection);

  const handleMenuChange = ({ key }) => {
    navigate(`/admin/${key}`);
    setMobileMenuOpen(false);
  };

  const handleCreateUser = async (values) => {
    const nextUser = {
      key: String(users.length + 1),
      username: values.username,
      email: values.email,
      role: values.role,
      group: values.group,
      status: "active",
      lastLogin: "从未登录",
    };
    setUsers((current) => [...current, nextUser]);
    setUserModalOpen(false);
    userForm.resetFields();
  };

  const toggleContentStatus = (key) => {
    setContent((current) =>
      current.map((item) =>
        item.key === key
          ? { ...item, status: item.status === "enabled" ? "disabled" : "enabled" }
          : item
      )
    );
  };

  const renderSection = () => {
    switch (currentSection) {
      case "content":
        return <ContentManagement content={content} onToggleStatus={toggleContentStatus} />;
      case "users":
        return <UserManagement users={users} onCreate={() => setUserModalOpen(true)} />;
      case "roles":
        return <RoleManagement />;
      case "groups":
        return <GroupManagement />;
      case "permissions":
        return <PermissionManagement />;
      case "settings":
        return <SystemSettings backendStatus={backendStatus} config={config} />;
      default:
        return <Dashboard users={users} content={content} />;
    }
  };

  return (
    <Layout className="admin-layout">
      {screens.md ? (
        <Sider className="admin-sider" width={248} theme="light">
          <Brand />
          <AdminMenu selectedKey={currentSection} onChange={handleMenuChange} />
          <div className="sider-footer">
            <Text type="secondary">GitHub 数据工作台</Text>
            <Text type="secondary">v0.1.0 · 演示界面</Text>
          </div>
        </Sider>
      ) : (
        <Drawer
          className="admin-mobile-drawer"
          placement="left"
          closable={false}
          width={248}
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          bodyStyle={{ padding: 0 }}
        >
          <Brand />
          <AdminMenu selectedKey={currentSection} onChange={handleMenuChange} />
        </Drawer>
      )}
      <Layout>
        <Header className="admin-header">
          <Space size="middle">
            {!screens.md && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileMenuOpen(true)}
                aria-label="打开导航菜单"
              />
            )}
            <div>
              <Text className="breadcrumb-label">控制台 / </Text>
              <Text strong>{currentMenuItem?.label}</Text>
            </div>
          </Space>
          <Space size="middle">
            <Badge status={isBackendConfigured() ? "success" : "default"} text={isBackendConfigured() ? "后台已配置" : "演示模式"} />
            <Dropdown
              placement="bottomRight"
              overlay={
                <Menu
                  items={[
                    { key: "profile", label: "个人中心", icon: <UserOutlined /> },
                    { key: "logout", label: "退出登录", icon: <LockOutlined /> },
                  ]}
                />
              }
            >
              <Button type="text" className="account-button">
                <Avatar size="small">之</Avatar>
                <span className="account-name">管理员</span>
              </Button>
            </Dropdown>
          </Space>
        </Header>
        <Content className="admin-content">{renderSection()}</Content>
      </Layout>
      <Modal
        title="新增用户"
        open={userModalOpen}
        okText="创建用户"
        cancelText="取消"
        onOk={() => userForm.submit()}
        onCancel={() => setUserModalOpen(false)}
      >
        <Form form={userForm} layout="vertical" onFinish={handleCreateUser}>
          <Form.Item name="username" label="用户名" rules={[{ required: true, message: "请输入用户名" }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: "email", message: "请输入正确邮箱" }]}>
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="role" label="角色" initialValue="普通用户">
            <Select options={["超级管理员", "内容编辑", "普通用户"].map((value) => ({ value, label: value }))} />
          </Form.Item>
          <Form.Item name="group" label="分组" initialValue="默认用户组">
            <Select options={["系统管理组", "内容运营组", "默认用户组"].map((value) => ({ value, label: value }))} />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

function Brand() {
  return (
    <div className="admin-brand">
      <div className="brand-mark">之</div>
      <div>
        <div className="brand-title">之一的工作台</div>
        <div className="brand-subtitle">ADMIN CONSOLE</div>
      </div>
    </div>
  );
}

function AdminMenu({ selectedKey, onChange }) {
  return <Menu mode="inline" selectedKeys={[selectedKey]} items={menuItems} onClick={onChange} />;
}

function PageHeader({ title, description, extra }) {
  return (
    <div className="page-header">
      <div>
        <Title level={2}>{title}</Title>
        <Text type="secondary">{description}</Text>
      </div>
      {extra}
    </div>
  );
}

function Dashboard({ users, content }) {
  const activeUsers = users.filter((user) => user.status === "active").length;
  const enabledContent = content.filter((item) => item.status === "enabled").length;

  return (
    <div>
      <PageHeader title="仪表盘" description="查看工作台的运行概况和最近活动。" />
      <Alert
        className="demo-alert"
        type="info"
        showIcon
        message="当前为后台管理界面演示模式"
        description="数据来自本地演示状态，Serverless API 部署后将替换为真实 GitHub 数据。"
      />
      <Row gutter={[16, 16]} className="stat-row">
        <Col xs={24} sm={12} xl={6}>
          <Card><Statistic title="用户总数" value={users.length} prefix={<TeamOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card><Statistic title="活跃用户" value={activeUsers} valueStyle={{ color: "#16a34a" }} prefix={<UserOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card><Statistic title="前台功能" value={content.length} prefix={<AppstoreOutlined />} /></Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card><Statistic title="已启用功能" value={enabledContent} valueStyle={{ color: "#2563eb" }} prefix={<FolderOpenOutlined />} /></Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="dashboard-row">
        <Col xs={24} xl={15}>
          <Card title="最近活动" extra={<Button type="link">查看全部</Button>}>
            <ActivityList />
          </Card>
        </Col>
        <Col xs={24} xl={9}>
          <Card title="系统健康">
            <HealthItem label="前端应用" value="运行正常" percent={100} color="#16a34a" />
            <HealthItem label="数据接口" value="待配置" percent={35} color="#f59e0b" />
            <HealthItem label="GitHub 仓库" value="待连接" percent={20} color="#f59e0b" />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

function ActivityList() {
  const activities = [
    { icon: <UserOutlined />, title: "管理员登录了管理控制台", time: "刚刚", color: "blue" },
    { icon: <FileTextOutlined />, title: "内容编辑更新了知识笔记入口", time: "2 小时前", color: "green" },
    { icon: <SettingOutlined />, title: "系统配置等待 Serverless 后端接入", time: "今天 09:30", color: "orange" },
  ];

  return (
    <div className="activity-list">
      {activities.map((activity) => (
        <div className="activity-item" key={activity.title}>
          <Avatar className={`activity-avatar ${activity.color}`} icon={activity.icon} />
          <div className="activity-content">
            <Text>{activity.title}</Text>
            <Text type="secondary">{activity.time}</Text>
          </div>
        </div>
      ))}
    </div>
  );
}

function HealthItem({ label, value, percent, color }) {
  return (
    <div className="health-item">
      <div className="health-label"><Text>{label}</Text><Text type="secondary">{value}</Text></div>
      <Progress percent={percent} showInfo={false} strokeColor={color} />
    </div>
  );
}

function ContentManagement({ content, onToggleStatus }) {
  const columns = [
    { title: "名称", dataIndex: "name", key: "name", render: (value) => <Text strong>{value}</Text> },
    { title: "路由", dataIndex: "route", key: "route" },
    { title: "图标", dataIndex: "icon", key: "icon" },
    { title: "可见范围", dataIndex: "visibility", key: "visibility" },
    { title: "状态", dataIndex: "status", key: "status", render: (value) => <Tag color={statusLabels[value].color}>{statusLabels[value].text}</Tag> },
    { title: "更新时间", dataIndex: "updatedAt", key: "updatedAt" },
    {
      title: "操作",
      key: "action",
      render: (_, record) => <Button type="link" onClick={() => onToggleStatus(record.key)}>{record.status === "enabled" ? "停用" : "启用"}</Button>,
    },
  ];

  return (
    <div>
      <PageHeader title="内容管理" description="管理前台功能入口、菜单和展示状态。" extra={<Button type="primary" icon={<PlusOutlined />}>新增功能</Button>} />
      <Card><Table rowKey="key" columns={columns} dataSource={content} scroll={{ x: 800 }} pagination={false} /></Card>
    </div>
  );
}

function UserManagement({ users, onCreate }) {
  const [keyword, setKeyword] = useState("");
  const filteredUsers = users.filter((user) => `${user.username}${user.email}`.toLowerCase().includes(keyword.toLowerCase()));
  const columns = [
    { title: "用户", key: "user", render: (_, record) => <Space><Avatar>{record.username.slice(0, 1).toUpperCase()}</Avatar><div><Text strong>{record.username}</Text><br /><Text type="secondary">{record.email}</Text></div></Space> },
    { title: "角色", dataIndex: "role", key: "role", render: (value) => <Tag color="blue">{value}</Tag> },
    { title: "分组", dataIndex: "group", key: "group" },
    { title: "状态", dataIndex: "status", key: "status", render: (value) => <Tag color={statusLabels[value].color}>{statusLabels[value].text}</Tag> },
    { title: "最后登录", dataIndex: "lastLogin", key: "lastLogin" },
    { title: "操作", key: "action", render: () => <Button type="link">编辑</Button> },
  ];

  return (
    <div>
      <PageHeader title="用户管理" description="管理用户状态、角色和所属分组。" extra={<Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>新增用户</Button>} />
      <Card>
        <div className="table-toolbar"><Input.Search allowClear placeholder="搜索用户名或邮箱" value={keyword} onChange={(event) => setKeyword(event.target.value)} style={{ maxWidth: 320 }} /><Space><Button icon={<ReloadOutlined />}>刷新</Button><Button>导出</Button></Space></div>
        <Table rowKey="key" columns={columns} dataSource={filteredUsers} scroll={{ x: 800 }} pagination={{ pageSize: 8 }} />
      </Card>
    </div>
  );
}

function RoleManagement() {
  const columns = [
    { title: "角色名称", dataIndex: "name", key: "name", render: (value) => <Text strong>{value}</Text> },
    { title: "说明", dataIndex: "description", key: "description" },
    { title: "成员数", dataIndex: "members", key: "members" },
    { title: "状态", dataIndex: "status", key: "status", render: (value) => <Tag>{value}</Tag> },
    { title: "操作", key: "action", render: () => <Space><Button type="link">权限</Button><Button type="link">编辑</Button></Space> },
  ];
  return <ManagementTable title="角色管理" description="定义可复用的系统角色和角色权限。" button="新增角色" columns={columns} dataSource={roleItems} />;
}

function GroupManagement() {
  const columns = [
    { title: "分组名称", dataIndex: "name", key: "name", render: (value) => <Text strong>{value}</Text> },
    { title: "说明", dataIndex: "description", key: "description" },
    { title: "成员数", dataIndex: "members", key: "members" },
    { title: "关联角色", dataIndex: "roles", key: "roles", render: (value) => <Tag color="purple">{value}</Tag> },
    { title: "操作", key: "action", render: () => <Space><Button type="link">成员</Button><Button type="link">编辑</Button></Space> },
  ];
  return <ManagementTable title="分组管理" description="通过分组批量分配用户角色和访问范围。" button="新增分组" columns={columns} dataSource={groupItems} />;
}

function ManagementTable({ title, description, button, columns, dataSource }) {
  return <div><PageHeader title={title} description={description} extra={<Button type="primary" icon={<PlusOutlined />}>{button}</Button>} /><Card><Table rowKey="key" columns={columns} dataSource={dataSource} pagination={false} scroll={{ x: 700 }} /></Card></div>;
}

function PermissionManagement() {
  const columns = [
    { title: "权限标识", dataIndex: "key", key: "key", render: (value) => <Text code>{value}</Text> },
    { title: "权限名称", dataIndex: "name", key: "name" },
    { title: "所属模块", dataIndex: "module", key: "module" },
    { title: "说明", dataIndex: "description", key: "description" },
    { title: "状态", key: "status", render: () => <Tag color="success">启用</Tag> },
  ];
  return <div><PageHeader title="权限管理" description="维护系统权限标识，角色和分组通过权限控制功能访问。" extra={<Button type="primary" icon={<PlusOutlined />}>新增权限</Button>} /><Card><Alert className="permission-alert" type="warning" showIcon message="权限以后端校验为最终依据" description="前端权限仅用于隐藏菜单和按钮，不能代替 Serverless 后端的权限判断。" /><Table rowKey="key" columns={columns} dataSource={permissionItems} pagination={false} scroll={{ x: 750 }} /></Card></div>;
}

function SystemSettings({ backendStatus, config }) {
  return (
    <div>
      <PageHeader title="系统设置" description="查看运行环境和数据连接配置。" extra={<Button icon={<ReloadOutlined />}>刷新状态</Button>} />
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}><Card title="后台连接"><div className="setting-row"><Text>连接状态</Text><Tag color={backendStatus === "ready" ? "success" : "default"}>{backendStatus === "ready" ? "已连接" : "演示模式"}</Tag></div><Divider /><div className="setting-row"><Text>接口地址</Text><Text type="secondary">{config.apiBaseUrl || "未配置"}</Text></div><div className="setting-row"><Text>请求策略</Text><Text type="secondary">HttpOnly Cookie + 10 秒超时</Text></div></Card></Col>
        <Col xs={24} xl={12}><Card title="GitHub 数据仓库"><div className="setting-row"><Text>仓库</Text><Text code>{config.repositoryOwner}/{config.repositoryName}</Text></div><Divider /><div className="setting-row"><Text>分支</Text><Text type="secondary">{config.repositoryBranch}</Text></div><div className="setting-row"><Text>数据目录</Text><Text type="secondary">{config.dataRoot}</Text></div></Card></Col>
      </Row>
      <Card className="security-card" title={<Space><AuditOutlined />安全说明</Space>}><Alert type="info" showIcon message="敏感数据必须由 Serverless 后端加密处理" description="密码只能使用 Argon2id 或 bcrypt 哈希，用户资料使用服务端密钥加密；前端构建产物和浏览器存储中禁止出现 GitHub Token。" /></Card>
    </div>
  );
}
