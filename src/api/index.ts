/*
 * @Date: 2020-08-21 14:47:41
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-25 15:45:12
 * @FilePath: \react-ts-template\src\api\index.ts
 */
import Http from "@/utils/http";

const http = new Http();

const baseUrl:string = process.env.NODE_ENV == 'production' ? `http://${window.location.host}` : 'http://localhost:3000'
export default {
    getMockApi(params:IParams) {
        return http.post( baseUrl+'/api/mock/' + params.apiName, params)
    },

    getAllMockApi() {
        return http.get(baseUrl+'/api/mock')
    },

    deleteMockApi(apiName:string){
        return http.delete(baseUrl+'/api/mock/',{apiName})
    },

    sendAuthCode(code:string){
        return http.post(baseUrl+'/api/auth',{code})

    },

    login(userName:string,passWord:string){
        return http.post(baseUrl+'/api/jwt',{
            userName,
            passWord
        })

    }

}