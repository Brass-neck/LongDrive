# 简介

本项目总结从 webpack 编译、路由、组件更新、大数据渲染等多个层面对 react 项目进行优化

# key points record

### 编译阶段优化

- 开发环境重复构建速度更快

  - rules 配置 loader 规则时，使用 include、exclude
  - resolve.modules 配置包的查找范围
  - alias，配置别名
  - external，使用 cdn 方式引入第三方包，减小打包体积
  - cache: filesystem，编译缓存
  - 开启多进程

- 生产环境文件更小，加载更快

  - tree shaking
  - split chunks 分割
  - resolve.fallback 取消 node 核心模块的引入，减小体积

<hr>

### 路由懒加载优化

- 使用
  - 需要配合 suspense 标签
  - 需要 import() 动态导入

```jsx
const LazyComponent = React.lazy(() => import('./pages/Home'))
return (
  <Suspense fallback={Loading}>
    <LazyComponent />
  </Suspense>
)
```

- webpack 魔法注释开启 prefect，浏览器空闲时就会加载文件

```jsx
const LazyHome = dynamicRoute(() => import(/*webpackPrefetch: true*/ './pages/Home'))
```

- React.lazy 的原理
  借助 `import()` 返回 `promise`，在`then`之后拿到组件进行渲染

<hr>

### 更新优化

1. `PureComponent` 用于类组件，它重写了 `shouldComponentUpdate`，当传递给子组件的`props`不变时（浅对比），那么子组件不会重新渲染

2. `React.memo` 用于函数组件，作用同`PureComponent`

3. 使用 `immutable` 不可变数据，immutable 每次都会返回一个**新的引用地址**的对象，但是会尽可能的复用老对象的属性，可以高性能的进行深度比较

4. 使用 reselect 优化 redux

<hr>

### 其他

1. react 17 之后不需要再引入 react，因为编译器变了，之前是通过`React.createElement('div')`，之后不再需要`React`这个变量了，直接通过`require('react/jsx-runtime')('div')`
