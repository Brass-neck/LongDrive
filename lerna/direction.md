### 概念

- learn 是一种管理工具，一个仓库里 管理 多个软件包

### 安装

```
npm i -g lerna
```

### 常用命令

```sh

# 初始化
mkdir lerna-demo
cd lerna-demo
lerna init

# 执行成功后得到的目录如下

- packages(存放package的目录)
- lerna.json(配置文件)
- package.json(工程描述文件)

# 创建package
lerna create

# 添加依赖，所有包都会安装上该依赖
lerna add
# 某个包单独安装自己的依赖
# packages/p1包单独安装yargs
lerna add yargs packages/p1

# 创建软链接
lerna link

# 重新安装所有依赖并创建软链接
lerna bootstrap

# 执行所有package下的脚本
# scriptName是所有package的package.json中script脚本
# --scope + 包名，是让指定的包执行脚本
lerna run scriptName --scope packageName

# 执行shell脚本
# jest是实际的shell脚本，区别于scriptName，scriptName后面定义的就是shell脚本
lerna exec -- jest
```
