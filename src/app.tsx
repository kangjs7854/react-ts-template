/*
 * @Date: 2020-08-19 10:57:26
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-25 11:06:00
 * @FilePath: \react-ts-template\src\app.tsx
//  */

import { hot } from 'react-hot-loader/root';
import React from "react";
import Routes from '@/routes'
import {observer} from 'mobx-react';
import DevTools from 'mobx-react-devtools'
import { HashRouter } from 'react-router-dom';



@observer
class App extends React.Component  {
  render(){
    return (
      <div className="App">
          <HashRouter>
                <Routes />
          </HashRouter>
            {process.env.NODE_ENV !== 'production' ? <DevTools /> : null}
      </div>
    );
  }
};

export default hot(App);
