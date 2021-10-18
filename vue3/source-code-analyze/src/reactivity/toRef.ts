/**
 * toRef是一种代理模式，取值的时候，代理到target这个proxy上，可以说借助了target的响应式
 *
 */
class ObjectRefImpl {
  // 表明是一个ref
  public __v_isRef = true

  constructor(public target, public key) {}
  get value() {
    return this.target[this.key]
  }
  set value(newValue) {
    this.target[this.key] = newValue
  }
}

export function toRef(target, key) {
  return new ObjectRefImpl(target, key)
}
