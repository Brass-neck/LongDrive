import { isObject } from '../utils/index'
import { effect, track, trigger } from './effect'

class computedRefImpl {
  public effect

  // computed的计算结果，用于做缓存
  public _value

  // 控制缓存
  public _dirty

  // 需要改造一下 effect的trigger，有schedular，就执行schedular
  // 那么数据更新后，本来应该执行effect，现在执行的是schedular
  constructor(public getter, public setter) {
    this.effect = effect(getter, {
      lazy: true,
      schedular: (effect) => {
        if (this._dirty) {
          // 用户更改了依赖的属性
          this._dirty = true

          // 触发computed对应的effect
          trigger(this, 'get', 'value')
        }
      }
    })
  }

  // 通过computed属性 .value 调用时触发这里的get
  get value() {
    // 只要取过一次computed，就有缓存了，就不是dirty的了
    if (this._dirty) {
      this._value = this.effect()
      this._dirty = false
    }

    // computed也要收集依赖，和它依赖的effect建立关系
    track(this, 'value')

    return this._value
  }

  set value(newValue) {}
}

export function computed(fnOrObj) {
  let getter
  let setter

  if (isObject(fnOrObj)) {
    getter = fnOrObj.get
    setter = fnOrObj.set
  } else {
    // 是函数，函数就等于getter，没有setter
    getter = fnOrObj
    setter = () => {
      console.log('no set')
    }
  }

  return new computedRefImpl(getter, setter)
}
