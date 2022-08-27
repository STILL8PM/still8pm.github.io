import React from "react";
import { Layout } from "antd";
import "./index.css";
const { Content } = Layout;
const Vued = () => {
    return (
      <Layout>
        <Content>
          <div>
            <iframe
              src="https://cn.vuejs.org/v2/guide/"
              height="780"
              width="100%"
              frameborder="0"
              scrolling="0"
              title="vue"
            ></iframe>
          </div>
        </Content>
      </Layout>
    );
};
export default Vued;