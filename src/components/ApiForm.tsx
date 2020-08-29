import React from "react";
import { observer, inject } from "mobx-react";
import { Input, Button, Select, Row, Col, Divider, notification } from "antd";
import SchemaTable from "@/components/SchemaTable";
import ApiStore from '@/store/api'
import "./index.scss";
import { CopyOutlined } from '@ant-design/icons';

import {render} from "react-dom";
const { Option } = Select;

interface IProps{
  apiStore:ApiStore
}

@inject("apiStore")
@observer
class FormSizeDemo extends React.Component<IProps> {

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
        <div className="row">
            <span>url地址</span>
            <Input
                className="input-wrap"
                placeholder="api名称"
                value={apiStore.defaultApi.url}
                onChange={(e) =>
                    apiStore.updateDefaultApi({ url: e.target.value })
                }
            />
            {apiStore.defaultApi.url && (
                <>
                    <span id="mock-url">{apiStore.baseUrl+apiStore.defaultApi.url}</span>
                    <Button className='copy-btn' type="primary" shape="round" onClick={this.handleCopy} icon={<CopyOutlined />}  >复制</Button>
                </>
            )}
        </div>
        <Divider orientation="left">定义数据结构</Divider>
        <SchemaTable />

        {apiStore.defaultApi.response.data ? (
          <>
            <Divider orientation="left">响应数据：</Divider>

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
