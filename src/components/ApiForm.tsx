import React from "react";
import { observer, inject } from "mobx-react";
import {Input, Button, Select, Row, Col, Divider, notification, Tooltip, Modal} from "antd";
import SchemaTable from "@/components/SchemaTable";
import "./index.scss";
import { CopyOutlined } from '@ant-design/icons';
import ReactJson from "react-json-view";
import api from "@/api";


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


  handleEditJson = (data:any) => {
      console.log(data)
      const editedIndex = data.namespace[1]
      const updatedList = data.updated_src.data
      const editedItem = updatedList[editedIndex]
      console.log(editedItem)
      const isDelete = data.name == '_id'
      const isDeleteKey = data
      if(isDelete){
          Modal.confirm({
              title:"删除key为id时，数据库会删除整个数据",
              onOk:()=>{
                  const deleteId = data.existing_value
                  this.props.apiStore.handleMockApi(deleteId)
              }
          })
          return
      }
      this.props.apiStore.updateEditedJsonData(editedItem)
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
                         onDelete={this.handleEditJson}
                         onEdit={this.handleEditJson}
              />
          </>
        ) : null}
      </>
    );
  }
}

export default FormSizeDemo;
