const path = require('path')
const isDev = process.env.NODE_ENV !== 'production'

//打包完自动插入到html中
const HtmlWebpackPlugin = require('html-webpack-plugin')
//打包进度条
const WebpackBar = require('webpackbar')
//编译时的 Typescirpt 类型检查
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
//加快二次编译速度，提供了中间缓存
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const baseCssLoader = [
    'style-loader',
    {
        loader: 'css-loader',
        options: {
            modules: false, // 默认就是 false, 若要开启，可在官网具体查看可配置项
            sourceMap: isDev, // 开启后与 devtool 设置一致, 开发环境开启，生产环境关闭
            importLoaders: 0, // 指定在 CSS loader 处理前使用的 laoder 数量
        },
    },
    {
        loader: 'postcss-loader',
        options: {
            ident: 'postcss',
            plugins: [
                require('postcss-flexbugs-fixes'),//用于修复一些和 flex 布局相关的 bug
                require('postcss-preset-env')({//最新的 CSS 语法转换为目标环境的浏览器能够理解的 CSS 语法
                    autoprefixer: {
                        grid: true,
                        flexbox: 'no-2009'
                    },
                    stage: 3,
                }),
                require('postcss-normalize'),//从 browserslist 中自动导入所需要的 normalize.css 内容
            ],
            sourceMap: isDev,
        },
    }
]
const cssRule = {
    test: /\.css$/,
    use: [...baseCssLoader],
}
const lessRule = {
    test: /\.less$/,
    use: [
        ...baseCssLoader,
        {
            loader: 'less-loader',
            options: {
                sourceMap: isDev,
            },
        },
    ],
}
const scssRule = {
    test: /\.scss$/,
    use: [
        ...baseCssLoader,
        {
            loader: 'sass-loader',
            options: {
                sourceMap: isDev,
            },
        },
    ]
}

const fileRule = [
    {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 10 * 1024,//表示如果你这个图片文件大于 10240b ，即 10kb ，那我 url-loader 就不用，转而去使用 file-loader 
                    name: '[name].[contenthash:8].[ext]',
                    outputPath: 'assets/images',
                },
            },
        ],
    },
    {
        test: /\.(ttf|woff|woff2|eot|otf)$/,
        use: [
            {
                loader: 'url-loader',
                options: {
                    name: '[name].[contenthash:8].[ext]',//表示输出的文件名为 原来的文件名.哈希值.后缀 ，有了这个 hash 值，可防止图片更换后导致的缓存问题
                    outputPath: 'assets/fonts',// 是输出到 dist 目录下的路径，即图片目录 dist/assets/images 以及字体相关目录 dist/assets/fonts 下。
                },
            },
        ],
    }
]

const babelRule = {
    test: /\.(tsx?|js)$/,
    loader: 'babel-loader',
    //babel-loader 在执行的时候，可能会产生一些运行期间重复的公共文件，造成代码体积大冗余，
    //同时也会减慢编译效率，所以我们开启 cacheDirectory 将这些公共文件缓存起来，下次编译就会加快很多。
    options: { cacheDirectory: true },
    exclude: /node_modules/,
}


module.exports = {
    mode: "development",
    entry: {
        app: path.resolve(__dirname, '../src/index.tsx'),
    },
    output: {
        filename: `js/[name]${isDev ? '' : '.[hash:8]'}.js`,
        path: path.resolve(__dirname, '../dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'),
            filename: 'index.html',
            cache: false, // 特别重要：防止之后使用v6版本 copy-webpack-plugin 时代码修改一刷新页面为空问题。
            minify: isDev ? false : {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
                removeComments: true,
                collapseBooleanAttributes: true,
                collapseInlineTagWhitespace: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                minifyCSS: true,
                minifyJS: true,
                minifyURLs: true,
                useShortDoctype: true,
            },
        }),
        new WebpackBar({
            name: isDev ? '正在启动' : '正在打包',
            color: '#fa8c16',
        }),
        // new ForkTsCheckerWebpackPlugin({
        //     typescript: {
        //         configFile: path.resolve(__dirname, '../tsconfig.json'),
        //     },
        // }),
        new HardSourceWebpackPlugin(),
    ],
    //loader处理
    module: {
        rules: [cssRule, lessRule, scssRule, ...fileRule, babelRule]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, '../src')
        }
    },
    // external 减少打包体积
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: true,
        },
    },
}
