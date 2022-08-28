import React from "react";
import { Link } from "react-router-dom";
import Darkreader from "react-darkreader";

import { Menu } from "antd";
import { HomeOutlined, UserOutlined, FolderOutlined } from "@ant-design/icons";
import "./Nav.css";
import Logo from "../../logo.png";

export default class Nav extends React.Component {
  state = {
    current: "home",
    items: [
      {
        label: <Link to="/">首页</Link>,
        key: "home",
        icon: <HomeOutlined />,
      },
      {
        label: <Link to="vued">Vue文档</Link>,
        key: "vued",
        icon: <FolderOutlined />,
      },
      {
        label: <Link to="reactd">React文档</Link>,
        key: "reactd",
        icon: <FolderOutlined />,
      },
      {
        label: <Link to="other">其他文档</Link>,
        key: "other",
        icon: <FolderOutlined />,
      },
      {
        label: <Link to="about">个人信息</Link>,
        key: "about",
        icon: <UserOutlined />,
      },
    ],
  };


  onClick = (e) => {
    console.log("click ", e);
    this.setState({ current: e.key });
  };

  render() {
    const { current, items } = this.state;
    return (
      <div className="header">
        <div className="imgdiv">
          <img className="logo" src={Logo} alt="logo" />
        </div>
        <Darkreader />
        <Menu
          className="menu"
          onClick={(e) => {
            this.onClick(e);
          }}
          selectedKeys={[...current]}
          mode="horizontal"
          items={items}
        />
      </div>
    );
  }
}
