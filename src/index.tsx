/*
 * @Date: 2020-08-19 14:06:47
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-21 17:43:34
 * @FilePath: \react-ts-template\src\index.tsx
 */
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "mobx-react";
import CountStore from '@/store/count'
import ApiListStore from "@/store/apiList";

// if (module && module.hot) {
//   module.hot.accept();
// }

const stores={
  countStore:new CountStore(),
  apiListStore:new ApiListStore()
}

ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.querySelector("#root")
);
