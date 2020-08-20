<!--
 * @Date: 2020-08-20 09:50:07
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-20 10:07:47
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


