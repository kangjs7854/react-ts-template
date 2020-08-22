import React, { Component } from "react";
import api from "@/api/index";
import { Menu, Tag, Popconfirm, Button } from "antd";
import { observer, inject } from "mobx-react";

@inject("apiListStore")
@observer
export default class ApiList extends Component {
  constructor(props) {
    super(props);
  
  }

  componentDidMount() {
    this.props.apiListStore.getAllMockApi()
  }


  async handleDelete(url: string, e: any) {
    e.preventDefault();
    this.props.apiListStore.deleteMockApi(url)
  }

  render() {
    const {apiList} = this.props.apiListStore
    return (
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        style={{ height: "100%" }}
      >
        {Array.isArray(apiList) && apiList.map((el) => {
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
