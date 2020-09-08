import React from 'react'
import './index.css'

interface IState{
    active:boolean
}

export default  class Login extends  React.Component<any, IState>{
    constructor(props) {
        super(props);
        this.state = {
            active:false
        }
    }
    switch= ()=>{
        this.setState({
            active:!this.state.active
        })
    }

    handleSubmit = (e:any)=>{
        e.preventDefault()
        console.log()
    }

    handleAuth = ()=>{
        // window.location.href= 'https://github.com/login/oauth/authorize?client_id=50ab343567bd310005df&redirect_uri=http://localhost:3000/api/auth'
        window.location.href= 'https://github.com/login/oauth/authorize?client_id=50ab343567bd310005df&redirect_uri=http://127.0.0.1:9000/#/authResult'


    }

    render(){
        return <div className={`container ${this.state.active && 'right-panel-active'}`}>
            <div className="container__form container--signup">
                <form action="#" className="form" id="form1" onSubmit={this.handleSubmit}>
                    <h2 className="form__title">注册</h2>
                    <input type="text" placeholder="用户名" className="input"/>
                    <input type="email" placeholder="邮箱" className="input"/>
                    <input type="password" placeholder="密码" className="input"/>
                    <button className="btn">注册</button>
                </form>
            </div>

            <div className="container__form container--signin">
                <form action="#" className="form" id="form2" onSubmit={this.handleSubmit}>
                    <h2 className="form__title">登录</h2>
                    <input type="email" placeholder="邮箱" className="input"/>
                    <input type="password" placeholder="密码" className="input"/>
                    <a href="#" className="link" onClick={this.handleAuth}>github授权登录?</a>
                    <button className="btn">登录</button>
                </form>
            </div>

            <div className="container__overlay">
                <div className="overlay">
                    <div className="overlay__panel overlay--left">
                        <button className="btn" id="signIn" onClick={this.switch}>登录</button>
                    </div>
                    <div className="overlay__panel overlay--right">
                        <button className="btn" id="signUp" onClick={this.switch}>注册</button>
                    </div>
                </div>
            </div>
        </div>
    }
}