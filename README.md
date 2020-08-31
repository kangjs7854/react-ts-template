# 为什么需要这样一个mock的平台？

在项目的开发过程中，接口的联调是至关重要的一环，但是我们会遇到很多不可控的情况，例如前后端开发进度不一样，所需要的数据字段不够明确，这个时候就需要接口mock，在前后端的开发者拟定好协议，整理好所需要的数据字段之后快速进行接口mock，在正式联调接口时以更高的效率交付产品。

使用当前比较流行的mock的库，类似于yapi，mockjs等等，我们团队目前使用的是api fox，一个比较新的拟定接口协议，管理接口文档，进行接口mock的桌面端工具。

但是很快我就遇到了这几个问题：

1. **mock返回无意义的数据**  
使用第三方的mock功能，返回的数据字段大部分都是一堆没有意义的字符串，虽然能理解这是为了能够快速进行接口mock，但确实不够优雅  

    解决方法：开发自己的node服务

2. **如何快速开发curd的接口**    
作为前端开发的人员，选择使用node来开发服务特别合适，不需要去学习额外的编程语言，而且可以扩展自己在网络数据库之类的知识面，可以更加全面的去思考业务  

    解决方法：通过封装增删改查的controller，实现了只要传入所需的数据名称和类型，就可以生成增删改查的restful风格的api。
    具体实现可以查看这个项目：![node-server-template](https://github.com/kangjs7854/node-server-template)


3. **在移动端项目接口无法使用**  
这是因为node服务始终还是一个本地运行的web服务器，需要通过部署到线上来实现移动端也可以访问，虽然可以通过笔记本和手机连同一个局域网实现该功能，但还是不够快捷方便。  

    解决方法：通过部署node服务到线上服务器

4. **每次增加接口都要在修改代码后重新部署**  

    解决方法：搭一个可视化配置数据名称，数据类型，传入默认值，然后就能返回响应数据的平台

5. **如何实现**   
一般情况下，要操作数据库得通过下面几个步骤
- 定义模式Schema,描述数据的结构和行为
- 通过模式生成数据的模型，基本上对数据库的操作都要通过该模型
- 通过模型进行增删改查的操作  

    所以我们的难点在于：如何动态定义模式，也就是定义我们所需要字段的名称，数据类型。  
    查阅了mongoose的文档之后发现，确实可以通过动态生成数据的模式。那接下来的事情就比较简单了  

    解决方法：在前端将所需要的Schema的字段名称和类型作为参数的一部分传入到node服务端，服务端接收到后调用```Schema原型上的add方法```动态添加数据结构，再通过生成数据模型，将其作为参数传入给封装好的controller类，生成快速进行增删改查的实例

```js
//核心代码
   const {Schema,uniqueKey} = req.body
   const query = { [uniqueKey]:req.body[uniqueKey] } //匹配条件,根据什么字段进行插入或者更新
   const payload = { ...req.body } //内容
   const modelName = req.originalUrl.slice(10)
   //动态添加schema的字段和数据类型
   mockSchema.add(Schema)
   //再生成模型
   const mockModel = mongoose.model(modelName,mockSchema)
   //传入该模型生成控制器
   const mockController = new Controller(mockModel)
   const data = await mockController.insert(query, payload)
   res.json({data})

```



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
装饰器的写法特别的优雅简洁，使用起来很方便

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
