import { observable, action } from "mobx";

export default class User{
    @observable userInfo:IUserInfo = {
        html_url:'',
        avatar_url:'',
        name:""
    }

    @action
    updateUserInfo(userInfo:IUserInfo){
        this.userInfo = userInfo
    }
}