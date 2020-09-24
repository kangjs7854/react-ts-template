import React from 'react'
import {Form, Input, Button, Checkbox, notification} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './index.scss'
import {inject} from "mobx-react";

@inject('userStore')

export default class LoginForm extends React.Component<{ userStore:IUserStore}, any>{
    onFinish = async (values) => {
        const {username,password} = values
        this.props.userStore.handleLogin(username,password)
    };

    render() {
        const redirectUri = window.location.href.replace('login','authResult')
        return  (
            <div className='login-dialog'>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <a className="login-form-forgot" href={`https://github.com/login/oauth/authorize?client_id=50ab343567bd310005df&redirect_uri=${redirectUri}`}>
                            github登录
                        </a>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" block>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}