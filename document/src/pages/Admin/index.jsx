import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Dropdown,
  Form,
  Grid,
  Input,
  InputNumber,
  Layout,
  Menu,
  message,
  Modal,
  Popconfirm,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Table,
  Tag,
  Typography,
  Upload,
} from "antd";
import {
  AppstoreOutlined,
  AuditOutlined,
  BarChartOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
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
  UploadOutlined,
} from "@ant-design/icons";
import { isBackendConfigured } from "../../config/environment";
import { useWorkbench } from "../../context/WorkbenchContext";
import { buildModuleTree, buildVisibleModuleTree } from "../../services/moduleRegistry";
import { storageProviders } from "../../services/storageProviders";
import { useAdminStore } from "./useAdminStore";
import "./index.css";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const menuItems = [
  { key: "dashboard", label: "仪表盘", icon: <BarChartOutlined /> },
  { key: "modules", label: "模块功能", icon: <AppstoreOutlined /> },
  { key: "users", label: "用户管理", icon: <UserOutlined /> },
  { key: "roles", label: "角色管理", icon: <KeyOutlined /> },
  { key: "groups", label: "分组管理", icon: <UsergroupAddOutlined /> },
  { key: "permissions", label: "权限管理", icon: <LockOutlined /> },
  { key: "audit", label: "审计日志", icon: <AuditOutlined /> },
  { key: "settings", label: "系统设置", icon: <SettingOutlined /> },
];

const visibilityOptions = [
  { value: "public", label: "公开" },
  { value: "authenticated", label: "登录可见" },
  { value: "permission", label: "按权限可见" },
];

const iconOptions = ["AppstoreOutlined", "BookOutlined", "CheckCircleOutlined", "FileTextOutlined", "FolderOpenOutlined", "SettingOutlined"];

/**
 * Render the administration shell and route each section from the URL.
 *
 * Desktop devices receive a fixed sider while mobile devices receive a drawer.
 * All section mutations use one persisted administration store, so navigation
 * and browser refreshes do not discard completed work.
 */
