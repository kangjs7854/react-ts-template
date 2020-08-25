/*
 * @Date: 2020-08-21 14:47:41
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-25 10:52:07
 * @FilePath: \react-ts-template\src\api\index.js
 */
import Http from "@/utils/http";

const http = new Http();

let baseUrl = process.env.NODE_ENV == 'production' ? 'http://175.24.20.162:32775/api/mock' : 'http://localhost:3000/api/mock'

export default {
    getMockApi(url, params) {
        return http.post(baseUrl + '/' + url, params)
    },

    getAllMockApi() {
        return http.get(baseUrl)
    },

    deleteMockApi(params={url}){
        return http.delete(baseUrl,params)
    }

}