import React, { Component } from "react";
import { Menu, Tag } from "antd";
import { observer, inject } from "mobx-react";
import ApiStore from "@/store/api";

@inject("apiStore")
@observer
export default class ApiList extends Component<{ apiStore: ApiStore }> {
  componentDidMount() {
    this.props.apiStore.getAllMockApi();
  }

  async handleDelete(url: string, e: any) {
    e.preventDefault();
    this.props.apiStore.deleteMockApi(url);
  }

  handleChooseApi(url: string) {
    this.props.apiStore.handleChooseApi(url);
  }

  render() {
    const { apiList } = this.props.apiStore;
    return (
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        style={{ height: "100%" }}
      >
        {Array.isArray(apiList) &&
          apiList.map((el, index: number) => {
            return (
              <Menu.Item
                key={index}
                onClick={() => this.handleChooseApi(el.url)}
              >
                <Tag color="#2db7f5">{el.methods}</Tag>
                <Tag
                  closable
                  onClose={(e: any) => this.handleDelete(el.url, e)}
                >
                  {el.url}
                </Tag>
              </Menu.Item>
            );
          })}
      </Menu>
    );
  }
}
