import React, { Component } from "react";
import api from "@/api/index";
import { Menu, Tag, Popconfirm, Button } from "antd";

export default class ApiList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiList: [],
    };
  }

  componentDidMount() {
    this.getAllMockApi();
  }

  async getAllMockApi() {
    const apiList = await api.getAllMockApi();
    this.setState({ apiList });
  }

  async handleDelete(url: string, e: any) {
    e.preventDefault();
    console.log(url, e);
    const res = await api.deleteMockApi({ url });
    console.log(res);
    this.setState({ apiList :res});
  }

  render() {
    return (
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        style={{ height: "100%" }}
      >
        {this.state.apiList.map((el) => {
          return (
            <Menu.Item key={el.key}>
              <Tag color="#2db7f5">{el.methods}</Tag>
              <Tag closable onClose={(e) => this.handleDelete(el.url, e)}>
                {el.url}
              </Tag>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  }
}
