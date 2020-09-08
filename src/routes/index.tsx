//HashRouter  (./router/index.tsx)
import React, { Component } from 'react';
import { HashRouter, Switch, Route, Redirect ,withRouter, } from 'react-router-dom';
import Home from '@/pages/Home'
import Login from  '@/pages/login'
import Error from '@/pages/Error'
import Counter from '@/components/Counter'
import AuthResult from "@/pages/AuthResult";

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
        const isLogin = sessionStorage.getItem('isLogin')
        return  <Switch>
            { routes.map(el => <Route  exact={el.exact} path={el.path} render={props => (
                    <el.component {...props} routes={el.routes} />
                )}/>)}
        </Switch>

    }
}

export default withRouter(renderRoutes)