export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const adminStore = useAdminStore();
  const workbench = useWorkbench();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentSection = useMemo(() => {
    const segment = location.pathname.split("/").filter(Boolean).pop();
    return menuItems.some((item) => item.key === segment) ? segment : "dashboard";
  }, [location.pathname]);

  const handleMenuChange = ({ key }) => {
    navigate(`/admin/${key}`);
    setMobileMenuOpen(false);
  };

  return (
    <Layout className="admin-layout">
      {screens.md ? (
        <Sider className="admin-sider" width={248} theme="light">
          <Brand />
          <AdminMenu selectedKey={currentSection} onChange={handleMenuChange} />
          <div className="sider-footer">
            <Text type="secondary">Local persistent mode</Text>
            <Text type="secondary">v0.2.0</Text>
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
        <AdminHeader
          currentSection={currentSection}
          mobile={Boolean(!screens.md)}
          onOpenMenu={() => setMobileMenuOpen(true)}
          onOpenUsers={() => navigate("/admin/users")}
        />
        <Content className="admin-content">
          <AdminSection section={currentSection} store={adminStore} workbench={workbench} />
        </Content>
      </Layout>
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

function AdminHeader({ currentSection, mobile, onOpenMenu, onOpenUsers }) {
  const currentItem = menuItems.find((item) => item.key === currentSection);
  return (
    <Header className="admin-header">
      <Space size="middle">
        {mobile && <Button type="text" icon={<MenuOutlined />} onClick={onOpenMenu} aria-label="打开导航菜单" />}
        <div className="header-title"><Text className="breadcrumb-label">控制台 / </Text><Text strong>{currentItem?.label}</Text></div>
      </Space>
      <Space size="middle">
        <Badge className="backend-badge" status={isBackendConfigured() ? "success" : "processing"} text={isBackendConfigured() ? "后台已配置" : "本地模式"} />
        <Button type="text" className="account-button" onClick={onOpenUsers}><Avatar size="small">之</Avatar><span className="account-name">管理员</span></Button>
      </Space>
    </Header>
  );
}

function AdminSection({ section, store, workbench }) {
  switch (section) {
    case "modules": return <ModuleManagement store={store} />;
    case "users": return <UserManagement store={store} />;
    case "roles": return <RoleManagement store={store} />;
    case "groups": return <GroupManagement store={store} />;
    case "permissions": return <PermissionManagement store={store} />;
    case "audit": return <AuditLog store={store} />;
    case "settings": return <SystemSettings store={store} workbench={workbench} />;
    default: return <Dashboard store={store} />;
  }
}

function PageHeader({ title, description, extra }) {
  return <div className="page-header"><div><Title level={2}>{title}</Title><Text type="secondary">{description}</Text></div>{extra}</div>;
}

function Dashboard({ store }) {
  const activeUsers = store.users.filter((user) => user.status === "active").length;
  const moduleCount = store.modules.filter((item) => item.type === "module").length;
  const featureCount = store.modules.filter((item) => item.type === "feature").length;
  const visibleTree = buildVisibleModuleTree(store.modules, {
    authenticated: true,
    permissionIds: store.permissions.map((item) => item.id),
  });
  const visibleFeatureCount = visibleTree.reduce((total, item) => total + item.children.length, 0);
  return (
    <div>
      <PageHeader title="仪表盘" description="查看工作台的实时本地数据和最近操作。" />
      <Alert className="demo-alert" type="info" showIcon message="后台功能已启用本地持久化模式" description="增删改查结果保存在当前浏览器。配置 Serverless 后可切换到 GitHub 或坚果云 WebDAV。" />
      <Row gutter={[16, 16]} className="stat-row">
        <StatCard title="用户 / 活跃" value={`${store.users.length} / ${activeUsers}`} icon={<TeamOutlined />} />
        <StatCard title="模块总数" value={moduleCount} icon={<AppstoreOutlined />} />
        <StatCard title="前台显示模块" value={visibleTree.length} icon={<FolderOpenOutlined />} color="#16a34a" />
        <StatCard title="功能 / 可显示" value={`${featureCount} / ${visibleFeatureCount}`} icon={<FileTextOutlined />} color="#2563eb" />
      </Row>
      <Row gutter={[16, 16]} className="dashboard-row">
        <Col xs={24} xl={15}><Card title="最近操作"><ActivityList logs={store.auditLogs.slice(0, 6)} /></Card></Col>
        <Col xs={24} xl={9}><Card title="系统健康"><HealthItem label="管理界面" value="运行正常" percent={100} color="#16a34a" /><HealthItem label="本地数据" value="已持久化" percent={100} color="#16a34a" /><HealthItem label="远端存储" value={isBackendConfigured() ? "已配置" : "待接入"} percent={isBackendConfigured() ? 100 : 30} color={isBackendConfigured() ? "#16a34a" : "#f59e0b"} /></Card></Col>
      </Row>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return <Col xs={24} sm={12} xl={6}><Card><Statistic title={title} value={value} prefix={icon} valueStyle={color ? { color } : undefined} /></Card></Col>;
}

function ActivityList({ logs }) {
  return <div className="activity-list">{logs.map((log) => <div className="activity-item" key={log.id}><Avatar className="activity-avatar blue" icon={<AuditOutlined />} /><div className="activity-content"><Text>{log.action} · {log.target}</Text><Text type="secondary">{log.operator} · {log.createdAt}</Text></div></div>)}</div>;
}

function HealthItem({ label, value, percent, color }) {
  return <div className="health-item"><div className="health-label"><Text>{label}</Text><Text type="secondary">{value}</Text></div><Progress percent={percent} showInfo={false} strokeColor={color} /></div>;
}

function ModuleManagement({ store }) {
  const screens = useBreakpoint();
  const [editor, setEditor] = useState(null);
  const [form] = Form.useForm();
  const selectedVisibility = Form.useWatch("visibility", form);
  const moduleOptions = store.modules
    .filter((item) => item.type === "module")
    .sort((first, second) => first.sort - second.sort)
    .map((item) => ({ value: item.id, label: item.name }));
  const tree = buildModuleTree(store.modules);

  const openEditor = (type, record = {}, parentId = null) => {
    const { children, ...editableRecord } = record;
    const nextEditor = { type, parentId, ...editableRecord };
    setEditor(nextEditor);
    form.setFieldsValue({
      status: "enabled",
      visibility: "public",
      permissionId: "",
      sort: 10,
      icon: iconOptions[0],
      ...nextEditor,
    });
  };

  const save = (values) => {
    const duplicateName = store.modules.some((item) => (
      item.id !== editor?.id
      && item.type === editor?.type
      && item.parentId === (editor?.type === "module" ? null : values.parentId)
      && item.name === values.name
    ));
    if (duplicateName) return message.error("同一层级已存在同名记录");
    const duplicateRoute = editor?.type === "feature" && store.modules.some((item) => (
      item.id !== editor?.id && item.type === "feature" && item.route === values.route
    ));
    if (duplicateRoute) return message.error("功能路由已存在");

    try {
      store.saveModuleItem({ ...editor, ...values });
      message.success(editor?.id ? "记录已更新" : editor?.type === "module" ? "模块已创建" : "功能已创建");
      setEditor(null);
    } catch (error) {
      message.error(error.message);
    }
  };

  const remove = (record) => {
    store.deleteModuleItem(record.id);
    message.success(record.type === "module" ? "模块及其功能已删除" : "功能已删除");
  };

  const toggle = (record) => {
    store.toggleModuleItemStatus(record.id);
    message.success(record.status === "enabled" ? "已从前台隐藏" : "已在前台显示");
  };

  const columns = [
    { title: "名称", dataIndex: "name", width: screens.md ? undefined : 142, render: (value, record) => <div><Text strong>{value}</Text>{screens.md && <><br /><Text type="secondary">{record.description}</Text></>}</div> },
    { title: "类型", dataIndex: "type", width: screens.md ? 90 : 62, render: (value) => <Tag color={value === "module" ? "blue" : "cyan"}>{value === "module" ? "模块" : "功能"}</Tag> },
    { title: "路由", dataIndex: "route", responsive: ["md"], render: (value, record) => record.type === "feature" ? <Text code>{value}</Text> : "-" },
    { title: "可见范围", dataIndex: "visibility", responsive: ["lg"], render: (value) => visibilityOptions.find((item) => item.value === value)?.label },
    { title: "排序", dataIndex: "sort", responsive: ["lg"], sorter: (a, b) => a.sort - b.sort },
    { title: "前台显示", dataIndex: "status", width: screens.md ? 106 : 76, render: (value, record) => <Switch size="small" checked={value === "enabled"} checkedChildren="显示" unCheckedChildren="隐藏" onChange={() => toggle(record)} aria-label={`${record.name}前台显示状态`} /> },
    { title: "操作", width: screens.md ? 300 : 62, render: (_, record) => <ActionButtons compact={!screens.md} onAdd={record.type === "module" ? () => openEditor("feature", {}, record.id) : undefined} addText="新增功能" onEdit={() => openEditor(record.type, record)} onDelete={() => remove(record)} deleteConfirmTitle={record.type === "module" && record.children.length ? `删除模块将同时删除 ${record.children.length} 个功能，确认继续？` : "确认删除这条记录？"} /> },
  ];
  return (
    <div>
      <PageHeader title="模块功能" description="按模块组织前台功能，并控制模块和功能是否在前台显示。" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => openEditor("module")}>新增模块</Button>} />
      <Alert className="module-alert" type="info" showIcon message="模块是功能的上级显示开关" description="隐藏模块后，其下全部功能都不会在前台显示；重新显示模块时，各功能仍保留自己的显示状态。" />
      <Card>
        <Table rowKey="id" columns={columns} tableLayout={screens.md ? "auto" : "fixed"} dataSource={tree} defaultExpandAllRows pagination={false} scroll={screens.md ? { x: 960 } : undefined} />
      </Card>
      <EntityModal title={`${editor?.id ? "编辑" : "新增"}${editor?.type === "module" ? "模块" : "功能"}`} open={editor !== null} form={form} onCancel={() => setEditor(null)} onSave={save}>
        {editor?.type === "feature" && <Form.Item name="parentId" label="所属模块" rules={[{ required: true, message: "请选择所属模块" }]}><Select options={moduleOptions} /></Form.Item>}
        <Form.Item name="name" label="名称" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="description" label="说明"><Input.TextArea rows={2} /></Form.Item>
        {editor?.type === "feature" && <Form.Item name="route" label="路由" rules={[{ required: true }, { pattern: /^\//, message: "路由必须以 / 开头" }]}><Input /></Form.Item>}
        <Form.Item name="icon" label="图标" rules={[{ required: true }]}><Select options={iconOptions.map((value) => ({ value, label: value }))} /></Form.Item>
        <Form.Item name="visibility" label="可见范围" rules={[{ required: true }]}><Select options={visibilityOptions} /></Form.Item>
        <Form.Item name="permissionId" label="所需权限" rules={[{ required: selectedVisibility === "permission", message: "按权限可见时必须选择权限" }]}><Select allowClear disabled={selectedVisibility !== "permission"} options={store.permissions.map((item) => ({ value: item.id, label: `${item.name} (${item.id})` }))} /></Form.Item>
        <Form.Item name="sort" label="排序" rules={[{ required: true }]}><InputNumber min={0} precision={0} /></Form.Item>
        <Form.Item name="status" label="前台显示" rules={[{ required: true }]}><Select options={[{ value: "enabled", label: "显示" }, { value: "disabled", label: "隐藏" }]} /></Form.Item>
      </EntityModal>
    </div>
  );
}

function UserManagement({ store }) {
  const screens = useBreakpoint();
  const [keyword, setKeyword] = useState("");
  const [editor, setEditor] = useState(null);
  const [form] = Form.useForm();
  const openEditor = (record = {}) => {
    setEditor(record);
    form.setFieldsValue({ status: "active", roleIds: [], groupIds: [], ...record });
  };
  const save = (values) => {
    const duplicate = store.users.some((item) => item.id !== editor?.id && (item.username === values.username || item.email === values.email));
    if (duplicate) return message.error("用户名或邮箱已存在");
    store.saveUser({ ...editor, ...values });
    message.success(editor?.id ? "用户已更新" : "用户已创建");
    setEditor(null);
  };
  const run = (action, successText) => { try { action(); message.success(successText); } catch (error) { message.error(error.message); } };
  const data = store.users.filter((user) => `${user.username}${user.email}`.toLowerCase().includes(keyword.toLowerCase()));
  const columns = [
    { title: "用户", render: (_, record) => <Space><Avatar>{record.username.slice(0, 1).toUpperCase()}</Avatar><div><Text strong>{record.username}</Text><br /><Text type="secondary">{record.email}</Text></div></Space> },
    { title: "角色", responsive: ["lg"], render: (_, record) => record.roleIds.map((id) => <Tag color="blue" key={id}>{store.roleMap[id]?.name || id}</Tag>) },
    { title: "分组", responsive: ["lg"], render: (_, record) => record.groupIds.map((id) => <Tag key={id}>{store.groupMap[id]?.name || id}</Tag>) },
    { title: "状态", dataIndex: "status", responsive: ["sm"], render: (value) => <StatusTag status={value} /> },
    { title: "最后登录", dataIndex: "lastLogin", responsive: ["md"] },
    { title: "操作", width: screens.md ? 210 : 92, render: (_, record) => <ActionButtons compact={!screens.md} onEdit={() => openEditor(record)} onToggle={() => run(() => store.toggleUserStatus(record.id), "状态已更新")} toggleText={record.status === "active" ? "禁用" : "启用"} onDelete={() => run(() => store.deleteUser(record.id), "用户已删除")} /> },
  ];
  return <div><PageHeader title="用户管理" description="管理用户状态、角色和所属分组。" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => openEditor()}>新增用户</Button>} /><Card><div className="table-toolbar"><Input.Search allowClear placeholder="搜索用户名或邮箱" value={keyword} onChange={(event) => setKeyword(event.target.value)} /><Text type="secondary">共 {data.length} 个用户</Text></div><Table rowKey="id" columns={columns} dataSource={data} scroll={screens.md ? { x: 1000 } : undefined} /></Card><EntityModal title={editor?.id ? "编辑用户" : "新增用户"} open={editor !== null} form={form} onCancel={() => setEditor(null)} onSave={save}><Form.Item name="username" label="用户名" rules={[{ required: true }, { pattern: /^[a-zA-Z0-9_-]{3,32}$/, message: "使用 3-32 位英文、数字、_ 或 -" }]}><Input disabled={editor?.id === "user-admin"} /></Form.Item><Form.Item name="email" label="邮箱" rules={[{ required: true, type: "email" }]}><Input /></Form.Item><Form.Item name="roleIds" label="角色"><Select mode="multiple" options={store.roles.map((item) => ({ value: item.id, label: item.name }))} /></Form.Item><Form.Item name="groupIds" label="分组"><Select mode="multiple" options={store.groups.map((item) => ({ value: item.id, label: item.name }))} /></Form.Item><Form.Item name="status" label="状态"><Select disabled={editor?.id === "user-admin"} options={[{ value: "active", label: "正常" }, { value: "disabled", label: "禁用" }]} /></Form.Item></EntityModal></div>;
}

function RoleManagement({ store }) {
  return <AccessManagement type="role" title="角色管理" description="定义角色并分配系统权限。" records={store.roles} onSave={store.saveRole} onDelete={store.deleteRole} options={store.permissions.map((item) => ({ value: item.id, label: `${item.name} (${item.id})` }))} />;
}

function GroupManagement({ store }) {
  return <AccessManagement type="group" title="分组管理" description="通过分组批量分配角色。" records={store.groups} onSave={store.saveGroup} onDelete={store.deleteGroup} options={store.roles.map((item) => ({ value: item.id, label: item.name }))} />;
}

function AccessManagement({ type, title, description, records, onSave, onDelete, options }) {
  const screens = useBreakpoint();
  const [editor, setEditor] = useState(null);
  const [form] = Form.useForm();
  const relationKey = type === "role" ? "permissionIds" : "roleIds";
  const openEditor = (record = {}) => { setEditor(record); form.setFieldsValue({ [relationKey]: [], ...record }); };
  const save = (values) => {
    if (records.some((item) => item.id !== editor?.id && item.name === values.name)) return message.error("名称已存在");
    onSave({ ...editor, ...values });
    message.success(editor?.id ? "记录已更新" : "记录已创建");
    setEditor(null);
  };
  const remove = (id) => { try { onDelete(id); message.success("记录已删除"); } catch (error) { message.error(error.message); } };
  const columns = [
    { title: "名称", dataIndex: "name", render: (value) => <Text strong>{value}</Text> },
    { title: "说明", dataIndex: "description", responsive: ["md"] },
    { title: type === "role" ? "权限数" : "角色数", responsive: ["sm"], render: (_, record) => record[relationKey].length },
    { title: "关联项", responsive: ["lg"], render: (_, record) => <Space wrap>{record[relationKey].slice(0, 3).map((id) => <Tag key={id}>{options.find((item) => item.value === id)?.label || id}</Tag>)}{record[relationKey].length > 3 && <Tag>+{record[relationKey].length - 3}</Tag>}</Space> },
    { title: "操作", width: screens.md ? 100 : 80, render: (_, record) => <ActionButtons compact={!screens.md} onEdit={() => openEditor(record)} hideDelete={record.builtIn} onDelete={() => remove(record.id)} /> },
  ];
  return <div><PageHeader title={title} description={description} extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => openEditor()}>新增{type === "role" ? "角色" : "分组"}</Button>} /><Card><Table rowKey="id" columns={columns} dataSource={records} scroll={screens.md ? { x: 800 } : undefined} /></Card><EntityModal title={`${editor?.id ? "编辑" : "新增"}${type === "role" ? "角色" : "分组"}`} open={editor !== null} form={form} onCancel={() => setEditor(null)} onSave={save}><Form.Item name="name" label="名称" rules={[{ required: true }]}><Input /></Form.Item><Form.Item name="description" label="说明"><Input.TextArea rows={3} /></Form.Item><Form.Item name={relationKey} label={type === "role" ? "权限" : "角色"}><Select mode="multiple" options={options} /></Form.Item></EntityModal></div>;
}

function PermissionManagement({ store }) {
  const screens = useBreakpoint();
  const [editor, setEditor] = useState(null);
  const [form] = Form.useForm();
  const openEditor = (record = {}) => { setEditor(record); form.setFieldsValue(record); };
  const save = (values) => {
    if (store.permissions.some((item) => item.id !== editor?.id && item.id === values.id)) return message.error("权限标识已存在");
    store.savePermission({ ...editor, ...values });
    message.success(editor?.id ? "权限已更新" : "权限已创建");
    setEditor(null);
  };
  const remove = (id) => { try { store.deletePermission(id); message.success("权限已删除"); } catch (error) { message.error(error.message); } };
  const columns = [
    { title: "权限标识", dataIndex: "id", render: (value) => <Text code>{value}</Text> },
    { title: "权限名称", dataIndex: "name" },
    { title: "模块", dataIndex: "module", responsive: ["sm"] },
    { title: "说明", dataIndex: "description", responsive: ["lg"] },
    { title: "操作", width: screens.md ? 100 : 80, render: (_, record) => <ActionButtons compact={!screens.md} onEdit={() => openEditor(record)} onDelete={() => remove(record.id)} /> },
  ];
  return <div><PageHeader title="权限管理" description="维护后端授权使用的权限标识。" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => openEditor()}>新增权限</Button>} /><Alert className="permission-alert" type="warning" showIcon message="后端权限校验是最终依据" description="前端只负责展示，Serverless 接口仍必须校验每次操作。" /><Card><Table rowKey="id" columns={columns} dataSource={store.permissions} scroll={screens.md ? { x: 800 } : undefined} /></Card><EntityModal title={editor?.id ? "编辑权限" : "新增权限"} open={editor !== null} form={form} onCancel={() => setEditor(null)} onSave={save}><Form.Item name="id" label="权限标识" rules={[{ required: true }, { pattern: /^[a-z][a-z0-9_-]*:[a-z][a-z0-9_-]*$/, message: "格式示例：user:write" }]}><Input disabled={Boolean(editor?.id)} /></Form.Item><Form.Item name="name" label="名称" rules={[{ required: true }]}><Input /></Form.Item><Form.Item name="module" label="模块" rules={[{ required: true }]}><Input /></Form.Item><Form.Item name="description" label="说明"><Input.TextArea rows={3} /></Form.Item></EntityModal></div>;
}

