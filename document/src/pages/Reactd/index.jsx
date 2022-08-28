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
                        src="https://react.html.cn/docs/getting-started.html"
                        height="780"
                        width="100%"
                        
                        scrolling="0"
                        title="vue"
                    ></iframe>
                </div>
            </Content>
        </Layout>
    );
};
export default Vued;
