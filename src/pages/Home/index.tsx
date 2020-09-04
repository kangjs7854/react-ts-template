import React from "react";
import {Breadcrumb, Layout, Menu,Avatar} from "antd";
import ApiList from "@/components/ApiList";
import ApiForm from "@/components/ApiForm";
import DevTools from "mobx-react-devtools";
import api from '@/api/index'
const { Header, Content, Footer, Sider } = Layout;
import {UserOutlined} from '@ant-design/icons';
import './index.scss'

export default  class Home extends React.Component<any, any>{
    constructor(props) {
        super(props);
        this.state = {
            userInfo:{}
        }
    }

    async componentDidMount() {
        const code = this.getUrlParams('code')
        if(!code) return
        const res = await api.sendAuthCode(code)
        this.setState({
            userInfo:res
        })
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

    jumpToGitHub = ()=>{
        const {userInfo} = this.state
        userInfo.url ? window.location.href = userInfo.html_url
                     : this.props.history.push('/login')
    }

    render() {
        const {userInfo} = this.state
        return <Layout>
            <Header className="header">
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
                    <Menu.Item key="1">可视化配置api</Menu.Item>
                    <Menu.Item onClick={this.jumpToGitHub}>
                        <Avatar size="large"  src={userInfo.avatar_url}/>
                        <span style={{paddingLeft:'10px'}}>{userInfo.name}</span>
                    </Menu.Item>
                </Menu>
            </Header>
            <Content style={{ padding: "0 50px" }}>
                <Breadcrumb style={{ margin: "16px 0" }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                </Breadcrumb>
                <Layout
                    className="site-layout-background"
                    style={{ padding: "24px 0" }}
                >
                    <Sider className="site-layout-background" width={200}>
                        <ApiList />
                    </Sider>
                    <Content style={{ padding: "0 24px", minHeight: 280 }}>
                        <ApiForm />
                    </Content>
                </Layout>
            </Content>
            <Footer style={{ textAlign: "center" }}>
                Ant Design ©2018 Created by Ant UED
                {process.env.NODE_ENV !== 'production' ? <DevTools /> : null}
            </Footer>
        </Layout>;
    }
}