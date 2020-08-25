/*
 * @Date: 2020-08-19 10:57:26
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-25 11:06:00
 * @FilePath: \react-ts-template\src\app.tsx
//  */

import { hot } from 'react-hot-loader/root';

import React, { FC } from "react";
import { Layout, Menu, Breadcrumb } from "antd";

import ApiList from "@/components/ApiList";
import ApiForm from "@/components/ApiForm";
import Counter from '@/components/Counter'

const { Header, Content, Footer, Sider } = Layout;


class App extends React.Component  {
  render(){
    return (
      <div className="App">
        <Layout>
          <Header className="header">
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
              <Menu.Item key="1">api mock</Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: "0 50px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
            </Breadcrumb>
            <Layout
              className="site-layout-background"
              style={{ padding: "24px 0" }}
            >
              <Sider className="site-layout-background" width={200}>
                <ApiList />
              </Sider>
              <Content style={{ padding: "0 24px", minHeight: 280 }}>
                <ApiForm />
              </Content>
            </Layout>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©2018 Created by Ant UED
            <Counter />
          </Footer>
        </Layout>
      </div>
    );
  }
};

export default hot(App);
