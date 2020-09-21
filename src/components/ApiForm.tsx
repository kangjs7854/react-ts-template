import React from "react";
import { observer, inject } from "mobx-react";
import {Input, Button, Select, Row, Col, Divider, notification, Tooltip, Modal} from "antd";
import SchemaTable from "@/components/SchemaTable";
import { CopyOutlined } from '@ant-design/icons';
import ReactJson from "react-json-view";

import "./index.scss";

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
      //编辑字段的数据对象所属位置下标
      const editedIndex = data.namespace[1]
      const updatedList = data.updated_src.data
      //编辑完成后，该字段所在的数据对象
      const editedItem = updatedList[editedIndex]
      console.log("修改完的数据",editedItem)
      //删除的字段名为id，即删除整条数据
      const isDelete = data.name == '_id'
      //new_value 字段为空，则为删除某个字段
      const isDeleteKey = data.new_value ? false : true
      if(isDelete){
          Modal.confirm({
              title:"编辑字段为id时，数据库会删除整个数据，是否继续该操作",
              onOk:()=>{
                  const deleteId = data.existing_value
                  this.props.apiStore.handleMockApi(deleteId)
              }
          })
          return
      }
      if(isDeleteKey){
          let deleteKey = ''
          if(data.namespace[2]){
              deleteKey = `${data.namespace[2]}.${data.name}`
          }else{
              deleteKey = `${data.name}`
          }

        this.props.apiStore.updateDeletedKeyValue(deleteKey)
      }else{//不是删除字段时，注意把之前存储到mobx删除的键值对清除，否则会影响到修改json数据
          this.props.apiStore.updateDeletedKeyValue({})
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
                className="input-wrap  my-first-step"
                placeholder="api名称："
                value={apiStore.apiName}
                onChange={(e) =>
                    apiStore.updateApiName(e.target.value)
                }

            />

                <div className="my-five-step">
                    {apiStore.apiName && ( <Tooltip title="默认为post请求">
                        <span id="mock-url">{apiStore.baseUrl+apiStore.apiName}</span>
                    </Tooltip>
                    )}
                    <Button className='copy-btn' type="primary" shape="round" onClick={this.handleCopy} icon={<CopyOutlined />}  >复制</Button>
                </div>

        </div>
        <Divider orientation="left">定义数据结构</Divider>
        <SchemaTable />


          <div className='my-four-step'>
              <Divider orientation="left">响应数据：</Divider>
              <ReactJson src={apiStore.responseJson}
                         theme="google"
                         enableClipboard={()=>notification.success({message:"复制成功"})}
                         onDelete={this.handleEditJson}
                         onEdit={this.handleEditJson}
              />
          </div>

      </>
    );
  }
}

export default FormSizeDemo;
