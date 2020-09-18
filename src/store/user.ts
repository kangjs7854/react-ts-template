import { observable, action } from "mobx";
import api from "@/api";
import {notification} from "antd";

export default class User{
    @observable userInfo:IUserInfo = {
        html_url:'',
        avatar_url:'',
        name:""
    }
    @observable isLogin:boolean = false
    @observable userName:string = ''
    @observable passWord:string = ''

    @action
    updateUserInfo(userInfo:IUserInfo){
        this.userInfo = userInfo
    }


    @action
    async handleLogin(userName:string,passWord:string){
        const data = await api.login(userName,passWord)
        notification.info({message:data.msg})
        if(data.code == 0 ){
            this.isLogin = true
            this.userName = userName
            sessionStorage.setItem('token',data.data.token)
        }


    }
}