import { isSymbol, isObject, isArray, isInteger, hasOwnProperty, hasChanged } from '../utils/index'
import { reactive } from './reactive'
/**
 * 2、可能会产生多种set和get，所以使用工厂函数
 */
function createGetter() {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver) // 就相当于获取target[key]
    if (isSymbol(key)) {
      return res
    }

    // 如果取出的值是对象，需要递归进行再次代理
    if (isObject(res)) return reactive(res)
    // 依赖收集

    return res
  }
}
function createSetter() {
  return function set(target, key, value, receiver) {
    // vue2不支持新增属性，只支持修改属性
    // vue3支持修改属性
    // 这里需要判断 是 新增 还是修改
    const oldValue = target[key]

    // target是数组，需要判断key是不是数字，并且key小于length，才是修改
    // target是对象，判断有没有own key
    const hasKey =
      isArray(target) && isInteger(key) ? Number(key) < target.length : hasOwnProperty(target, key)

    if (!hasKey) {
      console.log('新增')
    } else if (hasChanged(value, oldValue)) {
      console.log('修改')
    }
    // Reflect.set返回boolean，可以判断是否修改成功
    const res = Reflect.set(target, key, value, receiver) // target[key] = value
    return res
  }
}

const get = createGetter()
const set = createSetter()

/**
 * 1、这是传给Proxy代理的第二个参数，对代理的get、set功能进行描述
 */
export const mutableHandlers = {
  get,
  set
}
