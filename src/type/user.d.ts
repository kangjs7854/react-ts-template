interface IUserStore{
    userInfo:IUserInfo
    updateUserInfo(userInfo:IUser):void
}

interface IUserInfo{
    avatar_url:string
    name:string
    html_url:string
}