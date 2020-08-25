/*
 * @Date: 2020-07-14 14:34:09
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-25 15:46:51
 * @FilePath: \react-ts-template\src\utils\http.ts
 */

import axios from "axios";
import qs from "qs"; // 引入qs模块，用来序列化post类型的数据，后面会提到
import CryptoJS from "crypto-js";

let basePath:string = "http://localhost:3000";
export default class Http {
  constructor() {
    this.requestTimestamp = new Date().getTime();
    this.requestId = Http.createUniqueId();
  }

  //生成唯一的id
  static createUniqueId() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      let r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**@description 生成签名
   * 1.将参数的属性按 ASCII排序参数
   * 2.拼接成字符串+服务端协商好的key
   * 3.md5加密字符串
   * @param {Object} params 参数
   * @param {String} key 服务端协商好的密钥key
   */
  static createSign(params = {}, key = "") {
    const paramsArr = Object.keys(params);
    let signStr = "";

    paramsArr.sort();
    paramsArr.forEach((el) => {
      signStr += `${el}=${params[el]}&`;
    });

    //最掉最后一个参数的&
    signStr = signStr.slice(0, -1) + key;
    return CryptoJS.MD5(signStr).toString().toUpperCase();
  }

  /**
   * @description 处理不同请求头时的参数处理
   * Content-Type
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
        requestId: this.requestId,
        requestTimestamp: this.requestTimestamp,
        sign: Http.createSign(params),
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

  get(url:string, params:any = {}, headers = {}) {
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

  delete(url:string, params = {}) {
    const option = {
      timeout: 1000 * 10,
      headers: {
        "Content-Type": "application/json",
      },
    };
    const instance = axios.create(option);
    return instance
      .delete(url, { data: params })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log("error", err);
      });
  }
}

/**
 * @description 请求拦截
 * 1.每次发送请求之前判断vuex中是否存在token
 * 2.如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
 * 3.即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
 */
axios.interceptors.request.use(
  (config) => {
    const token = store.state.token;
    token && (config.headers.Authorization = token);
    return config;
  },
  (error) => {
    return Promise.error(error);
  }
);

/**
 * @description 响应拦截
 * 1.如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
 * 2.否则的话抛出错误处理异常
 *
 * 假设登录验证的token过期，服务端会返回一个'token invalid'的标识
 * 不能在请求之后再更新token，就需要用到响应拦截
 */
axios.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      if (response.data.message === "token invalid") {
        handleRefreshToken(newToken);
      }
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    Promise.reject(errorHander(error.response.status));
  }
);

function errorHander(status:number) {
  const mapStatus:any = {
    "404": "请求资源不存在",
    "500": "服务器无响应",
  };
  return mapStatus[status];
}

function handleRefreshToken(newToken:string) {}
