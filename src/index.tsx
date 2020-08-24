/*
 * @Date: 2020-08-19 14:06:47
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-24 13:47:29
 * @FilePath: \react-ts-template\src\index.tsx
 */
import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { Provider } from "mobx-react";
import CountStore from '@/store/count'
import ApiStore from "@/store/api";

if (module && module.hot) {
  module.hot.accept();
}

const stores={
  countStore:new CountStore(),
  apiStore:new ApiStore()
}

ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
