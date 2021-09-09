# 值得注意的新特性

## 1. composition API （组合式 API）

### 概念

vue2 中使用 `data、computed、methods、watch` 组件选项来组织逻辑，通常都很有效。然而，当我们的组件开始变得复杂时，**逻辑关注点**的列表也会增长。尤其对于那些一开始没有编写这些组件的人来说，这会导致组件难以阅读和理解

通俗讲，就是同一个功能的逻辑可能会分散在 watch、methods、computed 等不同选项中，同一个功能被标签分割为一片一片的松散逻辑，当组件庞大而复杂时，导致逻辑难以梳理

如果能够将同一个**逻辑关注点**相关代码收集在一起就会好很多，而这正是组合式 API 使我们能够做到的

<hr>

### setup 组件选项

- 新的 `setup` 选项在**组件创建之前**执行，也就是先于 `data`、`computed`、`methods` 解析之前，所以它们无法在 `setup` 中获取

- `setup` 的返回值，都将暴露给组件的其余部分 (计算属性、方法、生命周期钩子等等) 以及组件的模板使用

- 在`setup`中注册钩子函数，名称与 2.0 相同，但前缀为 `on`，即 `mounted` 会写为 `onMounted`

- `setup`中可以返回一个**渲染函数**

```javascript
import { h, ref, reactive } from 'vue'
export default {
  setup() {
    const num = ref(0)
    const obj = reactive({
      number: 1
    })

    // 请注意这里我们需要显式调用 ref 的 value
    // 可以直接使用 同一作用域中 声明的响应式状态
    return () => h('div', [num.value, obj.number])
  }
}
```

<hr>

### props

```javascript
import { toRef, toRefs } from 'vue';

// setup 函数中的 props 是响应式的，当传入新的 prop 时，它将被更新
export default {
  props: {
    title: String
  },
  setup(props) {
    props.title
  }
}

// props是响应式的，不能使用es6进行解构，否则会消除props的响应性
// 如果需要解构，使用 toRefs
setup(props) {
  const { title } = toRefs(props)
}

// 如果title是可选的prop，则传入的props可能没有title
// 需要使用toRef创建一个title，但是toRefs不会创建
setup(props) {
  const { title } = toRef(props, 'title')
}
```

<hr>

### context

- `setup` 的第二个参数
- `context` 是一个普通的 JavaScript 对象，可以直接解构

```javascript
export default {
  setup(props, context) {
    // Attribute (非响应式对象)
    // attrs：父组件传递过来的 且 没有被 props字段接收的属性
    console.log(context.attrs)

    // 插槽 (非响应式对象)
    console.log(context.slots)

    // 触发事件 (方法)
    console.log(context.emit)
  }

  // 可以直接解构
  // setup(props, { attrs, slots, emit }) {}
}
```

<hr>

### ref 响应式变量

将值封装在一个对象中，是为了保证 js 中**不同数据类型的行为统一**，这是必须的，因为在 js 中，`Number`、`String`等基本类型都是通过值 而非 引用传递的

![headImg](https://blog.penjee.com/wp-content/uploads/2015/02/pass-by-reference-vs-pass-by-value-animation.gif)

<br>

```javascript
import { ref } from 'vue'
const num = ref(0)

console.log(num) // {value: 0}
console.log(num.value) // 0
```

<hr>

### watch 监听

```javascript
// 侦听单个数据源
import { watch } from 'vue'
const num = ref(0)
watch(num, (newVal, oldVal) => {
  //
})

// 侦听多个数据源
const a = ref('')
const b = ref('')
watch([a, b], (n, o) => {
  console.log(n, o)
})

a.value = '1' // logs: ['1', ''] ['', '']
b.value = '2' // logs: ['1', '2'] ['1', '']

// 在同一个方法里同时更改多个数据源，watch只会触发一次
const changeFn = () => {
  a.value = '1'
  b.value = '2'
  // logs: ['1', '2'] ['', '']
}

// 也可以利用nextTick机制，强制把同步改为异步，触发多次watch
const changeFn = async () => {
  a.value = '1' // logs: ['1', ''] ['', '']
  await nextTick()
  b.value = '2' // logs: ['1', '2'] ['1', '']
}

// 侦听响应式对象
// 使用侦听器来比较一个数组或对象的值，这些值是响应式的，要求它有一个由值构成的副本
const nums = reactive([1, 2, 3])
watch(
  () => [...nums],
  (n, o) => {
    //
  }
)

// 深度监听对象或数组中的 property 变化，需要配置deep
const state = reactive({
  id: 1,
  attrs: {
    className: ''
  }
})

watch(
  () => state,
  (state, prevState) => {
    console.log(state.attrs.className, prevState.attrs.className)
  },
  { deep: true }
)

state.attrs.className = 'header'
// logs: 'header' 'header'
// 注意这里，state 与 prevState都是 'header'，不合理
// 因为始终返回 该对象的当前值 和 上一个状态值的引用

// 解决方式： 深拷贝
import { cloneDeep } from 'lodash'

watch(
  () => cloneDeep(state),
  (state, prevState) => {
    console.log(state.attrs.className, prevState.attrs.className)
  }
)
state.attrs.className = 'header' // logs: 'header' ''
```

<hr>

### computed 计算属性

- `computed`参数是一个类似 `getter`的回调函数，输出一个不可变的**只读的**响应式引用
- 访问计算属性值，需要`.value`
- 参数还可以接受一个定义了 `set`和`get`的对象，返回一个**可写的**响应式`ref`对象

<br>

```javascript
import { computed, ref } from 'vue'

export default {
  setup(props) {
    const num = ref(1)
    // 这是一个不可写，只读的computed对象
    const computedNum = computed(() => num.value * 2)

    // 使用 .value 获取值
    console.log(computedNum.value)

    // 参数为定义get和set的对象
    const gsComputed = computed({
      get: () => num.value + 1,
      set: (val) => num.value - 1
    })
    // 这是一个可写的computed对象
    gsComputed.value = 10
  }
}
```

类型声明

```typescript
// 只读的
function computed<T>(getter: () => T, debuggerOptions?: DebuggerOptions): Readonly<Ref<Readonly<T>>>

// 可写的
function computed<T>(
  options: { get: () => T; set: (val: T) => void },
  debuggerOptions?: DebuggerOptions
): Ref<T>
```

<hr>

### 实践

1. 将不同功能的实现提取到单独的模块中，封装为**组合式函数**
2. 将功能集中在 `setup` 中实现

```javascript
import { toRefs } from 'vue'

import function1 from '@/components/function1'
import function2 from '@/components/function2'

export default {
  components: { function1, function2 },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { user } = toRefs(props)

    // function1
    const { detailInfo, getInfo } = function1(user)

    // function2
    const { res2 } = function2(user)

    return {
      detailInfo,
      res2
    }
  }
}

// src/components/function1.vue
import { ref, watch, onMounted } from 'vue'

export default function function1(user) {
  const detailInfo = ref({})
  const getInfo = async() => {
    detailInfo.value = await fetch('/api/xxx', user.value)
  }
  onMounted(getInfo)
  watch(user, getInfo)

  return {
    detailInfo,
    getInfo
  }
}
```
