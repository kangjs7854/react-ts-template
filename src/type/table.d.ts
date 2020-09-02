
interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: string;
    record: IDataSource;
    handleSave: (record: IDataSource) => void;
}

interface EditableRowProps {
    index: number;
}