/*
 * @Date: 2020-08-21 14:47:41
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-25 15:45:12
 * @FilePath: \react-ts-template\src\api\index.ts
 */
import Http from "@/utils/http";

const http = new Http();

let baseUrl:string = process.env.NODE_ENV == 'production' ? 'http://175.24.20.162:32775/api/mock' : 'http://localhost:3000/api/mock'

export default {
    getMockApi(url:string, params:any) {
        return http.post(baseUrl + '/' + url, params)
    },

    getAllMockApi() {
        return http.get(baseUrl)
    },

    deleteMockApi(url:string){
        return http.delete(baseUrl,{url})
    }

}