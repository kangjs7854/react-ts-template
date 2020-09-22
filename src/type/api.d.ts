declare class IApiStore{
    baseUrl :string
    apiName:string

    apiList:IApiList[]
    dataSource:IDataSource[]
    responseJson:any

    updateApiList(apiList:IApiList[]):void

    updateApiName(apiName:string | number):void

    updateDataSource(dataSource:IDataSource[]):void

    getAllMockApi():void

    handleMockApi(deleteId?:string,isInsert?:boolean):void

    setRequireKey(key:string):void

    deleteMockApi(apiName:string|number):void

    handleChooseApi(apiName:string|number):void

    updateEditedJsonData(editedJsonData:any):void

    updateDeleteKey(deleteKey:string):void
}

interface IApiList {
    apiName: string;
    method: string;
    dataSource: IDataSource[];
}

interface IDataSource {
    id:string | number
    key: string;
    value: string | IDataSource[];
    children?:IDataSource[]
    type: string;
    unique?:boolean
    isInner?:boolean,
    desc:string,
}
interface IParams{
    apiName:string| number,
    dataSource:IDataSource[],
}
