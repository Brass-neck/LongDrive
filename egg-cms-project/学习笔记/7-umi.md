# umi

```
npm i -g umi
```

### 路由

> layouts/index.js 是约定式路由时的**全局布局文件**，`pages` 下的路由组件会以`this.props.children`的形式展示在 layouts/index.js 中

> 目录下有 `_layout.tsx` 时会生成嵌套路由，以 `_layout.tsx` 为该目录的 layout，layout 文件需要返回一个 React 组件，并通过 `props.children` 渲染子组件

```js
└── pages
    └── users
        ├── _layout.tsx
        ├── index.tsx
        └── list.tsx

// 生成的路由如下
[
  { exact: false, path: '/users', component: '@/pages/users/_layout',
    routes: [
      { exact: true, path: '/users', component: '@/pages/users/index' },
      { exact: true, path: '/users/list', component: '@/pages/users/list' },
    ]
  }
]
```
