/*
 * @Date: 2020-08-21 16:32:44
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-25 15:45:40
 * @FilePath: \react-ts-template\src\store\api.ts
 */
import { observable, action } from "mobx";
import api from "@/api/index";
import { notification } from "antd";

interface IApiList {
  url: string;
  methods: string;
  dataSource: IDataSource[];
}

interface IDataSource {
  key: string;
  schemaKey: string;
  schemaType: string;
  schemaValue: string;
}

interface IDefaultApi {
  uniqueKey?: string;
  response?: any;
  url?:string,
  methods?:string,
  dataSource?:IDataSource[]
}



class ApiStore {
  @observable apiList: IApiList[] = [];
  @observable defaultApi: IDefaultApi = {
    methods: "post",
    url: "",
    uniqueKey: "name",
    dataSource: [
      {
        key: "0",
        schemaKey: "name",
        schemaType: "String",
        schemaValue: "张三",
      },
      {
        key: "1",
        schemaKey: "age",
        schemaType: "Number",
        schemaValue: "18",
      },
    ],
    response: {},
  };

  @action
  updateApiList(apiList:IApiList[]) {
    this.apiList = apiList;
  }

  @action
  updateDefaultApi(payload: IDefaultApi) {
    Object.assign(this.defaultApi, payload);
  }

  async getAllMockApi() {
    const apiList: IApiList[] = await api.getAllMockApi();
    this.updateApiList(apiList);
  }

  async deleteMockApi(url: string) {
    const res:IApiList[] = await api.deleteMockApi(url);
    this.updateApiList(res);
  }

  async getMockApi() {
    const Schema:any = {};
    const params:any = {};
    const { dataSource, uniqueKey, url, methods } = this.defaultApi;
    dataSource?.forEach((el) => {
      Schema[el.schemaKey] = el.schemaType;
      params[el.schemaKey] = el.schemaValue;
    });
    Object.assign(params, { Schema }, { uniqueKey });

    if (!url) return notification.warning({ message: "url不能为空" });
    try {
      const res = await api.getMockApi(url, params);
      this.updateDefaultApi({ response: res });
      notification.warning({ message: "mock success" });
    } catch (error) {
      console.log(error);
    }
  }

  handleChooseApi(url: string) {
    const res:any = this.apiList.find((el) => el.url == url);
    this.updateDefaultApi(res);
    this.getMockApi();
  }
}

export default ApiStore;
