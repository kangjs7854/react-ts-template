import React from "react";
import {Breadcrumb, Layout, Menu, Avatar} from "antd";
import ApiList from "@/components/ApiList";
import ApiForm from "@/components/ApiForm";
import DevTools from "mobx-react-devtools";
import api from '@/api/index'

const {Header, Content, Footer, Sider} = Layout;
import {GithubOutlined} from '@ant-design/icons';
import './index.scss'
import {inject, observer} from "mobx-react";

import LoginForm from '@/components/LoginForm'
import Guide from '@/components/Guide'



@inject('userStore')
@observer
export default class Home extends React.Component<{ userStore: IUserStore }, {}> {

    jumpToGitHub = () => {
        const {userInfo} = this.props.userStore
        userInfo.html_url && window.open(userInfo.html_url)
    }

    render() {
        let {userInfo,isLogin,userName} = this.props.userStore
        if (!userInfo.html_url) {
            let temp = sessionStorage.getItem('userInfo')
            userInfo = temp && JSON.parse(temp)
        }
        return <Layout>
            { !isLogin && <LoginForm/> }
            <Header className="header">
                <div className="logo"/>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
                    <Menu.Item key="1">可视化配置数据接口</Menu.Item>
                    <Menu.Item onClick={this.jumpToGitHub}>
                        <Avatar size="large" src={userInfo?.avatar_url}/>
                        <span style={{paddingLeft: '10px'}}>{userInfo?.name || userName}</span>
                    </Menu.Item>
                </Menu>
            </Header>
            <Content style={{padding: "0 50px"}}>
                <Guide/>
                <Breadcrumb style={{margin: "16px 0"}}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                </Breadcrumb>
                <Layout
                    className="site-layout-background"
                    style={{padding: "24px 0"}}
                >
                    <Sider className="site-layout-background" width={200}>
                        <ApiList/>
                    </Sider>
                    <Content style={{padding: "0 24px", minHeight: 280}}>
                        <ApiForm/>
                    </Content>
                </Layout>
            </Content>
            <Footer style={{textAlign: "center"}}>
                <h3> ©2020 Created by kangjs <GithubOutlined
                    onClick={() => window.open('https://github.com/kangjs7854')}/></h3>
                {process.env.NODE_ENV !== 'production' ? <DevTools/> : null}
            </Footer>
        </Layout>;
    }
}