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

### vue 几大模块

1. runtime-dom，提供 dom 创建、属性处理的 API（也就是生成真实节点），目的是为了抹平平台的差异，不同平台对 dom 操作方式是不同的，比如在小程序端是没有 dom 的，可能需要额外的一套 runtime-dom 。把这些 API 传入到 runtime-core 中，core 可以调用

2. runtime-core，调用 reactivity

3. reactivity

4. compiler（编译模板使用）

每一个模块都是一个子包，也就是一个文件夹，通过`npm init -y`生成自己的包管理

<hr>

### reactive

1. 有缓存直接返回缓存，没有缓存使用 `new Proxy` 创建新代理，并设置在 `WeakMap` 弱引用缓存 map 中
2. `new Proxy(target, baseHandler)`，baseHandler 是一个包含方法的对象{get, set}，get、set 都是通过工厂函数 return function 创造的，内部使用了 `Reflect`
3. 属性在 `effect` 里被使用，进行依赖的双向收集

   i. 会走 effect 方法，定义 effectStack，给 effect 唯一递增 id，effect.deps 收集相关的对象和 key

   ii. 同时会触发属性的 get ，然后触发`track`进行依赖收集，用一个 `weakMap`以 obj: { key: [effect] } 的形式，存放 reactive(obj)中的 obj 和 effect 中被使用的属性 key，以及依赖的 effect 的关系

4. 处理数组的特殊情况

<hr>

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

<hr>

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

<hr>

### toRefs

- 功能同`toRef`，也是把响应式对象里的属性都变成响应式的，但是`toRefs`可以一次转多个属性

- 实际上就是循环调用 toRef

```javascript
const proxy = reactive({ name: 'zz', age: 16 })
const { name, age } = toRefs(proxy)

const proxy2 = reactive([1, 2, 3, 4])
const [a, b, c, d] = proxy2
```

<hr>

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

<hr>

### runtime-dom

收集用户传入的参数，和创建的平台 dom API 一起，传给 runtime-core，由 runtime-core 生成渲染器

1. patchEvents，给元素绑定事件，利用`引用类型`，在引用类型上添加属性，做缓存

<hr>

### runtime-core

会根据 runtime-dom 传过来的 dom api 生成 render 渲染器

1. createRenderer

```javascript
createRenderer(apiFromRuntimeDOM){
  return { render, createApp }
}
```

2. createApp，返回一个 app 对象，上面有 mount 方法

```javascript
createApp(rootComponent){
  const app = {
    mount(container) {
        // 1. 根据用户传入的组件，生成一个虚拟节点
        const vnode = createVnode(rootComponent)
        // 2. 把虚拟节点渲染到容器中
        render(vnode, container)
      }
  }
  return app
}

// createApp就是创建组件的api
createApp(<App />).mount('#app')
```

3. createVnode(rootComponent, props, children = null)创建虚拟节点

```javascript
二进制是 0b 开头
0b1 代表 二进制 1，等于1
0b10 代表 二进制 10，等于2
0b100 代表 二进制 100，等于4
0b1000 代表 二进制 1000，等于8

let a = 0b1
a = a << 1  表示向左移动一位，得到0b10
a = a << 1  表示向左移动一位，得到0b100
a = a << 1  表示向左移动一位，得到0b1000

二进制，每移动一位，相当于乘以2

-------------------------------

100 | 10 = 110
| 表示按位或，有一个是1就是1，不够的在前面补零
  100
  010
= 110

110 & 100 = 100（100转为十进制，是一个数字，不是0，那么表示110包含100）
& 表示按位与，两个都是1才是1
  110
  100
= 100

110 & 001 = 000（000转为十进制是0，表示110不包含001）

-------------------------------

检查包含不包含，常用于权限，比如
const manager = 1 << 1
const user = 1 << 2
const order = 1 << 3

// admin包含manager和user
const admin = manager | user

// 检查manager是否包含order
admin & order = 0000

```

**用`位运算`标识类型，可以做权限的检查和权限的组合**

```typescript
export const enum ShapeFlags {
  ELEMENT = 1, // 元素
  FUNCTIONAL_COMPONENT = 1 << 1, //函数组件
  STATEFUL_COMPONENT = 1 << 2, // 带状态的组件
  TEXT_CHILDREN = 1 << 3, // 组件的孩子是文本
  ARRAY_CHILDREN = 1 << 4, // 组件的孩子是数组
  SLOTS_CHILDREN = 1 << 5, // 组件的孩子是插槽
  TELEPORT = 1 << 6, // 传送门
  SUSPENSE = 1 << 7, // 实现异步组件
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT // |是按位或
}
```

4. render(vnode, container)，根据虚拟节点，生成真实节点，render 里执行了 patch

5. patch(oldVnode, newVnode, container)，里面判断 newVnode 的 shapeFlag，是组件还是元素，走不同的方法

   如果 oldVnode == null，说明是首次 mount，否则是更新

   首次启动，用户传入一个`带 setup 方法`的，那就是组件，创建组件实例 instance，拿出 setup 执行，执行结果如果是 h 函数，执行 h 函数得到虚拟节点，再执行 patch，这一次 shapeFlag 不再是组件，而是 h 函数里的元素了，就走到 handleElement，把虚拟节点变成真实节点，细节如下：

   createComponentInstance 创建 instance 实例对象，里面包含 ctx、attrs、props、slots、vnode、isMounted 等属性；

   从 instance 里拿出用户传的 setup 函数执行，同时把 props 和 ctx 传过去，setup(props, ctx);

   创建 ctx，是一个对象，包含 { attrs, slots, emit, expose }

   ```javascript
   // 这里说一下新特性 expose
   // 组件1.vue
   {
     name: '组件1',
     setup(props, {attrs, slots, emit, expose}) {
       const num = reactive({
         a: 1
       })

       function changeNum(val){
         num.a = val
       }

       // 暴露方法，别人就可以通过ref.changeNum调用方法
       // 与vue2不同的是，vue2可以调用所有方法，且不可私有化
       // vue3如果不写expose，默认暴露所有方法
       // 如果写了expose，只暴露expose里的方法，其他的会被私有化
       expose({
         changeNum
       })

       return {
         num
       }
     }
   }

   // 组件2.vue
   {
     name: '组件2',
     template: `<组件1 ref="r1">`,
     setup(props){
       const r1 = ref(null)

       onMounted(() => {
         r1.value.changeNum(2)
       })

       return {
         r1
       }
     }
   }
   ```

   setup 函数执行结果，是函数的话就是 h 函数，执行 h 函数，得到虚拟节点，再走 patch

6. h 函数，内部调用了 createVnode 生成虚拟节点

7. handleElement(vnode1, vnode2, container)，如果 vnode1 == null，是首次挂载，直接变为真实 dom；否则就走 dom diff

8. dom diff 比较两个虚拟节点

   ① patch 里判断是不是 sameVnode(key 和 tag 是否相同)，不是，不可复用，直接删除老节点，挂载新节点

   ② 是 sameVnode，节点复用，并且进行更深入的对比，patchProps 属性对比、patchChildren 孩子对比

   ③ patchChildren，如果新老孩子都是数组，就需要最核心的 dom diff 算法

   ④ dom diff，头头比、尾尾比；  
   如果都不成功，就需要一个 map 映射表，把新的内容做成映射表，保存新的 child 的 key 和其索引位置 i 的关系，然后 for 循环老的，看看在新的 map 里有没有，有的就复用，没有的就删除（用一个都是 0 的数组[0,0,0]标识，如果老的在新的里找到，就把 0 置为不是 0 的一个位置索引）

   最长递增子序列的优化
