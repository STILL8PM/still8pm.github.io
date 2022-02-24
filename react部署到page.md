方法一：官方方案
抱怨：这里不得不说，官方的方案是真的有坑，按照步骤来，发现根本无法成功， npm run build 之后页面空白， npm run deploy 之后一直卡在终端，几个小时也不动。由于设备原因，我也无法排除是不是自身电脑或网络的问题，我暂且把官方的方法给大家理一下，可以一试。

1.安装 gh-pages
在我的项目之下打开终端，输入以下命令安装
npm install gh-pages


2.修改 package.json
修改"homepage" 和 "scripts"


  "homepage": "./",
  "dependencies": {},


  "scripts": {
    "deploy": "gh-pages -d build"
  },

这里请注意了，官方介绍是"homepage"的值要设置为 http://{username}.github.io/{repo-name} ，比如我当前的就是 http://vortesnail.github.io/qier-player-demo ，但是这样操作会在 build 打的包会在所有文件路径前加上 qier-player-demo ，比如 index.html 文件中对同等目录下的文件引用应该是 src='./index.css' ，结果会变成 src='./react_demo/index.css' ，这样部署后肯定无法访问，所有资源都找不到。
3.开始部署
Github Pages 无法识别 React 代码，只能识别 html,css,js，故你需要先打包编译你的项目：

npm run build
你会发现你的项目目录多了一个 build 文件夹，这就是要部署的文件夹，终端执行以下代码：

npm run deploy
这时 github 上项目就多出了一个gh-pages的branch，在设置中Github Pages处选择gh-pages分支保存，部署完成。过几分钟你再点击生成的链接即可访问你的页面，与线下环境下的页面相同即成功。详情如下：