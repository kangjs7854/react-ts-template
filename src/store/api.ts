/*
 * @Date: 2020-08-21 16:32:44
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-25 15:45:40
 * @FilePath: \react-ts-template\src\store\api.ts
 */
import { observable, action } from "mobx";
import api from "@/api/index";
import { notification } from "antd";


class ApiStore {
  @observable baseUrl :string = process.env.NODE_ENV == 'production' ? `http://${window.location.host}/api/mock/` : 'http://localhost:3000/api/mock/'
  @observable apiName:string | number = ''

  @observable apiList: IApiList[] = [];
  @observable dataSource:IDataSource[] = [
    {
      id:1,
      key: "name",
      value: "张三",
      type: "String",
      desc:"用户姓名",
      unique:true
    },

  ]
  @observable responseJson:any = {}

  @observable editedJsonData = {}

  @observable deleteKey:string = ''

  @action
  updateApiList(apiList:IApiList[]) {
    this.apiList = apiList;
  }

  @action
  updateApiName(apiName:string | number){
    this.apiName = apiName
  }

  @action
  updateDataSource(dataSource:IDataSource[]){
    this.dataSource = dataSource
  }

  @action
  updateEditedJsonData(editedJsonData:any){
    this.editedJsonData = editedJsonData
    this.handleMockApi()
  }

  @action
  updateDeleteKey(deleteKey:string){
    this.deleteKey = deleteKey
  }

  async getAllMockApi() {
    const apiList: IApiList[] = await api.getAllMockApi();
    this.updateApiList(apiList);
  }

  async deleteMockApi(apiName: string) {
    const res:IApiList[] = await api.deleteMockApi(apiName);
    if(!res)return
    notification.success({message:"删除成功"})
    this.updateApiList(res);
  }

  @action
  async handleMockApi(deleteId?:string,isInsert?:boolean) {
    const params:IParams = {
      apiName:this.apiName,
      dataSource:this.dataSource
    };
    if (!this.apiName) return notification.warning({ message: "api名称不能为空" });
    //更新json数据
    if(this.editedJsonData?._id){
      Object.assign(params,{newData:this.editedJsonData})
    }
    //删除json数据
    if(deleteId){
      Object.assign(params,{deleteId})
    }

    //删除json数据的某个字段
    if(this.deleteKey){
      Object.assign(params,{deleteKey:this.deleteKey})
    }

    if(isInsert){
      Object.assign(params,{isInsert})
    }

    const res = await api.getMockApi(params);
    if(!res)return
    this.responseJson = res
    notification.warning({ message: "mock成功" });
  }

  handleChooseApi(apiName: string) {
    const res:any = this.apiList.find((el) => el.apiName == apiName);
    this.updateApiName(res.apiName)
    this.handleMockApi();
    //注意更新表格数据应该放在mock完之后，否则每次点击选择api都会先更新表格数据再mock，导致最初的数据无法修改
    this.updateDataSource(res.dataSource)

  }
}

export default ApiStore;
