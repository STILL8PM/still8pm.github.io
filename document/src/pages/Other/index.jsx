import React from "react";
import { Layout, Tree } from "antd";
import "./index.css";
import axios from "axios";

const { Sider, Content } = Layout;
const { DirectoryTree } = Tree;
export default function index() {
  const treeData = [
    {
      title: "文档类型1",
      key: "0-0",
      children: [
        {
          title: "leaf 0-0",
          key: "0-0-0",
          isLeaf: true,
        },
        {
          title: "leaf 0-1",
          key: "0-0-1",
          isLeaf: true,
        },
      ],
    },
    {
      title: "文档类型2",
      key: "0-1",
      children: [
        {
          title: "leaf 1-0",
          key: "0-1-0",
          isLeaf: true,
        },
        {
          title: "leaf 1-1",
          key: "0-1-1",
          isLeaf: true,
        },
      ],
    },
  ];

  const onSelect = (keys, info) => {
    console.log("Trigger Select", keys, info);
  };

  const onExpand = (keys, info) => {
    console.log("Trigger Expand", keys, info);
  };



  return (
    <div>
      <Layout>
        <Sider className="sider">
          <DirectoryTree
            multiple
            defaultExpandAll
            onSelect={onSelect}
            onExpand={onExpand}
            treeData={treeData}
          />
        </Sider>
        <Layout>
          <Content>Content</Content>
        </Layout>
      </Layout>
    </div>
  );
}
