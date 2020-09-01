declare class apiStore{
    baseUrl :string
    apiName:string

    dataSource:IDataSource[]
    responseJson:any

    updateApiList(apiList:IApiList[]):void

    updateApiName(apiName:string | number):void

    updateDataSource(dataSource:IDataSource[]):void

    getAllMockApi():void

    handleMockApi():void

    setRequireKey(key:string):void

    deleteMockApi(apiName:string|number):void

    handleChooseApi(apiName:string|number):void
}

interface IApiList {
    apiName: string;
    method: string;
    dataSource: IDataSource[];
}

interface IDataSource {
    key: string;
    value: any;
    type: string;
    unique?:boolean
}
interface IParams{
    apiName:string| number,
    dataSource:IDataSource[],
}
