import { isArray } from '../utils/index'
/**
 * effect功能展示：
 *
 * const state = reactive({name: '', age: 18})
 *
 * effect(() => {
 *    app.innerHTML = state.name + state.age
 * })
 *
 * effect依赖 state.name 和 state.age，当 name 或者 age 变化时，effect重新执行
 */

/**
 * effect实现原理：
 *
 * 首先，在我们给 effect 传递的回调参数中的响应式数据的 get 被触发后，我们的 effect 就会被收集起来
 *
 * 然后，每个响应式数据被触发的时候都可能有多个相关联的 effect，所以每个数据都需要有一个用来收集 effect 的收集器，
 * 即源码中的 deps，当响应式的数据 set 属性被触发时执行这些 effect
 *
 * 最后，为了数据的单一性，我们的 deps 不能放在响应式数据本身，所以我们需要有个集合来储存响应式数据 target 和 deps 的关系
 */

/**
 * options参数
 *
 * lazy ——  是否延迟触发 effect
 * computed	—— 是否为计算属性
 * scheduler  ——	调度函数
 * onTrack  ——	追踪时触发
 * onTrigger  ——	触发回调时触发
 * onStop ——	停止监听时触发
 */

export function effect(fn, options: any = {}) {
  const effect = createReactiveEffect(fn, options)
  if (!options.lazy) effect()
  return effect
}

// 存一个全局的effect，为了让属性可以拿得到
let activeEffect

// 全局递增，是effect的唯一标识id
let uid = 0

// effect的栈结构，根据调用栈控制effect
/**
 * 比如
 * effect(()=>{
 *    state.name
 *    effect(()=>{
 *      state.age
 *    })
 *    state.address
 * })
 */
const effectStack = []

function createReactiveEffect(fn, options) {
  const effect = function () {
    try {
      activeEffect = effect
      effectStack.push(activeEffect)
      // fn是用户自己写的回调，里面会触发依赖属性的get，get会触发依赖收集track
      return fn()
    } finally {
      effectStack.pop()
      activeEffect = effectStack[effectStack.length - 1]
    }
  }
  // id
  effect.id = uid++
  // effect中依赖了哪些属性
  effect.deps = []
  effect.options = options
  return effect
}

// 要记录 reactive(obj)中obj的key和effect的关系
// obj有多个key，每个key可能会依赖多个effect
// obj: {key: [effect, effect]}
const targetMap = new WeakMap()

// 将属性和effect关联起来，属性的get会触发这里的track
export function track(target, key) {
  if (activeEffect == undefined) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    // 创建的是 obj:{}这一层
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    // 创建的是 obj: {key: []}里面这一层
    // 使用set是对effect进行去重
    depsMap.set(key, (dep = new Set()))
  }
  // obj: {key: []}里的数组没有当前这个effect，就放进去
  // 同时给effect创建deps属性，也是数组，记录key
  // 这是双向记忆
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
  }
}

// set的时候，触发trigger
export function trigger(target, type, key, value?, oldValue?) {
  let depsMap = targetMap.get(target)
  if (!depsMap) return

  const run = (effects) => {
    effects.forEach((effect) => {
      // 有schedular，就执行schedular，用于支持computed的缓存
      if (effect.options.schedular) {
        effect.options.schedular(effect)
      } else {
        effect && effect()
      }
    })
  }

  // 数组的特殊情况处理
  /**
   * effect中使用了数组的length，那么就做了依赖收集，下面再去改变length，可以触发effect
   *
   * let state = reactive([1,2,3])
   * effect(()=>{
   *    state.length
   * })
   * state.length = 1
   *
   * ------------------------------------
   *
   * let state = reactive([1,2,3])
   * effect(()=>{
   *    state[1]
   *    这里没有使用length，就没有做依赖收集，下面再去改length，不触发effect
   * })
   * state.length = 1
   *
   * -------------------------------------
   *
   * 如果effect中直接使用了数组，会触发数组的所有属性的get
   *
   * let state = reactive([1,2,3])
   * effect(() => {
   *    state
   * })
   *
   * 会触发state数组的 0，1，2，length。。。等等属性的get收集
   *
   * 新增时，直接触发length的effect即可
   * state[10] = 10
   */

  if (key === 'length' && isArray(target)) {
    depsMap.forEach((effects, key) => {
      if (key === 'length' || key >= value) {
        run(effects)
      }
    })
  } else {
    // 这是对象的处理，即reactive({a:1, b:2})
    if (key != void 0) {
      run(depsMap.get(key))
    }
  }
}
