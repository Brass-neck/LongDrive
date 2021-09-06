### 概念

- learn 是一种管理工具，一个 git 仓库里 管理 多个 package 软件包
- 可以管理多包的公共依赖 和 单包的单独依赖
- 多 package 之间可以直接内部 link 相互依赖，不必发版和安装依赖
- 可以单独发布和全体发布

### 安装

```sh
npm i -g lerna

# Independent 模式可以单独发版，更灵活
lerna init --independent
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


# 添加依赖，所有包都会安装上该依赖，并出现在各自 package.json 的 dependency 里
lerna add
# 某个包单独安装自己的依赖
# packages/p1包单独安装yargs
lerna add yargs packages/p1
# scope 对应的是 package.json 中的 name 字段
lerna add yargs --scope=moduleP1


# moduleA依赖moduleB，内部依赖
lerna add moduleB --scope=moduleA
# 注意这种依赖不会添加到 moduleA 的 node_modules 里，但会添加到 moduleA 的 package.json 中，它会自动检测到 moduleB 隶属于当前项目，直接采用symlink的方式关联过去


# 创建软链接
lerna link


# 重新安装所有依赖 并 创建软链接
# 假设 package 下面有一个包 pkg1 ，依赖 package 下面的另一个包 pkg2 。运行 lerna bootstrap 之后， pkg1/node_modules 下就会出现 pkg2 的 symlink
lerna bootstrap


# moduleA和moduleB都依赖lodash，且在各自 package 下的node_modules 里都有lodash，这其实很浪费空间，可以使用 --hoist
lerna bootstrap --hoist
# 这会将 packages 里重复的依赖提取到最外层的 node_modules 里，同时最外层的 package.json 也不会更新 dependency 信息
# 建议将依赖重复写到每个 子package.json 里，然后用 --hoist 提取到最外层node_modules


# 执行所有package下的脚本
# scriptName是所有package的package.json中script脚本
# --scope + 包名，是让指定的包执行脚本
# scope 对应的是 package.json 中的 name 字段
lerna run scriptName --scope packageName


# 执行shell脚本
# jest是实际的shell脚本，区别于scriptName，scriptName是key，shell脚本是value
lerna exec -- jest
```
