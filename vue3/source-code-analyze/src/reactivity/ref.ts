import { isObject } from '../utils/index'
import { hasChanged } from '../utils/index'
import { track, trigger } from './effect'
import { reactive } from './reactive'

// ref如果是对象，_value值是通过reactive包了一层的proxy
export function ref(value) {
  return createRef(value)
}

// shallowRef如果是对象，_value值直接就是对象本身
export function shallowRef(value) {
  return createRef(value, true)
}

function createRef(value, shallow = false) {
  // 为什么要用类？
  // 因为要借助类的属性访问器
  return new RefImpl(value, shallow)
}

const convert = (v) => (isObject(v) ? reactive(v) : v)
class RefImpl {
  public _value

  constructor(public rawValue, public shallow) {
    this._value = shallow ? rawValue : convert(rawValue)
  }

  get value() {
    // 收集依赖
    track(this, 'value')
    return this._value
  }

  set value(newValue) {
    if (hasChanged(newValue, this.rawValue)) {
      this.rawValue = newValue
      this._value = this.shallow ? newValue : convert(newValue)

      // 触发effect
      trigger(this, 'set', 'value', newValue)
    }
  }
}
