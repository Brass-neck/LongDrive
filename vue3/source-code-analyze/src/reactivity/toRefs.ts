import { isArray } from '../utils/index'
import { toRef } from './toRef'

export function toRefs(target) {
  const res = isArray(target) ? new Array(target.length) : {}

  for (const key in target) {
    res[key] = toRef(target, key)
  }

  return res
}
