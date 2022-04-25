## 用途

1. 在本地开发 npm 模块的时候，我们可以使用 npm link 命令，将 npm 模块链接到本地的另一个项目中去运行，常用于对模块进行本地调试和测试

2. 将本地开发的 npm 模块链接到全局，方便全局调用，常用于全局性质的工具，例如 cli 脚手架等

## 实践

1. 创建 2 个项目，分别是 module-project 和 test-project，开发好的 module-project 要放到 test-project 中去运行和测试

<br />

2. 创建全局链接

```sh
# 为该项目创建全局链接

cd module-project
npm link
```

执行命令后，module-project 会被链接到全局  
路径是{prefix}/lib/node_modules/<package>，这里会有一个 module-project 的快捷方式  
我们可以使用 npm config get prefix 命令获取到 prefix 的值

<br />

3. 在运行的项目中创建链接

```sh
cd test-project
npm link module-project
```

module-project 会被链接到 test-project/node_modules 下面，在 test-project 里面就可以直接使用了，就好像被 install 到工程中一样

<br />

## 常用命令

```sh
# 解除link
解除项目和模块link，项目目录下，npm unlink 模块名
解除模块全局link，模块目录下，npm unlink 模块名
```

## 另一种调试本地模块的方案

1. 创建私服

```sh
npm install verdaccio -g

# 启动私服，得到私服地址localhost:4873
verdaccio

# 增加用户
npm adduser --registry http://localhost:4873

# 发包到私服上
npm publish --registry http://localhost:4873
```

2. 从私服上下载包到项目中，进行调试
