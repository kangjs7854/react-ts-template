import React from "react";
import { observer, inject } from "mobx-react";
import { Input, Button, Select, Row, Col, Divider, notification } from "antd";
import SchemaTable from "@/components/SchemaTable";
import ApiStore from '@/store/api'
import {render} from "react-dom";
const { Option } = Select;

interface IProps{
  apiStore:ApiStore
}

@inject("apiStore")
@observer
class FormSizeDemo extends React.Component<IProps> {
  handleSubmit = async () => {
    const { apiStore } = this.props;
    await apiStore.getMockApi();
  };

  handleCopy = () => {
    const activeCodeSpan = document.getElementById("mock-url") as HTMLElement;
    const range = document.createRange();
    window.getSelection()?.removeAllRanges(); //清楚页面中已有的selection
    range.selectNode(activeCodeSpan);
    window.getSelection()?.addRange(range);
    const tag = document.execCommand("Copy");
    if (tag) {
      notification.success({ message: "复制成功" });
    } else {
      // notification.fail("复制失败");
    }
    window.getSelection()?.removeAllRanges();
  };

  render() {
    const { apiStore } = this.props;
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
        <Divider orientation="left">create api</Divider>
        <SchemaTable />
        <Divider orientation="left">mock api</Divider>

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
