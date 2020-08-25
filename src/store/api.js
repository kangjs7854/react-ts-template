/*
 * @Date: 2020-08-21 16:32:44
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-24 15:51:21
 * @FilePath: \react-ts-template\src\store\api.js
 */
import { observable, action } from "mobx";
import api from "@/api/index";
import { notification } from 'antd'
class ApiStore {
    @observable apiList = []
    @observable defaultApi = {
        methods: 'post',
        url: '',
        uniqueKey: 'name',
        dataSource: [
            {
                key: '0',
                schemaKey: "name",
                schemaType: "String",
                schemaValue: "张三",
            },
            {
                key: '1',
                schemaKey: "age",
                schemaType: "Number",
                schemaValue: "18"
            },

        ],
        response: {}
    }

    @action
    updateApiList(apiList) {
        this.apiList = apiList
    }

    @action
    updateDefaultApi(payload) {
        Object.assign(this.defaultApi, payload)
    }

    async getAllMockApi() {
        const apiList = await api.getAllMockApi();
        this.updateApiList(apiList);
    }

    async deleteMockApi(params) {
        const res = await api.deleteMockApi({ url: params });
        this.updateApiList(res)
    }

    async getMockApi() {
        const Schema = {};
        const params = {};
        const { dataSource, uniqueKey, url, methods } = this.defaultApi;
        dataSource.forEach((el) => {
            Schema[el.schemaKey] = el.schemaType;
            params[el.schemaKey] = el.schemaValue;
        });
        Object.assign(params, { Schema }, { uniqueKey });

        if (!url) return notification.warning({ message: "url不能为空" });
        try {
            const res = await api.getMockApi(url, params);
            this.updateDefaultApi({ response: res })
            notification.warning({ message: "mock success" });

        } catch (error) {
            console.log(error);
        }
    }

    handleChooseApi(url) {
        const res = this.apiList.find(el => el.url == url)
        this.updateDefaultApi(res)
        this.getMockApi()
    }



}


export default ApiStore
