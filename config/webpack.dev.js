/*
 * @Date: 2020-08-19 17:55:05
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-19 18:33:44
 * @FilePath: \react-ts-template\config\webpack.dev.js
 */
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        host: '127.0.0.1', // 指定 host，不设置的话默认是 localhost
        port: 9000, // 指定端口，默认是8080
        stats: 'errors-only', // 终端仅打印 error
        clientLogLevel: 'silent', // 日志等级
        compress: true, // 是否启用 gzip 压缩
        open: true, // 打开默认浏览器
        hot: true, // 热更新
    },
    devtool: 'eval-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]
})
