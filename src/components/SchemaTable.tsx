import "./table.scss";
import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Table,
  Input,
  Button,
  Popconfirm,
  Form,
  Select,
  Row,
  Col,
  Tag,
  notification,
  Dropdown,
  Badge,
  Space,
} from "antd";

import { observer, inject } from "mobx-react";

const { Option } = Select;

const EditableContext = React.createContext<any>("");

interface Item {
  key: string;
  schemaType: string;
  schemaKey: string;
  schemaValue: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: string;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLDivElement>();

  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: dataIndex != "schemaValue",
            message: `${title} is required.`,
          },
        ]}
      >
        {dataIndex == "schemaType" ? (
          <Select
            defaultValue="lucy"
            style={{ width: 120 }}
            onChange={save}
            defaultOpen="true"
          >
            <Option value="String">String</Option>
            <Option value="Number">Number</Option>
            <Option value="Object">Object</Option>
            <Option value="Boolean">Boolean</Option>
            <Option value="Date">Date</Option>
            <Option value="Array">Array</Option>
          </Select>
        ) : (
          <Input
            ref={inputRef}
            onPressEnter={save}
            onBlur={save}
            placeholder="请输入"
          />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

@inject("apiStore")
@observer
class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uniqueKey: "name",
    };
  }

  private defaultApi = this.props.apiStore.defaultApi;

  private columns = [
    {
      title: "schemaKey",
      dataIndex: "schemaKey",
      width: "20%",
      editable: true,
      render: (text: string, record: Item) => {
        return this.defaultApi.uniqueKey == record.schemaKey ? (
          <Tag color="magenta">{text}</Tag>
        ) : (
          <p>{text}</p>
        );
      },
    },
    {
      title: "schemaType",
      dataIndex: "schemaType",
      width: "30%",
      editable: true,
    },
    {
      title: "schemaValue",
      dataIndex: "schemaValue",
      width: "30%",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (text: string, record: Item) =>
        this.defaultApi.dataSource.length >= 1 ? (
          <Row align="middle">
            <Col>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(record.key)}
              >
                <a>Delete</a>
              </Popconfirm>
            </Col>
            <Col push="6">
              <Button onClick={() => this.handleSetUnique(record.schemaKey)}>
                setUniqueKey
              </Button>
            </Col>
          </Row>
        ) : null,
    },
  ];

  private components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  private columnsNode = this.columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: this.handleSave,
      }),
    };
  });

  handleSetUnique = (e) => {
    const { apiStore } = this.props;
    apiStore.updateDefaultApi({
      uniqueKey: e,
    });
    this.setState({
      uniqueKey: e,
    });
    notification.success({ message: "设置" + e + "为标识的key成功" });
  };

  handleDelete = (key: string) => {
    const { apiStore } = this.props;
    apiStore.updateDefaultApi({
      dataSource: apiStore.defaultApi.dataSource.filter(
        (item) => item.key !== key
      ),
    });
  };

  handleAdd = () => {
    const { apiStore } = this.props;
    const newData = {
      key: apiStore.defaultApi.dataSource.length + "",
      schemaType: `String`,
      schemaKey: "",
      schemaValue: ``,
    };
    apiStore.updateDefaultApi({
      dataSource: [...apiStore.defaultApi.dataSource, newData],
    });
  };

  handleSave = (row) => {
    const { apiStore } = this.props;
    const newData = apiStore.defaultApi.dataSource;
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    apiStore.updateDefaultApi({
      dataSource: newData.slice(),
    });
  };

  InnerTable = () => {
    const InnerTableDataSource = [
      {
        key: this.defaultApi.dataSource.length + "",
        schemaType: `String`,
        schemaKey: "",
        schemaValue: ``,
      },
    ];
    return (
      <Table
        components={this.components}
        columns={this.columnsNode}
        rowClassName={(record) => "editable-row"}
        bordered
        dataSource={InnerTableDataSource}
        pagination={false}
      />
    );
  };

  //嵌套表格的配置
  private expandableConfig = {
    expandedRowRender: this.InnerTable,
    rowExpandable: (record:Item) => record.schemaType == "Object",
    defaultExpandAllRows:true
  };

  render() {
    return (
      <div>
        <Row gutter={[16, 16]}>
          <Col>
            <Button onClick={this.handleAdd} type="primary">
              Add new Schema
            </Button>
          </Col>
        </Row>
        <Table
          components={this.components}
          rowClassName={(record) => "editable-row"}
          bordered
          dataSource={this.defaultApi.dataSource}
          columns={this.columnsNode}
          expandable={this.expandableConfig}
        />
      </div>
    );
  }
}

export default EditableTable;
