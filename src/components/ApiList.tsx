import React, { Component } from "react";
import {Badge, Menu, Tag,Empty } from "antd";
import { observer, inject } from "mobx-react";
import ApiStore from "@/store/api";

@inject("apiStore")
@observer
export default class ApiList extends Component<{ apiStore: ApiStore }> {

  componentDidMount() {
    this.props.apiStore.getAllMockApi();
  }

  async handleDelete(apiName: string, e: any) {
    e.preventDefault();
    this.props.apiStore.deleteMockApi(apiName);
  }

  handleChooseApi(apiName: string) {
    this.props.apiStore.handleChooseApi(apiName);
  }

  render() {

    return (
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        style={{ height: "100%" }}
      >
        <Badge className="badge" count={this.props.apiStore.apiList?.length} title="当前api个数">
          <a href="#" className="head-example" />
        </Badge>
        {this.props.apiStore.apiList.length?
            this.props.apiStore.apiList.map((el, index: number) => {
            return (
              <Menu.Item
                key={index}
                onClick={() => this.handleChooseApi(el.apiName)}
              >
                <Tag color="#2db7f5">{el.method}</Tag>
                <Tag
                  closable
                  onClose={(e: any) => this.handleDelete(el.apiName, e)}
                >
                  {el.apiName}
                </Tag>
              </Menu.Item>
            );
          }):<Empty description='暂无数据' />
        }
      </Menu>
    );
  }
}
