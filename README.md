<!--
 * @Date: 2020-08-20 09:50:07
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-20 10:03:55
 * @FilePath: \react-ts-template\README.md
-->
# react+ts的项目模板
> 本想使用umi来快速生成项目模板，开发自己一个mock api的平台，但是umi实在太重了，而且很多东西都是目前不需要的。就从零开始自己配置一个，也顺便复习一下webpack

# webpack

项目把webpack的相关配置放在了```config```文件夹。主要分为三个配置
- webpack.common.js 
- webpack.dev.js
- webpack.prod.js

对开发和生产环境的配置进行了区分，更好的使用webpack优化代码的打包及编译效率。
在引入各个加载器或者插件时也添加了较为详细的注释，就不一一赘述。

# react

react的配置基本就是引入两个库及使用配置babel进行语法转换，让使用tsx或其他高级的特性能够得到浏览器的支持。

这里有一个优化的细节：每次的编译和打包都会把```react```核心库一起引入打包，降低了编译的和打包的速度，浪费了效率。其实可以在生产环境使用```cdn```引入，其他情况就使用webpack的```externals```减少打包体积。

# ts

ts的安装比较简单，直接使用```npm ```包安装完成后新建```tsconfig```文件夹进行配置即可。
在```.babelrc```文件也要添加ts的语法支持 ```"presets": ["@babel/preset-typescript" ]```
```
{
    "compilerOptions": {
      // 基本配置
      "target": "ES5",                          // 编译成哪个版本的 es
      "module": "ESNext",                       // 指定生成哪个模块系统代码
      "lib": ["dom", "dom.iterable", "esnext"], // 编译过程中需要引入的库文件的列表
      "allowJs": true,                          // 允许编译 js 文件
      "jsx": "react",                           // 在 .tsx 文件里支持 JSX
      "isolatedModules": true,
      "strict": true,                           // 启用所有严格类型检查选项
  
      // 模块解析选项
      "moduleResolution": "node",               // 指定模块解析策略
      "esModuleInterop": true,                  // 支持 CommonJS 和 ES 模块之间的互操作性
      "resolveJsonModule": true,                // 支持导入 json 模块
      "baseUrl": "./",                          // 根路径
      "paths": {                                                              // 路径映射，与 baseUrl 关联
        "Src/*": ["src/*"],
        "Components/*": ["src/components/*"],
        "Utils/*": ["src/utils/*"]
      },
  
      // 实验性选项
      "experimentalDecorators": true,           // 启用实验性的ES装饰器
      "emitDecoratorMetadata": true,            // 给源码里的装饰器声明加上设计类型元数据
  
      // 其他选项
      "forceConsistentCasingInFileNames": true, // 禁止对同一个文件的不一致的引用
      "skipLibCheck": true,                     // 忽略所有的声明文件（ *.d.ts）的类型检查
      "allowSyntheticDefaultImports": true,     // 允许从没有设置默认导出的模块中默认导入
      "noEmit": true                                                      // 只想使用tsc的类型检查作为函数时（当其他工具（例如Babel实际编译）时）使用它
    },
    "exclude": ["node_modules"]
  }
  
```

