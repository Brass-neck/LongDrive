# h5-classroom

## 技术栈

`vue/cli4 + vue3 + ts + vuex4 + vant`

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

<hr>
<hr>
<hr>

# keypoints record

## 目录结构组织

- @/typings/ 存放所有的类型
- @/store/action-types.ts 存放所有 asctions 的名称
- @/hooks 存放不同功能的 hook 函数

## 按需引用 UI 组件

- 按需引用 vant 组件，配置按需引入后，main.ts 中将不允许直接导入所有组件

- 对于 vite 项目，可以使用 vite-plugin-style-import 实现按需引入, 原理和 babel-plugin-import 类似

- 如果你在使用 TypeScript，可以使用 ts-import-plugin 实现按需引入。

## defineComponent

- defineComponent 包裹组件定义，可以提供内部良好的 ts 提示
