import axios from "axios";
import qs from "qs";
import {notification} from "antd";
const basePath:string = process.env.NODE_ENV == 'production' ? `http://${window.location.host}` : 'http://localhost:3000'
import LoginForm from "@/components/LoginForm";

interface IMapStatusToMsg{
    [key:number] : string
}

export default class Http {
    initRequestInstance(option:any = {
        timeout: 1000 * 10,
        headers: {
            "Content-Type": "application/json",
        },
    }){
        const mapStatusToMsg:IMapStatusToMsg = {
            400:'请求错误',
            401:'未授权，请重新登录',
            403:'拒绝访问',
            404:'请求资源不存在',
            408:'请求超时',
            500:'服务器错误',
            501:'服务未实现',
            502:'网络错误',
            503:'服务不可用',
            504:'网络超时',
        }
        const instance = axios.create(option);
        instance.interceptors.request.use(request => {
            const token = sessionStorage.getItem('token');
            if (token) {
                request.headers['Authorization'] = `Bearer ${token}`;
            }
            return request;
        });

        // 拦截响应，遇到token不合法则报错
        instance.interceptors.response.use(
            response => {
                if (response.data.token) {
                    console.log('token:', response.data.token);
                    sessionStorage.setItem('token', response.data.token);
                }
                return response;
            },
            error => {
                const {status,statusText }= error.response
                if (status === 401) {
                    sessionStorage.removeItem('token');
                    location.href = `http://${window.location.host}/#/login`

                }
                notification.info({message: `${statusText} ! ${mapStatusToMsg[status]}`})
                return Promise.reject(error);   // 返回接口返回的错误信息
            });
        return instance
    }

    post(url: string, params: any = {}) {
        const instance = this.initRequestInstance();
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

    get(url: string, params: any = {}) {
        //将传入的键值对参数拼接到url上
        url += "?" + qs.stringify(params);
        let instance = this.initRequestInstance();
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
        const instance = this.initRequestInstance();
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




