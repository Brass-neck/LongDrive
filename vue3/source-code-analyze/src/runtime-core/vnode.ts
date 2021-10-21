import { isString, isObject, isFunction, isArray } from '../utils/index'
import { ShapeFlags } from '../shared/types'

/**
 * 根据传入的组件创建虚拟节点
 *
 * 虚拟节点的好处：
 * 1. 可以跨平台
 * 2. 操作真实dom浪费性能，可以把修改都做在虚拟dom上，最后一次性的更新到真实dom上（可以理解为是真实dom的缓存）
 */
export function createVnode(type, props, children = null) {
  // h方法也是创建虚拟节点，内部会调用createVnode。 h('h1', {}, 'xxx')
  // createApp(<App />)会调用createVnode
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : isFunction(type)
    ? ShapeFlags.FUNCTIONAL_COMPONENT
    : 0

  const vnode = {
    __v_isVnode: true,
    props,
    type,
    children, // 组件的chidren是插槽
    key: props && props.key,
    el: null, // 对应真实的节点，新的旧的vnode进行比对，将差异放到旧的vnode的el这个真实节点上
    shapeFlag // 描述节点类型
  }

  // 把 children 的 shapeFlag 也放进去，做 按位或 处理
  normalizeChildren(vnode, children)

  return vnode
}

function normalizeChildren(vnode, children) {
  if (children == null) {
  } // 没有儿子， 不处理
  else if (isArray(children)) {
    // 形如 h('div', {}, ['div', 'p'])
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  } else {
    // 形如 h('div', {}, 'text')
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  }
}
