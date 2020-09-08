import React from "react";
import { observer, inject } from "mobx-react";
import { Input, Button, Select, Row, Col, Divider, notification } from "antd";
import SchemaTable from "@/components/SchemaTable";
import "./index.scss";
import { CopyOutlined } from '@ant-design/icons';


@inject("apiStore")
@observer
class FormSizeDemo extends React.Component  <{ apiStore:IApiStore }>{

  handleCopy = () => {
    const activeCodeSpan = document.getElementById("mock-url") as HTMLElement;
    const range = document.createRange();
    window.getSelection()?.removeAllRanges(); //清楚页面中已有的selection
    range.selectNode(activeCodeSpan);
    window.getSelection()?.addRange(range);
    const tag = document.execCommand("Copy");
    tag && notification.success({ message: "复制成功" });
    window.getSelection()?.removeAllRanges();
  };

  render() {
    const { apiStore } = this.props;
    return (
      <>
        <div className="row">
            <span>url地址</span>
            <Input
                className="input-wrap"
                placeholder="api名称"
                value={apiStore.apiName}
                onChange={(e) =>
                    apiStore.updateApiName(e.target.value)
                }
            />
            {apiStore.apiName && (
                <>
                    <span id="mock-url">{apiStore.baseUrl+apiStore.apiName}</span>
                    <Button className='copy-btn' type="primary" shape="round" onClick={this.handleCopy} icon={<CopyOutlined />}  >复制</Button>
                </>
            )}
        </div>
        <Divider orientation="left">定义数据结构</Divider>
        <SchemaTable />

        {apiStore.responseJson?.data? (
          <>
              <Divider orientation="left">响应数据：</Divider>
            <pre className="language-bash">
              {JSON.stringify(apiStore.responseJson, null, 2)}
            </pre>
          </>
        ) : null}
      </>
    );
  }
}

export default FormSizeDemo;
