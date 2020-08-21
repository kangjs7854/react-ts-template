/*
 * @Date: 2020-08-21 16:32:44
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-21 17:52:22
 * @FilePath: \react-ts-template\src\store\count.js
 */
import { observable, action,decorate } from "mobx";

class Count {
    count = 0

    increase() {
        this.count += 1;
    }

    decrease() {
        this.count -= 1
    }
}

decorate(Count, {
    count: observable,
    increase: action,
    decrease: action,
})
export default Count
