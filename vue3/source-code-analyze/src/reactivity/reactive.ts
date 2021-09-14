import { isObject } from '../utils/index'
import { mutableHandlers } from './baseHandler'

// 缓存，使用WeakMap
const proxyMap = new WeakMap()

/**
 * 将目标转为响应式对象，使用Proxy
 * @param target
 * @returns
 *
 * 核心操作：读取文件时做 依赖收集 ，数据变化时，重新执行 effect
 */
export function reactive(target: object) {
  // 这里套一层函数，可以传不同参数
  return createReactiveObject(target, mutableHandlers)
}

function createReactiveObject(target, baseHandlers) {
  if (!isObject(target)) return target

  // 缓存，如果有的话，直接返回
  const exsitingProxy = proxyMap.get(target)
  if (exsitingProxy) return exsitingProxy

  const proxy = new Proxy(target, baseHandlers)
  // 将 代理的对象 和代理的结果 做一个映射表
  proxyMap.set(target, proxy)

  return proxy
}
