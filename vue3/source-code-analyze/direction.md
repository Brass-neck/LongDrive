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

### reactive

1. 有缓存直接返回缓存，没有缓存使用 `new Proxy` 创建新代理，并设置在 `WeakMap` 弱引用缓存 map 中
2. `new Proxy(target, baseHandler)`，baseHandler 是一个包含方法的对象{get, set}，get、set 都是通过工厂函数 return function 创造的，内部使用了 `Reflect`
3. 属性在 `effect` 里被使用，进行依赖的双向收集

   i. 会走 effect 方法，定义 effectStack，给 effect 唯一递增 id，effect.deps 收集相关的对象和 key

   ii. 同时会触发属性的 get ，然后触发`track`进行依赖收集，用一个 `weakMap`以 obj: { key: [effect] } 的形式，存放 reactive(obj)中的 obj 和 effect 中被使用的属性 key，以及依赖的 effect 的关系

4. 处理数组的特殊情况

### ref

- ref 把一个普通值变成 一个引用类型，成为响应式的，vue3 会使用 `defineProperty` 把这个变量定义在一个对象上

- 参数支持普通值、对象

- 总是需要 `.value` 调用，因为普通值变为响应式，需要包一层对象

```javascript
let isShow = ref(true)

effect(() => {
  console.log(isShow.value)
})

setTimeout(() => {
  isShow.value = false
}, 1000)
```

### toRef

- 为了把响应式对象中的某个属性单独解构出来使用，希望解构出来的这个属性也是响应式的，就需要使用 toRef

- 原理使用的是 代理模式 ，代理到 proxy 上，可以说借助了 proxy 的响应式

```javascript
// 单纯的解构，得到的 name 属性只是字符串，会丧失响应性，不是响应式的
const proxy = reactive({ name: 'zz' })
const { name } = proxy
console.log(name) // zz

// 使用toRef，得到的name属性也是一个ref对象，是响应式的
// 代理模式：访问 nameRef.value 的时候，代理到 proxy 上
let nameRef = toRef(proxy, 'name')
console.log(nameRef) // 一个响应式对象
```

### toRefs

- 功能同`toRef`，也是把响应式对象里的属性都变成响应式的，但是`toRefs`可以一次转多个属性

- 实际上就是循环调用 toRef

```javascript
const proxy = reactive({ name: 'zz', age: 16 })
const { name, age } = toRefs(proxy)

const proxy2 = reactive([1, 2, 3, 4])
const [a, b, c, d] = proxy2
```

### computed

- 使用的时候需要 `.value` ，因为普通值变为响应式，肯定要包一层对象，把值放到 `value` 属性上

- 里面可以是一个函数，可以是一个定义了 set、get 的对象

- 计算属性可以收集依赖 effect

- 计算属性本身也是一个 effect ，它与内部依赖的属性建立了关系，但是一个惰性的 effect，只有取值的时候才执行

```javascript
const person = reactive({ name: 'z', age: 12 })

// 计算属性本身也是一个 effect ，它与内部依赖的属性建立了关系，age会收集计算属性的effect
let newAge = computed(() => {
  return person.age * 2
})

// 计算属性可以收集依赖 effect，这个计算属性依赖了这个effect
effect(() => {
  console.log(newAge.value)
})
```
