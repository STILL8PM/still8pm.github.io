import React from 'react'
import { Layout, Menu } from 'antd';
import './index.css'
import ReactMarkdown from 'react-markdown'
const markdownText = `# React 全家桶：


- React基础
- React - router 路由
- PubSub 消息管理
- Redux 集中式状态管理
- Ant - Desgin 精美的UI组件库

##     定义：用于构建用户界面（视图）的JavaScript的库

1.  操作DOM呈现页面
2.  React是一个将数据渲染成为HTML视图的开源JavaScript库，由facebook软件工程师开发且开源，近十年以来，正被一线大厂所使用
3. 原生JavaScript操作DOM繁琐效率低（dom-api操作ui）
4. 使用JavaScript直接操作dom。浏览器会进行大量重绘重排
5. 原生JavaScript没有组件化编码方案，代码复用率低
6. html、css、js  单独一个文件为模块化。组件化还得拆开
7. document.getElementById("app")

# React 特点：

1、采用组件化模式，声明式编码（所有语言的趋势），提高开发效率及组件复用率
2、在React Native中可以使用React语法进行移动端开发。 使用js开发安卓即ios应用
3、使用虚拟DOM + 优秀的Diffing算法，尽量减少与真实DOM的交互

中文官网：https://react.docschina.org/

# react 高效原因：
1. 使用虚拟DOM，不总直接- 操作页面真实DOM
2. DOM Diffing算法，最小化页面重绘

# 依赖包：

### babel.min.js
- ES6 ==> ES5
- jsx ==> js
- import 模块化引入

### react - development.js
react核心库


### react - dom.development.js
react扩展库


# 为什么使用 jsx，不用原生 js

创建虚拟DOM更为方便简化，jsx是js创建虚拟DOM的简便写法

创建虚拟DOM
jsx: const VDOM = (<h1 id='title'><span>Hello,React</span></h1>)
等同于
js: const VDOM = React.createElement('h1', { id: 'title' }, React.createElement('span', '', 'hello react'))
# 关于虚拟 DOM：

1. 本质是Object类型的对象（一般对象）
2. 虚拟DOM比较‘轻’，真实DOM比较‘重’，因为虚拟DOM是React内部在用，无需真实DOM上那么多的属性
3. 虚拟DOM最终会被React转化为真实DOM。呈现到页面上

# jsx：

全称：javascript XML
react定义的一种类似XML的js扩展语法:JS-XML

XML:早期用于存储和传输数据

XML:

    <student>
        <name>tom</name>
        <age>19</age>
    </student>

JSON:

"{"name":"tom","age":"19"}"


JSON.parse()方法--快速解析json字符串成js中对应的数组和对象
JSON.stringify()方法--快速将js中的数组和对象转为json字符串
    

# jsx 语法规则：


1. 定义虚拟DOM时，不要写引号
2. 标签中混入js表达式时要用{ }
3. 样式的类名指定不要用class，要用className
4. 内联样式要用style = {{ key: value }}的形式去写
5. 虚拟DOM只有一个根标签
6. 标签必须闭合，没有标签闭合使用 /, < input type = "text" /> 自闭合
7. 标签首字母
若小写字母开头，则将该标签转为html中同名元素。若html无同名元素，则报错
若大写字母开头，react就去渲染对应的组件，若组件没有对应，则报错


# 模块

理解: 向外提供特定功能的程序, 一般就是一个js文件
为什么要拆成模块: 随着业务逻辑增加, 代码越来越多越复杂

作用: 复用js, 简化js的编写, 提高js运行效率

# 组件

理解: 用来实现局部功能效果的代码和资源的集合(html, css, js, iamge等等)
为什么: 整个界面的功能更复杂

作用: 复用代码, 简化项目编码, 提高运行效率

模块化: 当应用的js都以模块来编写, 这就是一个模块化的应用
组件化: 当应用是以组件的方式实现, 这就是一个组件化的应用

简单组件：无状态（state）
复杂组件：有状态（state）

组件-- > 存在 > --状态--> 驱动 > --行为

组件三大属性：state, props, refs与事件处理

# state：

理解：state是组件对象的重要属性，值是对象（可以包含多个key - value的组合），组件被称为“状态机”，通过更新组件的state来更新对应的页面显示（重新渲染组件）

强烈注意：
组件中render方法中this为组件实例对象
组件自定义的方法中this为underfined，如何解决
强制绑定this，通过函数对象的bind（）如： this.ChangeWeather = this.ChangeWeather.bind(this)
箭头函数
状态数据，不能直接修改或更新


# props:

理解：每个组件对象都会有props（properties的简写）属性
组件标签的所有属性都保存在props中

作用：
通过标签属性从组件外向组件内传递变化的数据
注意：组件内部不要修改props数据（因为只读）

编码操作：
内部读取某个属性值
this.props.name

使用prop - types库进行限制（需要引入prop - types库）
Person.propTypes = {
    name: PropTypes.string.isRequired,//限制name必传且为字符串
    sex: PropTypes.string,//限制sex为字符串
}

扩展属性：将对象的所有属性通过props传递
    < Person{...person } />

默认属性值
Person.defailtProps = {
    age：18，
    sex：'男'
        }
    

# refs：


编码：
字符串形式的ref
    < input ref = "input1" />


        回调形式的ref
        < input ref = {(c)=> { this.input1 = c }}/>

createRef创建ref容器
myRef = React.createRef()
    < input ref = { this.myRef } />

# 事件处理:

1.通过onXxx属性指定事件处理函数(注意大小写)
- React使用的是自定义(合成)事件，而不是使用的原生DOM事件————为了更好的兼容性
- React中的事件是通过事件委托方式处理的(委托给组件最外层的元素）————为了高效

2.通过event.target得到发生事件的DOM元素对象————不要过度使用ref

# 收集表单数据：

    包含表单的组件分类：
        受控组件
        非受控组件

# 组件的生命周期

    理解：
        1. 组件对象从创建到死亡它会经历特定阶段。
        2. React 组件对象包含一系列钩子函数(生命周期回调函数),在特定的时刻调用。
        3. 我们在定义组件时,在特定的生命周期回调函数中,做特定的工作。

    挂载卸载：
        当 Clock 组件第一次被渲染到 DOM 中的时候，就为其设置一个计时器。这在 React 中被称为“挂载（mount）”。

        同时，当 DOM 中 Clock 组件被删除的时候，应该清除计时器。这在 React 中被称为“卸载（unmount）”。

# 生命周期三个阶段（旧）


1.初始化阶段: 由ReactDOM.render(触发-- - 初次渲染
        1.constructor()
        2.componentWillMount()
        3.render()
        4.componentDidMount() =====> 常用
            一般在这个钩子中做一些初始化的事，例如：开启定时器、发送网络请求、订阅消息
    


    2.更新阶段：由组件内部 this.setSate()或父组件重新 render 触发
        1.shouldComponentUpdate()
        2.componentWillUpdate()
        3.render()
        4.componentDidUpdate()
    


    3.卸载组件：由ReactDOM.unmountComponentAtNode()触发
        1.componentWillUnmount() =====> 常用
            一般在这个钩子中做一些收尾的事，例如：关闭定时器、取消订阅消息
    

# 生命周期三个阶段（新）


    1．初始化阶段：由ReactDOM.render()触发-- - 初次渲染
        1. constructor()
        2. getDerivedStateFromProps
        3．render(）
        4.componentDidMount() =====> 常用
            一般在这个钩子中做一些初始化的事，例如：开启定时器、发送网络请求、订阅消息
        


    2．更新阶段：由组件内部this.setSate()或父组件重新render触发
        1. getDerivedStateFromProps
        2. shouldComponentUpdate()
        3. render(）
            4. getsnapshotBeforeUpdate
        5. componentDidUpdate()
            


    3．卸载组件：由ReactDOM.unmountComponentAtNode()触发
        1.componentWillUnmount() =====> 常用
            一般在这个钩子中做一些收尾的事，例如：关闭定时器、取消订阅消息
            


    重要的钩子
        1.render 初始化渲染或更新渲染调用
        2.compontentDidMount 开启监听，发送ajax请求
        3.componentWillUnmount 做些收尾的工作，如：清理定时器

    即将废弃的钩子
        1.componentWillMount
        2.componentWillReceiveProps
        3.componentWillUpdate
        现在使用会出现警告，下一个大版本需要加上UNSAFA_前缀才能使用，以后可能会被彻底的弃用，不建议使用
            

# 经典面试题：

         1）．react/vue中的key有什么作用？（key的内部原理是什么？）
         2）．为什么遍历列表时，key最好不要用index？

## 1．虚拟 DOM 中 key 的作用：

         1).简单的说：key是虚拟DOM对象的标识，在更新显示时key起着极其重要的作用。

         2).详细的说：当状态中的数据发生变化时，react会根据【新数据】生成【新的虚拟DOM】，
            随后React进行【新虚拟DOM】与【旧虚拟DOM】的diff比较，比较规则如下：

               a.旧虚拟DOM中找到了与新虚拟DOM相同的key：
                  (1).若虚拟DOM中内容没变，直接使用之前的真实DOM
                  (2).若虚拟DOM中内容变了，则生成新的真实DOM，随后替换掉页面中之前的真实DOM

               b．旧虚拟DOM中未找到与新虚拟DOM相同的key
                     根据数据创建新的真实DOM，随后渲染到到页面

## 2. 用 index 作为 key 可能会引发的问题：

         1. 若对数据进行：逆序添加、逆序删除等破坏顺序操作：
               会产生没有必要的真实DOM更新 ==> 界面效果没问题，但效率低。

         2.如果结构中还包含输入类的DOM：
               会产生错误DOM更新 ==> 界面有问题。

         3. 注意！如果不存在对数据的逆序添加、逆序删除等破坏顺序操作，
               仅用于渲染列表用于展示，使用index作为key是没有问题的。

## 3.开发中如何选择 key：

         1.最好使用每天数据的唯一标识作为key，比如id、手机号，身份证号，学号等唯一值
         2.如果确定只是简单的展示数据，用index也是可以的

# react 脚手架

    1.xxx 脚手架：用来帮助程序员快速创建一个基于xxx 库的模板项目
        1. 包含了所有需要的配置（语法检查、jsx编译、devServer...)
        2. 下载好了所有相关的依赖
        3.可以直接运行一个简单效果

    2. react 提供了一个用于创建 react 项目的脚手架库: create-react-app
    3. 项目的整体技术架构为:react + webpack + es6 + eslint
    4. 使用脚手架开发的项目的特点: 模块化, 组件化, 工程化

# react 脚手架

    1.xxx 脚手架：用来帮助程序员快速创建一个基于xxx 库的模板项目
        1. 包含了所有需要的配置（语法检查、jsx编译、devServer...)
        2. 下载好了所有相关的依赖
        3.可以直接运行一个简单效果

    2. react 提供了一个用于创建 react 项目的脚手架库: create-react-app
    3. 项目的整体技术架构为:react + webpack + es6 + eslint
    4. 使用脚手架开发的项目的特点: 模块化, 组件化, 工程化

# react 脚手架项目结构


public--------静态资源文件夹
favicon.icon--------网站页签图标
index.html----------主页面 ===========
    logo192.png--------- logo 图
logo512.png--------- logo 图
manifest.json------- 应用加壳的配置文件
robots.txt----------爬虫协议文件
    


src------------源码文件夹
App.css------------- App组件的样式
App.js--------------App组件 ===========
    App.test.js--------- 用于给 App 做测试
index.css----------- 样式
index.js------------入口文件 ===========
    logo.svg------------logo 图
reportWebVitals.j-- - 页面性能分析文件（需要web - vitals库的支持）
setupTests.js------- 组件单元测试的文件（需要jest - dom库支持）


# 项目启动顺序：

    index.js
        引入React的核心库，react-DOM，index.css样式，引入app组件

        触发ReactDOM.render(<React.StrictMode><App /></React.StrictMode>,document.getElementById('root'));

        去寻找pubic下index.html文件的中root节点进行渲染到页面

    app.js
        引入app.css样式

# 功能界面的组件化编码流程

    1.拆分组件：拆分界面,抽取组件

    2.实现静态组件：使用组件实现静态页面效果

    3.实现动态组件
        1）动态显示初始化数据
            数据显示
            数据名称
            保存在哪个组件
        2）交互(从绑定事件监听开始)

# 一、todoList 案例相关知识点

    1.拆分组件、实现静态组件，注意：className、style的写法

    2.动态初始化列表，如何确定将数据放在哪个组件的state中？
        ———某个组件使用：放在自身的state中
        ———某些组件使用：放在他们共同的父组件state中（官方称此操作为：状态提升）

    3.关于父子之间通信：
        1.【父组件】给【子组件】传递数据：通过props传递
        2.【子组件】给【父组件】传递数据：通过props传递，要求父提前给子传递一个函数

    4.注意defaultChecked 和 checked的区别，类似的还有：defaultValue 和 value

    5.状态在哪里，操作状态的方法就在哪里

# react ajax

    一、前置说明
       1. React 本身只关注于界面, 并不包含发送 ajax 请求的代码•
       2. 前端应用需要通过ajax请求与后台进行交互(json数据)
       3. react 应用中需要集成第三方 ajax 库(或自己封装)

    二、常用的ajax请求库
       1.jQuery:
          比较重,如果需要另外引入不建议使用。

       2.axios: 轻量级,建议使用
          1）封装XmlHttpRequest对象的ajax
          2)promise 风格
          3)可以用在浏览器端和 node 服务器端

    三、ajax请求
       原生xhr对象
          现代浏览器，最开始与服务器交换数据，都是通过XMLHttpRequest对象。
          它可以使用JSON、XML、HTML和text文本等格式发送和接收数据。

             var xhr = new XMLHttpRequest();
             xhr.open('GET', url);
             xhr.responseType = 'json';

             xhr.onload = function() {
             console.log(xhr.response);
             };

             xhr.onerror = function() {
             console.log("Oops, error");
             };

             xhr.send();

          好处：
             不重新加载页面的情况下更新网页
             在页面已加载后从服务器请求/接收数据
             在后台向服务器发送数据。
          缺点：
             使用起来也比较繁琐，需要设置很多值。
             早期的IE浏览器有自己的内置对象，这样需要写兼容代码判断是否为XMLHttpRequest对象。

        jQuery里的$.ajax
          为了方便操作dom并避免一些浏览器兼容问题，产生了jquery，
          它里面的AJAX请求也兼容了不同的浏览器，可以直接使用.get、.pist。它就是对XMLHttpRequest对象的一层封装
          优点：
             对原生XHR的封装，做了兼容处理，简化了使用。
             增加了对JSONP的支持，可以简单处理部分跨域。
          缺点：
             如果有多个请求，并且有依赖关系的话，容易形成回调地狱。
             本身是针对MVC的编程，不符合现在前端MVVM的浪潮。
             ajax是jQuery中的一个方法。如果只是要使用ajax却要引入整个jQuery非常的不合理。

        axios
          Axios是一个基于promise的HTTP库，可以用在浏览器和 node.js 中。
          它本质也是对原生XMLHttpRequest的封装，只不过它是Promise的实现版本，符合最新的ES规范。
          优点：
             从浏览器中创建XMLHttpRequests
             从 node.js 创建 http 请求
             支持 Promise API
             拦截请求和响应
             转换请求数据和响应数据
             取消请求
             自动转换 JSON 数据
             客户端支持防止CSPRF
             提供了一些并发请求的接口

          缺点：
             只持现代代浏览器.

        fetch
          Fetch API提供了一个 JavaScript 接口，用于访问和操作HTTP管道的部分，例如请求和响应。
          它还提供了一个全局fetch()方法，该方法提供了一种简单，合理的方式来跨网络异步获取资源。
          fetch是低层次的API，代替XHR，可以轻松处理各种格式，非文本化格式。
          可以很容易的被其他技术使用，例如Service Workers。但是想要很好的使用fetch，需要做一些封装处理。
            fetch(url).then(function(response) {
                   return response.json();
                }).then(function(data) {
                   console.log(data);
                }).catch(function(e) {
                   console.log("Oops, error");
                });
          使用 ES6 的 箭头函数 后：
            fetch(url).then(response => response.json())
             .then(data => console.log(data))
             .catch(e => console.log("Oops, error", e))
          文档：
             https://github.github.io/fetch/
             https://segmentfault.com/a/1190000003810652
          特点：
             1. fetch: 原生函数，不再使用 XmlHttpRequest 对象提交 ajax 请求
             2. 老版本浏览器可能不支持

# 消息订阅-发布机制

    1.工具库：PubSubJS
    2.下载：npm install pubsub-js --save
    3.使用：
        1)  import PubSub from 'pubsub-js' //引入
        2)  PubSub.subscribe('delete’function(data){ }); //订阅
        3)  PubSub.publish("delete’, data) //发布消息


        # react 脚手架配置代理总结

## 方法一

> 在 package.json 中追加如下配置

json
"proxy": "http://localhost:5000"
    

说明：

1. 优点：配置简单，前端请求资源时可以不加任何前缀。
2. 缺点：不能配置多个代理。
3. 工作方式：上述方式配置代理，当请求了 3000 不存在的资源时，那么该请求会转发给 5000 （优先匹配前端资源）

## 方法二

1. 第一步：创建代理配置文件


在src下创建配置文件：src / setupProxy.js
    

2. 编写 setupProxy.js 配置具体代理规则：
    js
const proxy = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        proxy("/api1", {
            //api1是需要转发的请求(所有带有/api1前缀的请求都会转发给5000)
            target: "http://localhost:5000", //配置转发目标地址(能返回数据的服务器地址)
            changeOrigin: true, //控制服务器接收到的请求头中host字段的值
            /*
                changeOrigin设置为true时，服务器收到的请求头中的host为：localhost:5000
                changeOrigin设置为false时，服务器收到的请求头中的host为：localhost:3000
                changeOrigin默认值为false，但我们一般将changeOrigin值设为true
            */
            pathRewrite: { "^/api1": "" }, //去除请求前缀，保证交给后台服务器的是正常请求地址(必须配置)
        }),
        proxy("/api2", {
            target: "http://localhost:5001",
            changeOrigin: true,
            pathRewrite: { "^/api2": "" },
        })
    );
};


说明：

1. 优点：可以配置多个代理，可以灵活的控制请求是否走代理。
2. 缺点：配置繁琐，前端请求资源时必须加前缀。


# React 路由

## 相关理解

### SPA 的理解

    单页Web应用（single page web application,SPA)
    整个应用只有一个完整的页面
    点击页面中的链接不会刷新页面，只会做页面的局部更新
    数据都需要通过 ajax 请求获取, 并在前端异步展现

### 路由的理解

    什么是路由？
        一个路由就是一个映射关系(key:value)
        key 为路径, value 可能是 function 或 component

### 路由的分类

    后端路由：
        理解： value 是 function, 用来处理客户端提交的请求
        注册路由：App.get(path, function(req, res))
        工作过程：当 node 接收到一个请求时，根据请求路径找到匹配的路由，调用路由中的函数来处理请求, 返回响应数据

    前端路由：
        浏览器端路由，value 是 component，用于展示页面内容
        注册路由: <Route path="/test" component={Test}>
        工作过程：当浏览器的 path 变为/test 时，当前路由组件就会变为 Test 组件

### react-router-dom 的理解

    react的一个插件库
    专门用来实现一个SPA应用
    基于react的项目基本都会用到此库

## react-router-dom 相关 API

### 内置组件


    < BrowserRouter >
    <HashRouter>
    <Route>
    <Redirect>
    <Link>
    <NavLink>

### 其他

`

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

