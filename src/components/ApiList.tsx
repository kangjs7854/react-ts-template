import React, { Component } from "react";
import {Badge, Menu, Tag, Empty, Modal} from "antd";
import { observer, inject } from "mobx-react";
import './index.scss'
import { DeleteOutlined } from '@ant-design/icons';

@inject("apiStore")
@observer
export default class ApiList extends Component<{ apiStore: IApiStore }> {

  componentDidMount() {
    this.props.apiStore.getAllMockApi();
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
                  <span style={{
                    width:"90px",
                    display:"inline-block"
                  }}>
                    {el.apiName}
                  </span>
                  <DeleteOutlined onClick={(e)=>{
                    e.preventDefault()
                    this.props.apiStore.deleteMockApi(el.apiName);
                  }} />
                {/*<Tag*/}
                {/*  closable*/}
                {/*  onClose={(e: any) => {*/}
                {/*    Modal.confirm({*/}
                {/*      title:"确定删除?",*/}
                {/*      onOk:()=>{*/}
                {/*        this.handleDelete(el.apiName, e)*/}
                {/*      }})*/}

                {/*  }}*/}
                {/*>*/}
                {/*  {el.apiName}*/}
                {/*</Tag>*/}
              </Menu.Item>
            );
          }):<Empty description='暂无数据' />
        }
      </Menu>
    );
  }
}
