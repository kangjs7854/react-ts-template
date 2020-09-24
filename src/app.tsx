import { hot } from 'react-hot-loader/root';
import React from "react";
import Routes from '@/routes'
import {observer} from 'mobx-react';
import DevTools from 'mobx-react-devtools'
import { HashRouter } from 'react-router-dom';
import {Avatar, Layout, Menu} from "antd";
const {Header,} = Layout;
import {SettingOutlined} from '@ant-design/icons';


@observer
class App extends React.Component  {
    render(){
        return (
            <div className="App">
                <Header className="header">
                    <div className="logo"/>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
                        <Menu.Item key="1" onClick={()=>location.href=`http://${window.location.host}/#/`}>可视化配置数据接口</Menu.Item>
                        <Menu.Item key="2"  onClick={()=>location.href=`http://${window.location.host}/#/admin`}><SettingOutlined /></Menu.Item>
                    </Menu>
                </Header>
                 <div >
                     <HashRouter >
                         <Routes />
                     </HashRouter>
                 </div>
                {process.env.NODE_ENV !== 'production' ? <DevTools /> : null}
            </div>
        );
      }
};

export default hot(App);
