/*
 * @Date: 2020-08-21 16:32:44
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-21 17:52:22
 * @FilePath: \react-ts-template\src\store\count.js
 */
import { observable, action } from "mobx";
import api from "@/api/index";

class ApiListStore {
    @observable apiList = []

    @action
    updatedApiList(apiList) {
       this.apiList = apiList
    }

    async getAllMockApi() {
        const apiList = await api.getAllMockApi();
        this.updatedApiList(apiList);
    }

    async deleteMockApi(params){
        const res = await api.deleteMockApi({ url:params });
        this.updatedApiList(res)
    }
      
}


export default ApiListStore
