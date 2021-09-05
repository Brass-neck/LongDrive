## 前言

我们使用过很多脚手架工具和打包工具，类似 vue cli、webpack、
create-react-app 等等，安装完成后，我们就可以使用 vue create、ng generate 等全局命令，这是为什么呢？

奥秘就在于 package.json 中的 bin 字段

## 配置 package.json 中的 bin 字段

```json
// 全局gogo命令的可执行文件是./index.js"
{
  "bin": {
    "gogo": "./index.js"
  }
}
```

## 全局包

要想使用全局命令，需要将包做成一个全局包，通过 **npm install -g**安装 或者 通过 **npm link** 链接到全局
