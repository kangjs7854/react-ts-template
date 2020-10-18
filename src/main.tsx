import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";

import { Layout, Tabs, Table, Modal, Form, Select, Input, Button } from "antd";
import { FormOutlined, CloseOutlined } from "@ant-design/icons";

const { Header, Content, Footer } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;


import "./style.less";
function App() {
  return (
    <Layout className="layout">
      <Header>
        <p className="title">可视化配置数据接口</p>
      </Header>
      <Content style={{ padding: "50px" }}>
        <div className="site-layout-content">
          <ApiList></ApiList>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>demo 2020 Created by kang</Footer>
    </Layout>
  );
}

function ApiList() {
  const apiList = [
    {
      apiName: "user",
      method: "get",
    },
    {
      apiName: "login",
      method: "post",
    },
  ];
  return (
    <Tabs defaultActiveKey="1">
      {apiList.map((el, index) => (
        <TabPane tab={el.apiName} key={index}>
          method：{el.method}
          <ApiTable />
        </TabPane>
      ))}
    </Tabs>
  );
}

type FiledType = {
  id?:string,
  key?:string,
  type?:string,
  value?:string,
  desc?:string
}

function ApiTable() {
  const [visible, setVisible] = useState(false);
  const [choosedField,setChoosedField] = useState<FiledType>({})
  const [dataSource ,setDataSource] = useState<FiledType[]>([
    {
      id:"aa01",
      key: "name",
      type: "String",
      value: "张三",
      desc: "用户姓名",
    }
  ])
  const [form] = Form.useForm();

  const columns: any = [
    {
      title: "字段名称",
      dataIndex: "key",
      key: "name",
    },
    {
      title: "字段类型",
      dataIndex: "type",
      key: "age",
    },
    {
      title: "字段内容",
      dataIndex: "value",
      key: "address",
    },
    {
      title: "字段描述",
      dataIndex: "desc",
      key: "address",
    },
    {
      title: "操作",
      render(el:any) {

        return (
          <div>
            <FormOutlined
              style={{ marginRight: "10px" }}
              onClick={() =>{
                setChoosedField(el)
                setVisible(true)
              }}
            />
            <CloseOutlined />
          </div>
        );
      },
    },
  ];

  useEffect(()=>{
    form.setFieldsValue(choosedField)
  },[choosedField.key])

  function handleEditForm(values:any){
    const {id} = choosedField
    const newDataSource = dataSource.map(el=>el.id === id && (el = values))
    setDataSource(newDataSource)
    setVisible(false)
  }

  function handleRest(){
    form.resetFields()
  }

  function handleFillForm(){
    form.setFieldsValue({
      key:"名称",
      type:"String",
      value:"李四",
      desc:"用户名称"
    })
    
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} />
      <Modal visible={visible} onCancel={() => setVisible(false)}>
        <Form form={form} name="control-hooks" onFinish={handleEditForm}>
          <Form.Item name="key" label="字段名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="字段类型" rules={[{ required: true }]}>
            <Select
              placeholder="选择数据类型"
              allowClear
            >
              <Option value="String">String</Option>
              <Option value="Number">Number</Option>
              <Option value="Boolean">Boolean</Option>
              <Option value="Object">Object</Option>
              <Option value="Array">Array</Option>
              <Option value="Date">Date</Option>
            </Select>
          </Form.Item>
          <Form.Item name="value" label="字段内容" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="desc" label="字段描述" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button htmlType="button" onClick={handleRest}>重置</Button>
            <Button type="link" htmlType="button" onClick={handleFillForm}> 
              自动填充
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

ReactDom.render(<App />, document.getElementById("root"));
