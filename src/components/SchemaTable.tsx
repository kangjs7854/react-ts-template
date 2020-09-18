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
import {FallOutlined, PlusOutlined, CloseCircleOutlined} from '@ant-design/icons';

import {observer, inject} from "mobx-react";

const {Option} = Select;

const EditableContext = React.createContext<any>("");


const EditableRow: React.FC<EditableRowProps> = ({index, ...props}) => {
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
        form.setFieldsValue({[dataIndex]: record[dataIndex]});
    };

    const save = async (e) => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({...record, ...values});
        } catch (errInfo) {
            console.log("Save failed:", errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{margin: 0}}
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
                        style={{width: 120}}
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
                        prefix={() => <CloseCircleOutlined/>}
                    />
                )}
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{paddingRight: 24}}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

interface IProps {
    apiStore: IApiStore,
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
            dataIndex: 'value',
            width: "30%",
            editable: true,
            // render(text:string,record:IDataSource){
            //   return record.type == 'Object'
            //       ? <FallOutlined className='obj-icon' rotate={90} />
            //       : <p>{text}</p>
            // }
        },
        {
            title: "操作",
            dataIndex: "operation",
            render: (text: string, record: IDataSource) =>
                this.props.apiStore.dataSource.length >= 1 ? (
                    <div className='center'>
                        <Popconfirm
                            title="确定删除?"
                            onConfirm={() => {
                                this.handleDelete(record)
                            }}
                        >
                            <a>删除</a>
                        </Popconfirm>
                        {
                            record.isInner
                                ? <Tooltip className='copy-btn' title="添加多一行">
                                    <PlusOutlined onClick={() => this.handleAddInner(record)}/>
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

    handleSetUnique = (e: IDataSource) => {
        console.log(e.key)
        const newDataSource = this.props.apiStore.dataSource
        newDataSource.map(el => {
            if (el.key == e.key) {
                return el.unique = true
            }
            el.unique = false
        })
        this.props.apiStore.updateDataSource(newDataSource.slice())
        notification.success({message: "设置" + e.key + "为标识的key成功"});
    };

    handleDelete = (record: IDataSource) => {
        const {dataSource} = this.props.apiStore
        let newDataSource = dataSource
        if (record.isInner) {
            newDataSource.map(el => {
                if (Array.isArray(el.children) && el.children.some(innerEl => innerEl.id == record.id)) {
                    console.log(el.children.filter(innerEl => innerEl.id != record.id))
                    return el.children = el.children.filter(innerEl => innerEl.id != record.id)
                }
            })
        } else {
            newDataSource = dataSource.filter(el => el.id != record.id)
        }
        this.props.apiStore.updateDataSource(newDataSource.slice())
    };

    createUniqueId() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            let r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    handleAdd = () => {
        const newData = {
            key: ``,
            value: "",
            type: `String`,
            id: this.createUniqueId()
        };
        const newDataSource = [...this.props.apiStore.dataSource, newData]
        this.props.apiStore.updateDataSource(newDataSource)
    };

    handleAddInner = (record: IDataSource) => {
        const {dataSource} = this.props.apiStore
        const newDataSource = dataSource
        newDataSource.map(el => {
            if (Array.isArray(el.children) && el.children.some(innerEl => innerEl.id == record.id)) {
                return el.children = [...el.children, {
                    id: this.createUniqueId(),
                    key: "子表格的key",
                    value: "",
                    type: 'String',
                    isInner: true,
                }]
            }
        })
        this.props.apiStore.updateDataSource(newDataSource.slice())
    }

    handleSave = (row: IDataSource) => {
        const newDataSource = this.props.apiStore.dataSource;
        const index = newDataSource.findIndex((item) => row.id === item.id);
        //数据的类型为引用类型时，使用嵌套子表格的方式去展示
        if (row.type == 'Object' || row.type == 'Array') {
            !row.children && Object.assign(row, {
                children: [{
                    id: this.createUniqueId(),
                    key: "子表格的key",
                    value: "",
                    type: 'String',
                    isInner: true,
                }]
            })
        } else {
            row.children = []

        }
        if (index == -1) {
            newDataSource.map(el => {
                if (el.children?.some(innerEl => innerEl.id == row.id)) {
                    const innerIndex = el.children?.findIndex(innerEl => innerEl.id == row.id)
                    const innerItem = el.children[innerIndex]
                    return el.children?.splice(innerIndex, 1, {
                        ...innerItem,
                        ...row
                    })
                }
            })
        } else {
            const item = newDataSource[index];
            newDataSource.splice(index, 1, {
                ...item,
                ...row,
            });
        }
        this.props.apiStore.updateDataSource(newDataSource.slice())
    };

    handleSubmit = async () => {
        const {apiStore} = this.props;
        await apiStore.handleMockApi();
        await apiStore.getAllMockApi()
    };

    render() {
        let {dataSource} = this.props.apiStore
        dataSource.forEach(el => {
            el.children && el.children.length == 0 && delete el.children
        })
        return (
            <div>
                <div className='row button-wrap '>
                    <Button shape="round" style={{paddingRight: '20px'}} onClick={this.handleAdd} type="primary">
                        添加所需要的字段
                    </Button>
                    <Button shape="round" className="mock my-third-step" type="ghost" onClick={this.handleSubmit}>
                        mock
                    </Button>
                </div>
                <Table
                    className='my-second-step'
                    components={this.components}
                    rowClassName={(record) => "editable-row"}
                    bordered
                    dataSource={dataSource}
                    columns={this.columnsNode}
                    expandable={{defaultExpandAllRows: true}}
                />
            </div>
        );
    }
}

export default EditableTable;
