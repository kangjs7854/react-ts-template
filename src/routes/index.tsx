//HashRouter  (./router/index.tsx)
import React, { Component } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import Home from '@/pages/Home'
import Login from  '@/pages/login'
import Error from '@/pages/Error'
export default class RouteConfig extends Component {

    render(){
        return(
            <HashRouter>
                <Switch>
                    <Route path="/" exact component={Home}></Route>
                    <Route path="/error" component={Error}></Route>
                    <Route path="/login" component={Login}></Route>

                </Switch>
            </HashRouter>
        )
    }
}
