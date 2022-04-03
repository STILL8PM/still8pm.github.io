# React项目部署到page

## 1.安装 gh-pages

```cmd
  在我的项目之下打开终端，输入以下命令安装
  npm install gh-pages
```

## 2.修改 package.json

```json
修改"homepage" 和 "scripts"

  "homepage": "./",
  "dependencies": {},

  "scripts": {
    "deploy": "gh-pages -d build"
  },
```

## 3.开始部署

```text
Github Pages 无法识别 React 代码，只能识别 html,css,js，故你需要先打包编译你的项目：

npm run build

你会发现你的项目目录多了一个 build 文件夹，这就是要部署的文件夹，终端执行以下代码：

npm run deploy

这时 github 上项目就多出了一个gh-pages的branch，在设置中Github Pages处选择gh-pages分支保存，部署完成。过几分钟你再点击生成的链接即可访问你的页面，与线下环境下的页面相同即成功。
```
