import React from "react";
import {Breadcrumb, Layout, Menu, Avatar} from "antd";
import DevTools from "mobx-react-devtools";
const {Header, Content, Footer, Sider} = Layout;
import {GithubOutlined} from '@ant-design/icons';
import {inject, observer} from "mobx-react";

import ApiList from "@/components/ApiList";
import ApiForm from "@/components/ApiForm";
import Guide from '@/components/Guide'

import './index.scss'

@inject('userStore')
@observer
export default class Home extends React.Component<{ userStore: IUserStore }, {}> {

    componentDidMount() {
        if(!this.props.userStore.isLogin && !sessionStorage.getItem('isLogin')){
            this.props.history.push("/login")
        }
    }

    render() {
        return <Layout>
            <Content style={{padding: "0 50px"}}>
                {(this.props.userStore.isLogin || sessionStorage.getItem('isLogin'))&&  <Guide/>}
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