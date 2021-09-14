## rollup 环境

```sh
# 初始化
npm init -y
npx tsc --init

# 安装依赖
npm i typescript rollup rollup-plugin-typescript2 @rollup/plugin-node-resolve @rollup/plugin-replace rollup-plugin-serve -D
```

| 名称                        | 功能           |
| --------------------------- | -------------- |
| rollup                      | 打包工具       |
| rollup-plugin-typescript2   | 解析 ts 的插件 |
| @rollup/plugin-node-resolve | 解析第三方模块 |
| @rollup/plugin-replace      | 替换环境变量   |
| rollup-plugin-serve         | 起本地服务     |
| :--------:                  | -------------: |

<hr>

## 官方的功能

```sh
npm i @vue/reactivity
```

安装后，在`index.html`模板文件中`script`引入`node_modules/@vue/reactivity/dist/reactivity.global.js`

## 替换为自己写的功能

在`index.html`模板文件中`script`引入`dist/vue.js`

<hr>

## keypoints record