function AuditLog({ store }) {
  const screens = useBreakpoint();
  const columns = [
    { title: "时间", dataIndex: "createdAt", width: 170 },
    { title: "操作者", dataIndex: "operator", width: 100, responsive: ["md"] },
    { title: "模块", dataIndex: "module", responsive: ["sm"], render: (value) => <Tag>{value}</Tag> },
    { title: "动作", dataIndex: "action", render: (value) => <Text code>{value}</Text> },
    { title: "对象", dataIndex: "target" },
  ];
  return <div><PageHeader title="审计日志" description="查看后台本地模式中的所有管理操作。" extra={<Popconfirm title="确认清空审计日志？" onConfirm={() => { store.clearAuditLogs(); message.success("日志已清空"); }}><Button danger icon={<DeleteOutlined />}>清空日志</Button></Popconfirm>} /><Card><Table rowKey="id" columns={columns} dataSource={store.auditLogs} scroll={screens.md ? { x: 750 } : undefined} /></Card></div>;
}

function SystemSettings({ store, workbench }) {
  const [generalForm] = Form.useForm();
  const [storageForm] = Form.useForm();
  const storage = store.settings.storage;
  const [provider, setProvider] = useState(storage.provider);
  const saveStorage = async (values) => {
    try {
      if (isBackendConfigured()) {
        await workbench.request.put("/api/admin/storage", values);
      }
      store.saveStorageSettings(values);
      storageForm.setFieldValue("webdavPassword", "");
      message.success(isBackendConfigured() ? "远端存储配置已保存" : "公开配置已保存，应用密码已安全丢弃");
    } catch (error) {
      message.error(error.message || "存储配置保存失败");
    }
  };
  const testStorage = async () => {
    try {
      const values = await storageForm.validateFields();
      if (!isBackendConfigured()) {
        return Modal.info({ title: "本地校验通过", content: `${values.provider === "github" ? "GitHub" : "坚果云 WebDAV"} 字段格式正确。真实连通性测试需要 Serverless 后端。` });
      }
      await workbench.request.post("/api/admin/storage/test", values);
      message.success("存储连接测试成功");
    } catch (error) {
      if (error?.errorFields) return;
      message.error(error.message || "存储连接测试失败");
    }
  };
  const exportBackup = () => {
    const blob = new Blob([store.exportData()], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `workbench-admin-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    message.success("管理数据已导出");
  };
  const importBackup = async (file) => {
    try {
      store.importData(await file.text());
      message.success("管理数据已导入");
    } catch (error) {
      message.error(error.message);
    }
    return false;
  };
  return (
    <div>
      <PageHeader title="系统设置" description="管理站点基础配置、数据备份和存储提供商。" extra={<Space wrap><Button icon={<DownloadOutlined />} onClick={exportBackup}>导出数据</Button><Upload accept="application/json" maxCount={1} showUploadList={false} beforeUpload={importBackup}><Button icon={<UploadOutlined />}>导入数据</Button></Upload><Popconfirm title="确认恢复全部本地演示数据？" onConfirm={() => { store.resetData(); message.success("数据已恢复"); }}><Button icon={<ReloadOutlined />}>恢复默认数据</Button></Popconfirm></Space>} />
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={10}><Card title="基础设置"><Form form={generalForm} layout="vertical" initialValues={store.settings} onFinish={(values) => { store.saveGeneralSettings(values); message.success("基础设置已保存"); }}><Form.Item name="siteName" label="站点名称" rules={[{ required: true }]}><Input /></Form.Item><Form.Item name="defaultGroupId" label="新用户默认分组"><Select options={store.groups.map((item) => ({ value: item.id, label: item.name }))} /></Form.Item><Form.Item name="allowRegistration" label="开放用户注册" valuePropName="checked"><Switch /></Form.Item><Button type="primary" htmlType="submit">保存基础设置</Button></Form></Card></Col>
        <Col xs={24} xl={14}><Card title="存储配置"><Form form={storageForm} layout="vertical" initialValues={{ provider: storage.provider, repository: storage.github.repository, branch: storage.github.branch, githubDataRoot: storage.github.dataRoot, webdavUrl: storage.nutstoreWebdav.url, webdavUsername: storage.nutstoreWebdav.username, webdavPath: storage.nutstoreWebdav.path }} onFinish={saveStorage}><Form.Item name="provider" label="存储提供商"><Select onChange={setProvider} options={storageProviders.map((item) => ({ value: item.key, label: item.label }))} /></Form.Item><Text className="provider-description" type="secondary">{storageProviders.find((item) => item.key === provider)?.description}</Text>{provider === "github" ? <><Form.Item name="repository" label="GitHub 仓库" rules={[{ required: true, pattern: /^[^/]+\/[^/]+$/, message: "格式必须为 owner/repository" }]}><Input /></Form.Item><Form.Item name="branch" label="分支" rules={[{ required: true }]}><Input /></Form.Item><Form.Item name="githubDataRoot" label="数据目录" rules={[{ required: true }]}><Input /></Form.Item></> : <><Form.Item name="webdavUrl" label="WebDAV 地址" rules={[{ required: true, type: "url" }]}><Input /></Form.Item><Form.Item name="webdavUsername" label="坚果云账号" rules={[{ required: true, type: "email" }]}><Input autoComplete="off" /></Form.Item><Form.Item name="webdavPassword" label="应用密码" extra={storage.nutstoreWebdav.credentialConfigured ? "凭据已配置；留空表示保持远端现有凭据。" : "本地模式不会保存此密码。"} rules={storage.nutstoreWebdav.credentialConfigured ? [] : [{ required: true }]}><Input.Password autoComplete="new-password" /></Form.Item><Form.Item name="webdavPath" label="数据目录" rules={[{ required: true, pattern: /^\//, message: "目录必须以 / 开头" }]}><Input /></Form.Item></>}<Space><Button onClick={testStorage}>测试连接</Button><Button type="primary" htmlType="submit">保存存储配置</Button></Space></Form></Card></Col>
      </Row>
      <Card className="security-card" title={<Space><AuditOutlined />运行与安全状态</Space>}><Descriptions column={{ xs: 1, sm: 2 }}><Descriptions.Item label="管理数据">Local Storage</Descriptions.Item><Descriptions.Item label="后台状态">{workbench.status}</Descriptions.Item><Descriptions.Item label="目标存储">{provider}</Descriptions.Item><Descriptions.Item label="本地数据版本">{store.version}</Descriptions.Item></Descriptions><Divider /><Alert type="info" showIcon message="敏感信息不会持久化到浏览器" description="用户密码必须由后端使用 Argon2id 或 bcrypt 哈希，WebDAV 应用密码和 GitHub Token 只能保存在 Serverless 密钥环境。导出的备份同样不包含凭据。" /></Card>
    </div>
  );
}

function EntityModal({ title, open, form, onCancel, onSave, children }) {
  return <Modal title={title} open={open} okText="保存" cancelText="取消" destroyOnClose onCancel={onCancel} onOk={() => form.submit()}><Form form={form} layout="vertical" preserve={false} onFinish={onSave}>{children}</Form></Modal>;
}

function StatusTag({ status }) {
  const labels = { active: ["正常", "success"], disabled: ["已停用", "default"], enabled: ["已启用", "success"] };
  const [label, color] = labels[status] || [status, "default"];
  return <Tag color={color}>{label}</Tag>;
}

function ActionButtons({ onAdd, addText = "新增", onEdit, onToggle, toggleText, onDelete, deleteConfirmTitle = "确认删除这条记录？", hideDelete = false, compact = false }) {
  if (compact) {
    const items = [
      onAdd ? { key: "add", label: addText, icon: <PlusOutlined /> } : null,
      { key: "edit", label: "编辑", icon: <EditOutlined /> },
      onToggle ? { key: "toggle", label: toggleText } : null,
      !hideDelete ? { key: "delete", label: "删除", icon: <DeleteOutlined />, danger: true } : null,
    ].filter(Boolean);
    const handleAction = ({ key }) => {
      if (key === "add") onAdd();
      if (key === "edit") onEdit();
      if (key === "toggle") onToggle();
      if (key === "delete") Modal.confirm({ title: deleteConfirmTitle, okButtonProps: { danger: true }, onOk: onDelete });
    };
    return <Dropdown trigger={["click"]} overlay={<Menu items={items} onClick={handleAction} />}><Button className="compact-action" type="link">操作</Button></Dropdown>;
  }
  return <Space>{onAdd && <Button type="link" icon={<PlusOutlined />} onClick={onAdd}>{addText}</Button>}<Button type="link" icon={<EditOutlined />} onClick={onEdit}>编辑</Button>{onToggle && <Button type="link" onClick={onToggle}>{toggleText}</Button>}{!hideDelete && <Popconfirm title={deleteConfirmTitle} onConfirm={onDelete}><Button type="link" danger icon={<DeleteOutlined />}>删除</Button></Popconfirm>}</Space>;
}
