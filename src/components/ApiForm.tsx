import React from "react";
import { observer, inject } from "mobx-react";
import {Input, Button, Select, Row, Col, Divider, notification, Tooltip} from "antd";
import SchemaTable from "@/components/SchemaTable";
import "./index.scss";
import { CopyOutlined } from '@ant-design/icons';
import ReactJson from "react-json-view";


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

  handleDeleteJson = (data:any)=>{
      console.log(data)
  }

  handleEditJson = (data:any) => {
      console.log(data)

  }

  render() {
    const { apiStore } = this.props;
    return (
      <>
        <div className="row">
            <span>api名称</span>
            <Input
                className="input-wrap"
                placeholder="api名称："
                value={apiStore.apiName}
                onChange={(e) =>
                    apiStore.updateApiName(e.target.value)
                }

            />
            {apiStore.apiName && (
                <>
                    <Tooltip title="默认为post请求">
                        <span id="mock-url">{apiStore.baseUrl+apiStore.apiName}</span>
                    </Tooltip>
                    <Button className='copy-btn' type="primary" shape="round" onClick={this.handleCopy} icon={<CopyOutlined />}  >复制</Button>
                </>
            )}
        </div>
        <Divider orientation="left">定义数据结构</Divider>
        <SchemaTable />

        {apiStore.responseJson?.data? (
          <>
              <Divider orientation="left">响应数据：</Divider>
              <ReactJson src={apiStore.responseJson}
                         theme="google"
                         enableClipboard={()=>notification.success({message:"复制成功"})}
                         onDelete={this.handleDeleteJson}
                         onEdit={this.handleEditJson}
              />
          </>
        ) : null}
      </>
    );
  }
}

export default FormSizeDemo;
