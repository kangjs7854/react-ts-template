//HashRouter  (./router/index.tsx)
import React, { Component } from 'react';
import { HashRouter, Switch, Route, Redirect ,withRouter, } from 'react-router-dom';
import {Skeleton} from "antd";

const Home  = React.lazy(()=> import('@/pages/Home'))
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
        path:"/authResult",
        component: AuthResult
    },
    {
        path:"/*",
        component:Home,
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

