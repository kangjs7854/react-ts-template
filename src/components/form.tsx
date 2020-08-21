import React, { useState, useRef } from "react";
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

import SchemaTable from "@/components/SchmeTable";
import Http from "@/utils/http";

const http = new Http();

const { TextArea } = Input;
const { Option } = Select;

const FormSizeDemo: React.FC = () => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("post");
  const [mockUrl, setMockUrl] = useState("");
  const childRef = useRef();

  const [response, setResponse] = useState("");

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
    const requestUrl = `http://localhost:3000/api/mock/${url}`;
    const res = await http.post(requestUrl, params);
    const req = {
      params,
      url: requestUrl,
    };
    console.log({ req, res });
    setMockUrl(requestUrl);
    setResponse(res);
    notification.warning({ message: "保存成功" });
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
