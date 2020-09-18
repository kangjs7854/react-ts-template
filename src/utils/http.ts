/*
 * @Date: 2020-07-14 14:34:09
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-25 15:46:51
 * @FilePath: \react-ts-template\src\utils\http.ts
 */

import axios from "axios";
import qs from "qs";
import {notification} from "antd"; // 引入qs模块，用来序列化post类型的数据，后面会提到

let basePath: string = "http://localhost:3000";

axios.interceptors.request.use(request => {
    const token = sessionStorage.getItem('token');
    if (token) {
        request.headers['Authorization'] = `Bearer ${token}`;
    }
    return request;
});

// 拦截响应，遇到token不合法则报错
axios.interceptors.response.use(
    response => {
        if (response.data.token) {
            console.log('token:', response.data.token);
            sessionStorage.setItem('token', response.data.token);
        }
        return response;
    },
    error => {
        const errRes = error.response;
        if (errRes.status === 401) {
            sessionStorage.removeItem('token');
            notification.info({message: `'Auth Error!', \`${errRes.data.error.message}, please login!`})
        }
        return Promise.reject(error.message);   // 返回接口返回的错误信息
    });


export default class Http {
    /**
     * @description 处理不同请求头时的参数处理
     * 1.application/x-www-form-urlencoded 传递的参数要是字符串形式，使用qs.stringify(params)
     * 2.application/json 传递json对象，当params为对象时不需要额外处理
     */
    static handleParams(ContentType: string, params: any) {
        return ContentType == "application/x-www-form-urlencoded"
            ? qs.stringify(params)
            : params;
    }

    /**
     * post请求封装
     * @param {String} url 请求路径
     * @param {Object} params 请求参数
     */
    post(url: string, params: any = {}) {
        //axios请求选项配置
        const option = {
            timeout: 1000 * 10,
            headers: {
                "Content-Type": "application/json",
                "Authorization":`Bearer ${sessionStorage.getItem('token')}`
            },
        };
        params = Http.handleParams(option.headers["Content-Type"], params);
        const instance = axios.create(option);
        let reqUrl = url.includes("http") ? url : basePath + url;
        return instance
            .post(reqUrl, params)
            .then((res) => {
                res.config.url && sessionStorage.setItem("url", url);
                return res.data;
            })
            .catch((error) => {
                console.log("error", error);
            });
    }

    get(url: string, params: any = {}, headers = {}) {
        url += "?" + qs.stringify(params);
        let instance = axios.create({
            timeout: 1000 * 10,
            headers,
        });
        let reqUrl = url.includes("http") ? url : basePath + url;

        return instance
            .get(reqUrl)
            .then((res) => {
                return res.data;
            })
            .catch((error) => {
                console.log("error", error);
            });
    }

    delete(url: string, params = {}) {
        const option = {
            timeout: 1000 * 10,
            headers: {
                "Content-Type": "application/json",
            },
        };
        const instance = axios.create(option);
        return instance
            .delete(url, {data: params})
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.log("error", err);
            });
    }
}




