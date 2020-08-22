import React, { useState, useRef,useContext} from "react";
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

import SchemaTable from "@/components/SchemaTable";

import api from '@/api/index'

const { Option } = Select;

const FormSizeDemo: React.FC = () => {
  //hook结合mobx
  const {apiListStore} = useContext(MobXProviderContext)
  
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("post");
  const [mockUrl, setMockUrl] = useState("");
  const [response, setResponse] = useState("");

  const childRef = useRef();

  const handleSubmit = async () => {
    console.log(url, method);
    const Schema = {};
    const params = {};
    const {dataSource,uniqueKey} = childRef.current.getDataSource();
    dataSource.forEach((el) => {
      Schema[el.schemaKey] = el.schemaType;
      params[el.schemaKey] = el.schemaValue;
    });
    Object.assign(params, { Schema },{uniqueKey});


    if (!url) return notification.warning({ message: "url不能为空" });
    try{
      const res = await api.getMockApi(url, params);
      setMockUrl(`http://localhost:3000/api/mock/${url}`);
      setResponse(res);
      apiListStore.getAllMockApi()
      notification.warning({ message: "保存成功" });
    }catch(error){
      console.log(error);
    }
   
  };
  
  const handleCopy = () => {
    const activeCodeSapn = document.getElementById("mock-url");
    const range = document.createRange();
    window.getSelection().removeAllRanges(); //清楚页面中已有的selection
    range.selectNode(activeCodeSapn);
    window.getSelection().addRange(range);
    const tag = document.execCommand("Copy");
    if (tag) {
      notification.success({message:"复制成功"});
    } else {
      // notification.fail("复制失败");
    }
    window.getSelection().removeAllRanges();
  };

  return (
    <>
      <Row>
        <Col>
          <Select
            defaultValue={method}
            style={{ width: 120 }}
            onChange={(e) => setMethod(e)}
          >
            <Option value="post">post</Option>
            <Option value="get">get</Option>
          </Select>
        </Col>
        <Col>
          <Input
            placeholder="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </Col>
      </Row>
      <Divider orientation="left">Define Data</Divider>

      <SchemaTable ref={childRef} />

      <Button type="primary" onClick={handleSubmit}>
        保存
      </Button>

      {mockUrl ? (
        <>
          <Divider orientation="left">mock地址：</Divider>
          <Row>
            <Col flex={2}>
              <h3 id="mock-url">{mockUrl}</h3>
            </Col>
            <Col>
              <Button  onClick={handleCopy}>点击复制</Button>
            </Col>
          </Row>
          <h3 style={{ color: "#1890ff" }}>response：</h3>
          <pre className="language-bash">
            {JSON.stringify(response, null, 2)}
          </pre>
        </>
      ) : null}
    </>
  );
};

export default FormSizeDemo;
