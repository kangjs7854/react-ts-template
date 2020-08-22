/*
 * @Date: 2020-08-21 16:32:44
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-21 17:52:22
 * @FilePath: \react-ts-template\src\store\count.js
 */
import { observable, action,decorate } from "mobx";

class CountStore {
    @observable count = 0

    @action
    increase() {
        this.count += 1;
    }

    @action
    decrease() {
        this.count -= 1
    }
}

//不用装饰器的使用方法，如果装饰器的babel依赖包没装好，可能会出现实例化该state时值为空

// decorate(Count, {
//     count: observable,
//     increase: action,
//     decrease: action,
// })
export default CountStore
