//HashRouter  (./router/index.tsx)
import React, { Component } from 'react';
import { HashRouter, Switch, Route, Redirect ,withRouter, } from 'react-router-dom';
import {Skeleton, Button} from "antd";

const Home  = React.lazy(()=> import('@/pages/Home'))
const Login = React.lazy(()=>import('@/pages/Login'))
const AuthResult  = React.lazy(()=>import('@/pages/AuthResult'))
const Counter  = React.lazy(()=>import('@/components/Counter'))
import { Empty } from 'antd';

function ErrorPage({history}){
    return <Empty
        image="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQzYKyPSfTbOs5ddkLlMgUN3WjcKuvrqJp24Q&usqp=CAU"
        imageStyle={{
            height: 200,
            margin: '20px'
        }}
        description={<h3> 找不到该页面 </h3>}
    >
        <Button shape="round" onClick={()=>history.push("/")}>回到首页</Button>
    </Empty>
}

const routes = [
    {
        path:"/",
        exact: true,
        component:Home,
        routes:[
            {
                path:"/counter",
                component:Counter
            }
        ]
    },
    {
        path: "/login",
        component:Login
    },
    {
        path:"/authResult",
        component: AuthResult
    },
    {
        path:"/*",
        component:ErrorPage,
    },

]
class renderRoutes extends Component {
    render(){
        return <React.Suspense fallback={<Skeleton avatar paragraph={{ rows: 4 }} />}>
                    <Switch>
                        { routes.map(el => <Route  exact={el.exact} path={el.path} render={props => (
                                <el.component {...props} routes={el.routes} />
                            )}/>)}
                    </Switch>
             </React.Suspense>
    }
}

export default withRouter(renderRoutes)

