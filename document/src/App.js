import React, { Component } from 'react'
import { Layout, Empty } from 'antd'
import Nav from './components/Nav/Nav.jsx'
import './App.css'
const { Header, Footer, Content } = Layout;

export default class App extends Component {
  render() {
    return (
      <Layout>
        <Header className='header'><Nav></Nav></Header>
        <Content className='content'><Empty /></Content>
        <Footer className='footer'>Footer</Footer>
      </Layout>
    )
  }
}
