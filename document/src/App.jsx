import React, { Component } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";

import Home from "./pages/Home";
import Vued from "./pages/Vued";
import Reactd from "./pages/Reactd";
import Other from "./pages/Other";
import About from "./pages/About";
import Workbench from "./pages/Workbench";
import { WorkbenchProvider } from "./工作台/工作台上下文";

import { Layout } from "antd";
import Nav from "./components/Nav/Nav.jsx";
import "./App.css";
const { Header, Footer, Content } = Layout;

export default class App extends Component {
  render() {
    return (
      <HashRouter>
        <WorkbenchProvider>
          <Layout>
            <Header className="header">
              <Nav />
            </Header>
            <Content className="content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="workbench" element={<Workbench />} />
                <Route path="vued" element={<Vued />} />
                <Route path="reactd" element={<Reactd />} />
                <Route path="other" element={<Other />} />
                <Route path="about" element={<About />} />
              </Routes>
            </Content>
            <Footer className="footer">
              MIT Licensed | Copyright © 2022 still8pm.github.io
            </Footer>
          </Layout>
        </WorkbenchProvider>
      </HashRouter>
    );
  }
}
