/*
 * @Date: 2020-08-19 14:06:47
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-19 18:34:37
 * @FilePath: \react-ts-template\src\index.tsx
 */
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

if (module && module.hot) {
    module.hot.accept()
  }
  
ReactDOM.render( <App name="kangjs" age="18" ></App>, document.querySelector('#root'))
