/*
 * @Date: 2020-08-19 17:56:58
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-19 18:03:15
 * @FilePath: \react-ts-template\config\webpack.prod.js
 */
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = merge(common, {
    mode: 'production',
    devtool: 'none',
    plugins: [
        new CleanWebpackPlugin(),
    ],
})
