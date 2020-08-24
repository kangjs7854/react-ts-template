import React, { useState, useRef, useContext } from "react";
import { MobXProviderContext } from "mobx-react";
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Divider,
  notification,
} from "antd";
import { observer, inject } from "mobx-react";

import SchemaTable from "@/components/SchemaTable";

import api from "@/api/index";

const { Option } = Select;

@inject("apiStore")
@observer
class FormSizeDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mockUrl: "",
      response: {},
    };
  }

  handleSubmit = async () => {
    const { apiStore } = this.props;
    await apiStore.getMockApi();
    apiStore.getAllMockApi();
  };

  handleCopy = () => {
    const activeCodeSapn = document.getElementById("mock-url");
    const range = document.createRange();
    window.getSelection().removeAllRanges(); //清楚页面中已有的selection
    range.selectNode(activeCodeSapn);
    window.getSelection().addRange(range);
    const tag = document.execCommand("Copy");

    if (tag) {
      notification.success({ message: "复制成功" });
    } else {
      // notification.fail("复制失败");
    }
    window.getSelection().removeAllRanges();
  };

  render() {
    const { apiStore } = this.props;
    const { mockUrl, response } = this.state;
    return (
      <>
        <Row>
          <Col>
            <Select
              defaultValue={apiStore.defaultApi.methods}
              style={{ width: 120 }}
              onChange={(e) => apiStore.updateDefaultApi({ methods: e })}
            >
              <Option value="post">post</Option>
              <Option value="get">get</Option>
            </Select>
          </Col>
          <Col>
            <Input
              placeholder="请输入api的url地址名称"
              value={apiStore.defaultApi.url}
              onChange={(e) =>
                apiStore.updateDefaultApi({ url: e.target.value })
              }
            />
          </Col>
        </Row>
        <Divider orientation="left">Define Data</Divider>
        <SchemaTable />

        <Button type="primary" onClick={this.handleSubmit}>
          mock
        </Button>

        {apiStore.defaultApi.url ? (
          <>
            <Divider orientation="left">mock地址：</Divider>
            <Row>
              <Col flex={2}>
                <h3 id="mock-url">{sessionStorage.getItem("url")}</h3>
              </Col>
              <Col>
                <Button onClick={this.handleCopy}>点击复制</Button>
              </Col>
            </Row>
            <h3 style={{ color: "#1890ff" }}>response：</h3>
            <pre className="language-bash">
              {JSON.stringify(apiStore.defaultApi.response, null, 2)}
            </pre>
          </>
        ) : null}
      </>
    );
  }
}

export default FormSizeDemo;
