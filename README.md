<!--
 * @Date: 2020-08-20 09:50:07
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-20 10:09:18
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

# mobx
之前也使用过redux，特别的繁琐和麻烦，所以大部分情况下项目能不使用就尽量不使用。这次试了一下的mobx，装饰器的写法特别的优雅简洁，依赖注入的思想也特别的高级。

1. 定义store，使用一个计数器来作为入门例子

这里要理解几个api
- observable 可观察对象，使用其声明需要mobx去观察并给出响应的变量
- action 要改变变量应该通过action来改变，这里和vuex很相似
- decorate 装饰器，可以使用@的写法，其实@本质上就是一个高阶函数，将传入的函数作为参数，对其进行处理加工后再返回。推荐使用@的写法，特别的优雅，但是要配置babel对其进行转译。
```js
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

```

2. 注册
在定义了这个count的store之后我们需要将其与我们的react应用连接起来，这里就要使用到```mobx-react```这个库提供的```Provider```这里和redux很相似。
包裹了我们的app应用容器，我们就可以这个应用下所有子组件中使用我们注册后的```countStore```
```js
import { Provider } from "mobx-react";
import CountStore from '@/store/count'

const stores={
  countStore:new CountStore(),
}

ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.querySelector("#root")
);

```

3. 注入
这里mobx提供了一个```inject```api,我们可以在我们想要使用store的任何一个类组件，注入我们想要的```countStore```，然后在内部调用它。
这个```observer```api是将这个类组件声明成一个观察者，响应mobx的数据变化
假设我们要在```Counter```这个组件使用我们的store
```js
import { observer, inject } from "mobx-react";
import { Button } from "antd";

@inject("countStore")
@observer
export default class Counter extends Component {
  constructor(props) {
    super(props)
  }

  handleIncrease = () => {
    this.props.countStore.increase()
  }

  handleDecrease = () => {
    this.props.countStore.decrease()
  }
  render() {
    const { count } = this.props.countStore

    return (
      <div>
        <Button onClick={this.handleDecrease}>-</Button>{count}<Button onClick={this.handleIncrease}>+</Button>
      </div>
    );
  }
}

```

在类组件注入之后，```mobx```就会这个注入的名称去查找之前注册的```store```，然后我们就可以在这个组件内部使用```props```去调用他。

4. hooks中使用mobx

函数式组件没有类，我们就不能用装饰器的语法去注入我们的store、声明我们的观察者。

这里使用两个新的api
- MobXProviderContext 
- useObserver 

```js
import React, { useContext} from "react";
import { MobXProviderContext } from "mobx-react";

function Counter(){
    //hook结合mobx
  const {countStore} = useContext(MobXProviderContext)

  const handleDecrease = ()=>{
    countStore.increase()
  }

  const handleIncrease = ()=>{
    countStore.decrease()
  }
  return (
      <div>
        <Button onClick={handleDecrease}>-</Button>{countStore.count}<Button onClick={handleIncrease}>+</Button>
      </div>
    );
}

```

hook结合mobx也十分的简洁优雅，真的特别好的一个状态管理容器。当然还有其他的api和功能没有使用到，在后续也会继续的摸索尝试。
