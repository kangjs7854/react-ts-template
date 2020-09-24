import * as React from 'react';
import axios from 'axios';
import copy from 'copy-to-clipboard';

import {render as renderAmis} from 'amis';
import {alert, confirm} from 'amis/lib/components/Alert';
import {toast} from 'amis/lib/components/Toast';

export default class Admin extends React.Component<any, any> {
    render() {
        return (
            <div>
                <p>通过 amis 渲染页面</p>
                {renderAmis(
                    {
                        type: 'page',
                        initApi: "https://houtai.baidu.com/api/mock2/page/initData",
                        title: '简单页面',
                        body: [
                            {
                                "type": "tpl",
                                "tpl": "Hello World    ${title}"
                            },
                            {
                                "type": "divider"
                            },
                            {
                                "type": "form",
                                "controls": [
                                    {
                                        "type": "text",
                                        "name": "name",
                                        "label": "姓名"
                                    }
                                ]
                            }
                        ]
                    },
                    {},
                    {
                        // env...
                        theme: 'default', // cxd 或 dark
                        // 这些是 amis 需要的一些接口实现
                        // 可以参考后面的参数介绍。

                        jumpTo: (
                            location: string /*目标地址*/,
                            action: any /* action对象*/
                        ) => {
                            // 用来实现页面跳转, actionType:link、url 都会进来。
                            // 因为不清楚所在环境中是否使用了 spa 模式，所以自己实现这个方法吧。
                        },
                        updateLocation: (
                            location: string /*目标地址*/,
                            replace: boolean /*是replace，还是push？*/
                        ) => {
                            // 地址替换，跟 jumpTo 类似
                        },
                        fetcher: ({
                                      url, // 接口地址
                                      method, // 请求方法 get、post、put、delete
                                      data, // 请求数据
                                      responseType,
                                      config, // 其他配置
                                      headers // 请求头
                                  }: any) => {
                            config = config || {};
                            config.withCredentials = true;
                            responseType && (config.responseType = responseType);

                            if (config.cancelExecutor) {
                                config.cancelToken = new (axios as any).CancelToken(
                                    config.cancelExecutor
                                );
                            }

                            config.headers = headers || {};

                            if (method !== 'post' && method !== 'put' && method !== 'patch') {
                                if (data) {
                                    config.params = data;
                                }

                                return (axios as any)[method](url, config);
                            } else if (data && data instanceof FormData) {
                                config.headers = config.headers || {};
                                config.headers['Content-Type'] = 'multipart/form-data';
                            } else if (
                                data &&
                                typeof data !== 'string' &&
                                !(data instanceof Blob) &&
                                !(data instanceof ArrayBuffer)
                            ) {
                                data = JSON.stringify(data);
                                config.headers = config.headers || {};
                                config.headers['Content-Type'] = 'application/json';
                            }

                            return (axios as any)[method](url, data, config);
                        },
                        isCancel: (value: any) => (axios as any).isCancel(value),
                        notify: (
                            type: 'error' | 'success' /**/,
                            msg: string /*提示内容*/
                        ) => {
                            toast[type]
                                ? toast[type](msg, type === 'error' ? '系统错误' : '系统消息')
                                : console.warn('[Notify]', type, msg);
                        },
                        alert,
                        confirm,
                        copy: content => {
                            copy(content);
                            toast.success('内容已复制到粘贴板');
                        }
                    },

                )}
            </div>
        );
    }
}