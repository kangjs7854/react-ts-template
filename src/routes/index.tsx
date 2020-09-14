//HashRouter  (./router/index.tsx)
import React, { Component } from 'react';
import { HashRouter, Switch, Route, Redirect ,withRouter, } from 'react-router-dom';
import {Skeleton} from "antd";

const Home  = React.lazy(()=> import('@/pages/Home'))
const Login  = React.lazy(()=> import('@/pages/login'))
const Error  = React.lazy(()=>import('@/pages/Error'))
const AuthResult  = React.lazy(()=>import('@/pages/AuthResult'))

const Counter  = React.lazy(()=>import('@/components/Counter'))


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
        path:"/login",
        component:Login,
    },
    {
        path:"/authResult",
        component: AuthResult
    },
    {
        path:"/*",
        component:Error,
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

