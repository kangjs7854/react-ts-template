/*
 * @Date: 2020-08-19 10:57:26
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-20 10:08:10
 * @FilePath: \react-ts-template\src\app.tsx
//  */
import React, { FC } from 'react';
import FormSizeDemo from '@/components/form'
import './app.scss'

const App: FC = () => (
  <div className="App">
    <FormSizeDemo />
  </div>
);

export default App

// const root = document.querySelector('#root')
// root.innerHTML = 'hello, webpack!'