import React from 'react'
import {inject, observer} from "mobx-react";

import {Button, notification, Result, Spin} from "antd";

import api from "@/api";

@inject('userStore')
@observer
export  default class AuthResult extends React.Component<{userStore:IUserStore}, any>{
    state = {
        loading:true,
        status:'success',
    }

    async componentDidMount() {
        const code = this.getUrlParams('code')
        if(!code) return
        const res = await api.sendAuthCode(code)
        if(res.error){
            notification.warning({message:res.error_description})
            this.setState({status:'warning'})
        }else{
            this.props.userStore.updateUserInfo(res)
            sessionStorage.setItem('isLogin','true')
            sessionStorage.setItem('userInfo',JSON.stringify(res))
            this.props.history.push("/")
        }
        this.setState({loading:false})
    }

    getUrlParams(param:string){
        const str = location.search.substr(1)
        const arr = str.split('&')
        let res = ''
        arr.forEach(el=>{
            const paramsArr = el.split('=')
            if( paramsArr[0] == param ){
                res = paramsArr[1]
            }
        })
        return res
    }


    render() {
        const {status,loading} = this.state
        return <Spin spinning={loading}>
            <Result
                status={status}
                title={status == 'success'? '授权成功！正在登录':'授权码过期' }
                subTitle={status == 'success' && "正在将授权码发往服务端验证，请等待返回用户信息."}
                extra={[
                    <Button type="primary" key="console" onClick={()=>this.props.history.push("/")}>
                        回到首页
                    </Button>,
                    <Button key="buy" onClick={()=> this.props.history.push("/login")}>重新登录</Button>,
                   ,
                ]}
            />
        </Spin>
    }
}