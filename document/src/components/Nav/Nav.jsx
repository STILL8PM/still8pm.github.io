import React from "react";
import { Link } from "react-router-dom";
import Darkreader from "react-darkreader";

import { Menu } from "antd";
import { HomeOutlined, UserOutlined, FolderOutlined } from "@ant-design/icons";
import "./Nav.css";
import Logo from "../../logo.png";

export default class Nav extends React.Component {
  render() {
    return (
      <div className="header">
        <div className="imgdiv">
          <img className="logo" src={Logo} alt="logo" />
        </div>
        <Darkreader />
        <Menu mode="horizontal">
          <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link to="/">首页</Link>
          </Menu.Item>
          <Menu.Item key="vued" icon={<FolderOutlined />}>
            <Link to="vued">Vue文档</Link>
          </Menu.Item>
          <Menu.Item key="reactd" icon={<FolderOutlined />}>
            <Link to="reactd">React文档</Link>
          </Menu.Item>
          <Menu.Item key="other" icon={<FolderOutlined />}>
            <Link to="other">其他文档</Link>
          </Menu.Item>
          <Menu.Item key="about" icon={<UserOutlined />}>
            <Link to="about">个人信息</Link>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}
