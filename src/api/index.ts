import Http from "@/utils/http";
const http = new Http();

export default {
    getMockApi(params:IParams) {
        return http.post( '/api/mock/' + params.apiName, params)
    },

    getAllMockApi() {
        return http.get('/api/mock')
    },

    deleteMockApi(apiName:string){
        return http.delete('/api/mock/',{apiName})
    },

    sendAuthCode(code:string){
        return http.post('/api/auth',{code})

    },

    login(userName:string,passWord:string){
        return http.post('/api/jwt',{
            userName,
            passWord
        })

    }

}