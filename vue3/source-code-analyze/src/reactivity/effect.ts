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
function createReactiveEffect(fn, options) {
  const effect = function () {
    activeEffect = effect
    // fn里会触发get，get会触发依赖收集track
    return fn()
  }
  return effect
}

// 将属性和effect关联起来

function track(target, key) {
  // 获取属性触发get的逻辑 没有 写在effect里
  if (activeEffect == undefined) return
}
