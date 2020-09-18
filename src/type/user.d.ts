interface IUserStore{
    userInfo:IUserInfo
    isLogin:boolean
    userName:string
    passWord:string
    updateUserInfo(userInfo:IUser):void
    handleLogin(userName:string,password:string):void
}

interface IUserInfo{
    avatar_url:string
    name:string
    html_url:string
}