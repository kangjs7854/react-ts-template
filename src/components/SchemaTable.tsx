import "./table.scss";
import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
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
} from "antd";
const { Option } = Select;

const EditableContext = React.createContext<any>();

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
  const inputRef = useRef();

  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current && inputRef.current.focus();
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

  const handleChange = () => {};

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
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

const EditableTable: React.FC = (props, ref) => {
  const [dataSource, setDataSource] = useState([
    {
      key: "0",
      schemaType: "String",
      schemaKey: "name",
      schemaValue: "London",
    },
    {
      key: "1",
      schemaType: "Number",
      schemaKey: "age",
      schemaValue: "18",
    },
  ]);

  const [uniqueKey, setUnique] = useState("name");

  useImperativeHandle(ref, () => {
    return {
      getDataSource: () => {
        return {
          dataSource,
          uniqueKey,
        };
      },
    };
  });

  const handleSetUnique = (e) => {
    setUnique(e);
    notification.success({ message: "设置" + e + "为标识的key成功" });
  };

  const columns = [
    {
      title: "schemaType",
      dataIndex: "schemaType",
      width: "30%",
      editable: true,
    },
    {
      title: "schemaKey",
      dataIndex: "schemaKey",
      width: "20%",
      editable: true,
      render: (text:string, record:Item) => {
        return uniqueKey == record.schemaKey ? (
          <Tag color="magenta">{text}</Tag>
        ) : (
          <p>{text}</p>
        );
      },
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
      render: (text:string, record:Item) =>
        dataSource.length >= 1 ? (
          <Row align="middle">
            <Col>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => handleDelete(record.key)}
              >
                <a>Delete</a>
              </Popconfirm>
            </Col>
            <Col push="6">
              <Button onClick={() => handleSetUnique(record.schemaKey)}>
                setUnique
              </Button>
            </Col>
          </Row>
        ) : null,
    },
  ];

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columnsNode = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record:Item) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  const handleDelete = (key:string) => {
    
    setDataSource(dataSource.filter((item) => item.key !== key));
  };

  const handleAdd = () => {
    const newData = {
      key: dataSource.length + "",
      schemaType: `String`,
      schemaKey: "",
      schemaValue: ``,
    };
    dataSource.push(newData);
    console.log(dataSource);

    setDataSource(dataSource.slice());
  };

  const handleSave = (row) => {
    const newData = dataSource;
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData.slice());
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col>
          <Button onClick={handleAdd} type="primary">
            Add a Schema
          </Button>
        </Col>
      </Row>
      <Table
        components={components}
        rowClassName={(record) => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columnsNode}
      />
    </div>
  );
};

export default forwardRef(EditableTable);
