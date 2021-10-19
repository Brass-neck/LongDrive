function createInvoker(fn) {
  const invoker = (e) => {
    invoker.value(e)
  }
  invoker.value = fn
  return invoker
}

/**
 *
 * @param el 要绑定事件的元素
 * @param key 事件名，如 onClick
 * @param next 事件回调函数
 */
export const patchEvents = (el, key, next) => {
  /**
   * 1. 在el上创建一个私有属性 _vei ，以事件名为key，来保存一个函数
   * 2. 保存的函数总是 const invoker = (e) => { invoker.value(e) } 这个函数.
   *    并且当 el的同一个key的next回调函数发生变化的时候，不需要解绑，只需要更改 invoker.value，
   *    因为函数中始终执行的是 invoker.value(e)
   *
   * el._vei = {
   *    onClick: (e) => { invoker.value(e) }
   * }
   *
   */

  // vei: vue event invoker
  const invokers = el._vei || (el._vei = {})

  // 根据事件名，存储事件
  const exist = invokers[key]
  if (exist && next) {
    exist.value = next
  } else {
    // onClick -> click
    const eventName = key.toLowerCase().slice(2)

    if (next) {
      // 绑定事件
      let invoker = (invokers[key] = createInvoker(next))
      el.addEventListener(eventName, invoker)
    } else {
      // 没有传过来 next，表示移除
      el.removeEventListener(eventName, exist)
      invokers[key] = null
    }
  }
}
