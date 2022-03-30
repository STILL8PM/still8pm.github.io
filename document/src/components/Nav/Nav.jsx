import React from 'react';
import { Menu } from 'antd';
import { HomeOutlined, UserOutlined, FolderOutlined } from '@ant-design/icons';
import './Nav.css'
import Logo from '../../logo.png';

export default class Nav extends React.Component {
  state = {
    url: 'mail',
  };

  handleClick = e => {
    console.log('click ', e);
    this.setState({ url: e.key });
  };
  render() {
    const{url}=this.state
    return (
      <div className='header'>
        <img className='logo' src={Logo} alt="logo" />
        <Menu onClick={this.handleClick} mode="horizontal" selectedKeys={[url]} >
          <Menu.Item key="home" icon={<HomeOutlined />}>
            首页
          </Menu.Item>
          <Menu.Item key="vued" icon={<FolderOutlined />}>
            Vue文档
          </Menu.Item>
          <Menu.Item key="reactd" icon={<FolderOutlined />}>
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
