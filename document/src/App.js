import React from 'react';
import { Menu } from 'antd';
import { HomeOutlined, UserOutlined, FolderOutlined } from '@ant-design/icons';
import './App.css'
import Logo from './logo.png';

export default class App extends React.Component {

  render() {
    return (
      <div className='header'>
        <img className='logo' src={Logo} alt="logo" />
        <Menu mode="horizontal">
          <Menu.Item key="mail" icon={<HomeOutlined />}>
            首页
          </Menu.Item>
          <Menu.Item key="Vue" icon={<FolderOutlined />}>
            Vue文档
          </Menu.Item>
          <Menu.Item key="React" icon={<FolderOutlined />}>
            React文档
          </Menu.Item>
          <Menu.Item key="other" icon={<FolderOutlined />}>
            其他文档
          </Menu.Item>
          <Menu.Item key="about" icon={<UserOutlined />}>
            个人信息
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}