import React from "react";
import { Link, useLocation } from "react-router-dom";
import Darkreader from "react-darkreader";

import { Menu } from "antd";
import {
  AppstoreOutlined,
  HomeOutlined,
  UserOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import "./Nav.css";
import Logo from "../../logo.png";

/**
 * 顶部导航组件。
 *
 * 导航选中项直接从路由地址计算，而不是单独维护一份可能过期的状态。
 * 这样通过浏览器前进后退、移动端刷新或外部链接进入页面时，菜单仍然
 * 能准确反映当前页面；HashRouter 会负责处理 GitHub Pages 的静态路由。
 */
export default function Nav() {
  const location = useLocation();
  const current = location.pathname === "/" ? "home" : location.pathname.slice(1);
  const items = [
    {
      label: <Link to="/">首页</Link>,
      key: "home",
      icon: <HomeOutlined />,
    },
    {
      label: <Link to="/workbench">之一的工作台</Link>,
      key: "workbench",
      icon: <AppstoreOutlined />,
    },
    {
      label: <Link to="/vued">Vue文档</Link>,
      key: "vued",
      icon: <FolderOutlined />,
    },
    {
      label: <Link to="/reactd">React文档</Link>,
      key: "reactd",
      icon: <FolderOutlined />,
    },
    {
      label: <Link to="/other">其他文档</Link>,
      key: "other",
      icon: <FolderOutlined />,
    },
    {
      label: <Link to="/about">个人信息</Link>,
      key: "about",
      icon: <UserOutlined />,
    },
  ];

  return (
    <div className="header">
      <div className="imgdiv">
        <img className="logo" src={Logo} alt="之一的工作台" />
      </div>
      <Darkreader />
      <Menu className="menu" selectedKeys={[current]} mode="horizontal" items={items} />
    </div>
  );
}
