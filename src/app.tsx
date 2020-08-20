/*
 * @Date: 2020-08-19 10:57:26
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-20 15:24:38
 * @FilePath: \react-ts-template\src\app.tsx
//  */
import React, { FC } from "react";
import Form from "@/components/Form";

import "./app.scss";

const App: FC = () => {
  return (
    <div className="App">
      <Form />
    </div>
  );
};

export default App;