const rootSubmenuKeys = ['sub1', 'sub2', 'sub3', 'sub4'];
const Vued = () => {
    const [openKeys, setOpenKeys] = React.useState(['sub1']);
    const onOpenChange = keys => {
        const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };
    const list = {
        vue_basic: ['01_初识Vue', '02_Vue模板语法', '03_数据绑定', '04_el与data的两种写法', '05_MVVM模型', '06_数据代理', '07_事件处理', '08_计算属性', '09_监视属性', '10_绑定样式', '11_条件渲染', '12_列表渲染', '13_收集表单数据', '14_过滤器', '15_内置指令', '16_自定义指令', '17_生命周期', '18_非单文件组件', '19_单文件组件'],
        vue_test: ['01_src_分析脚手架', '02_src_ref)属性', '03_src_props配置', '04_src_mixin混入（合）', '05_src_插件', '06_src_scoped样式', '07_src_TodoList案例', '08_src_浏览器本地存储', '09_src_TodoList本地存情', '10_src_组件自定义事件', '11_src_TodoList自定义事件', '12_src_全局事件总线', '13_src_TodoList事件总线', '14_src_消息订阅与发布', '15_src_TodoList_pubsub', '16_src_TodoList_nextTick', '17_src_过渡与动画', '18_src_TodoList动画', '19_src_配置代里服务器', '20_src_github搜索案例', '21_src_github搜索案例_vue-resource', '22插槽1_src_默认插槽', '22插槽2_src_具名插槽', '22插槽3_src_作用域插槽', '23_src_求和案例纯vue版', '24_src_求和案例_vuex版', '25_src_求和案例_getters',],
        vue3_test: [],
        vue3_test_vite: []
    }
    return (

        <Layout>
            {/* <Sider>
                <Menu mode="inline" openKeys={openKeys} onOpenChange={onOpenChange} style={{ width: 200 }}>
                    <SubMenu key="sub1" title="vue_basic">
                        {
                            Object.values(list)[0].map((v, i) => {
                                return <Menu.Item key={'sub1' + i}>{v}</Menu.Item>
                            })
                        }
                    </SubMenu>
                    <SubMenu key="sub2" title="vue3_test">
                        {
                            Object.values(list)[1].map((v, i) => {
                                return <Menu.Item key={'sub2' + i}>{v}</Menu.Item>
                            })
                        }
                    </SubMenu>
                    <SubMenu key="sub3" title="vue3_test">
                        {
                            Object.values(list)[2].map((v, i) => {
                                return <Menu.Item key={'sub3' + i}>{v}</Menu.Item>
                            })
                        }
                    </SubMenu>
                    <SubMenu key="sub4" title="vue3_test_vite">
                        {
                            Object.values(list)[3].map((v, i) => {
                                return <Menu.Item key={i}>{v}</Menu.Item>
                            })
                        }
                    </SubMenu>
                </Menu>
            </Sider> */}
            <Content>
                <div>
                    <ReactMarkdown children={markdownText} className="markdown-html" />
                </div>
            </Content>
        </Layout>

    );
};
export default Vued
