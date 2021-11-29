# description

自定义 hooks 的练习

# 总结一些知识点

### 用 `transform: translate` 代替 `left top`，可以提高性能，避免回流重绘

### useRef

1. 作为函数 hooks 的一种，主要用于函数组件中保存 dom 实例，保存在 current 属性中
2. 可以保存任何值，修改 `ref.current` 的值不会引起组件更新，需要手动的强制更新

```jsx
// 手动强制更新的方法
const [, forceUpdate] = useState({})
forceUpdate({})
```
