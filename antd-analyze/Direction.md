# 描述

本项目用于解析 `Antd` UI 库中的一些关于组件、测试、打包等知识

# 重点记录

### 打包结果

`Antd`使用了`webpack`和`gulp`两种工具，`webpack` 是打包工具， `gulp` 是流程构建工具（可以做到只编译，不打包）

打包的结果有三个文件夹：

1. dist 目录，这个是 webpack 打包并压缩生成的，用于不同平台使用，浏览器可以直接引入
2. es 目录，这个是 gulp 编译出来的 es6（不需要 babel 转），没压缩没打包，保留了原来的结构（一个一个的组件文件夹），为了按需引入
3. lib 目录，这个是 gulp 编译出来的 es5（需要 babel 转一下），没压缩没打包，保留了原来的结构（一个一个的组件文件夹），为了按需引入

```json
// package.json

// 配置发包仓库，发布到npm
"publishConfig":{
  "access": "public",
  "registry": "http://registry.npmjs.org"
},

// 配置发布的文件，只发布 下面三个文件夹
"files": [
  "dist",
  "es",
  "lib"
]

// 配置不同的入口
"main": "lib/index.js"
"module": "es/index.js"
"unpkg": "dist/antd.js"
"typings": "lib/index.d.ts"
```

<hr>

### storybook 库

- 用于将 md、mdx（md 文件中可以写 jsx） 文件转为网页，常用于写博客、组件库指南等等
- 根目录下创建 `.storybook` 文件夹，里面创建` main.js` 进行配置
- npm 命令
  - `start-storybook -p 6006`起开发服务器
  - `build-storybook`打包

<hr>

### jest 库 用于测试

- jest 是一个 JS 测试框架
- Enzyme 是用于 React 的 JS 测试工具
- jest-image-snapshot 执行图像比较，用于视觉回归测试

- unit 单元测试：测试单个组件
- e2e 测试：端到端测试（end to end），也叫冒烟测试，用于测试真实浏览器环境下前端应用的流程和表现，相当于代替人工去操作应用。通常使用 puppeteer 作为 E2E 测试的工具

- npm 命令
  - 单元测试 "test:unit"：`jest --config unit.jest.js`
  - e2e 测试 "test:e2e"： `jest --config e2e.jest.js`
