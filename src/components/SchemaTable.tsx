import "./index.scss";
import React, {useContext, useState, useEffect, useRef, ReactElement} from "react";
import {
  Table,
  Input,
  Button,
  Popconfirm,
  Form,
  Select,
  Tag,
  notification,
  Tooltip
} from "antd";
import { FallOutlined ,PlusOutlined} from '@ant-design/icons';

import { observer, inject } from "mobx-react";

const { Option } = Select;

const EditableContext = React.createContext<any>("");



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
            required: dataIndex != "value",
            message: `${title} is required.`,
          },
        ]}
      >
        {dataIndex == "type" ? (
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

interface IProps{
  apiStore:apiStore,
}

@inject("apiStore")
@observer
class EditableTable extends React.Component<IProps> {
  private columns = [
    {
      title: "名称",
      dataIndex: "key",
      width: "20%",
      editable: true,
      render: (text: string, record: IDataSource) => {
        return record.unique ? (
          <Tag color="magenta">{text}</Tag>
        ) : (
          <p>{text}</p>
        );
      },
    },
    {
      title: "类型",
      dataIndex: "type",
      width: "30%",
      editable: true,
    },
    {
      title: "默认值",
      dataIndex: "value",
      width: "30%",
      editable: true,
      render(text:string,record:IDataSource){
        return record.type == 'Object'
            ? <FallOutlined className='obj-icon' rotate={90} />
            : <p>{text}</p>
      }
    },
    {
      title: "操作",
      dataIndex: "operation",
      render: (text: string, record: IDataSource) =>
        this.props.apiStore.dataSource.length >= 1 ? (
             <div className='center'>
               <Popconfirm
                   title="确定删除?"
                   onConfirm={() => this.handleDelete(record.key)}
               >
                 <a>删除</a>
               </Popconfirm>
               {
                 record.isInner
                     ? <Tooltip className='copy-btn' title="添加多一行">
                        <PlusOutlined onClick={()=>this.handleAddInner(record)}/>
                       </Tooltip>
                     : <Tooltip className='copy-btn' title="根据主键作为数据修改的标识">
                         <Button shape='round' onClick={() => this.handleSetUnique(record)}>
                           设为主键
                         </Button>
                       </Tooltip>
               }
             </div>

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
      onCell: (record: IDataSource) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: this.handleSave,
      }),
    };
  });

  handleSetUnique = (e:IDataSource) => {
    console.log(e.key)
    const newDataSource = this.props.apiStore.dataSource
    newDataSource.map(el=>{
      if(el.key == e.key){
        return el.unique = true
      }
      el.unique = false
    })
    this.props.apiStore.updateDataSource(newDataSource.slice())
    notification.success({ message: "设置" + e.key + "为标识的key成功" });
  };

  handleDelete = (key: string) => {
    const newDataSource = this.props.apiStore.dataSource.filter(el=>el.key!=key)
    this.props.apiStore.updateDataSource(newDataSource)
  };

  handleAdd = () => {
    const newData = {
      key: ``,
      value: "",
      type: `String`,
    };
    const newDataSource = [...this.props.apiStore.dataSource,newData]
    this.props.apiStore.updateDataSource(newDataSource)
  };

  handleAddInner(record:IDataSource){
    const {dataSource} = this.props.apiStore
    const newDataSource = dataSource
    newDataSource.map(el=>{
      if(Array.isArray(el.value) && el.value.some(innerEl=>innerEl.key == record.key)){
        return el.value = [...el.value,{
          key:"cardType",
          value:"就诊卡",
          type:'String'
        }]
      }
    })
    console.dir(newDataSource)
    this.props.apiStore.updateDataSource(newDataSource.slice())
  }

  handleSave = (row:IDataSource) => {
    const newData = this.props.apiStore.dataSource;
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.props.apiStore.updateDataSource(newData.slice())
  };

  InnerTable = () => {
    const InnerTableDataSource = this.props.apiStore.dataSource.find(el=>el.type == 'Object')?.value as IDataSource[]
    //添加嵌套子表格的标识
    InnerTableDataSource.map(el=>el.isInner = true)
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
    rowExpandable: (record:IDataSource) => record.type == "Object",
    defaultExpandAllRows:true,
    expandRowByClick:true
  };

  handleSubmit = async () => {
    const { apiStore } = this.props;
    await apiStore.handleMockApi();
    await apiStore.getAllMockApi()
  };

  render() {
    return (
      <div>
        <div className='row button-wrap'>
          <Button shape="round" style={{paddingRight:'20px'}} onClick={this.handleAdd} type="primary">
            添加所需要的字段
          </Button>
          <Button shape="round" className="mock" type="ghost" onClick={this.handleSubmit}>
            mock
          </Button>
        </div>
        <Table
          components={this.components}
          rowClassName={(record) => "editable-row"}
          bordered
          dataSource={this.props.apiStore.dataSource}
          columns={this.columnsNode}
          expandable={this.expandableConfig}
        />
      </div>
    );
  }
}
export default EditableTable;
