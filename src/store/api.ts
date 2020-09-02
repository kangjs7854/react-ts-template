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
  @observable baseUrl :string = 'http://localhost:3000/api/mock/'
  @observable apiName:string | number = ''

  @observable apiList: IApiList[] = [];
  @observable dataSource:IDataSource[] = [
    {
      key: "name",
      value: "张三",
      type: "String",
      unique:true
    },
    {
      key: "age",
      value: "18",
      type: "Number",
    },
    {
      key: "card",
      value: [
        {
          key:"cardNo",
          value:"78543785",
          type:'String'
        },

      ],
      type: "Object",
    },
  ]
  @observable responseJson:any = {}

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

  async getAllMockApi() {
    const apiList: IApiList[] = await api.getAllMockApi();
    this.updateApiList(apiList);
  }

  async deleteMockApi(apiName: string) {
    const res:IApiList[] = await api.deleteMockApi(apiName);
    this.updateApiList(res);
  }

  @action
  async handleMockApi() {
    const params:IParams = {
      apiName:this.apiName,
      dataSource:this.dataSource
    };
    if (!this.apiName) return notification.warning({ message: "api名称不能为空" });
    try {
      const res = await api.getMockApi(params);
      this.responseJson = res
      notification.warning({ message: "mock成功" });
    } catch (error) {
      console.log(error);
    }
  }

  handleChooseApi(apiName: string) {
    const res:any = this.apiList.find((el) => el.apiName == apiName);
    this.updateDataSource(res.dataSource)
    this.updateApiName(res.apiName)
    this.handleMockApi();
  }
}

export default ApiStore;
