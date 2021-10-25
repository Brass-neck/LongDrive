import { ShapeFlags } from '../shared/types'
import { createApp } from './apiCreateApp'
import { isFunction } from '../utils/index'

/**
 * @param renderOptions 不同平台的 api 操作，来自runtime-dom
 */
export function createRenderer(renderOptions: {}) {
  const updateComponent = (vnode1, vnode2, container) => {}

  /******************** handleElement *********************/

  const patchKeydChildren = (c1, c2, el) => {
    let i = 0
    let e1 = c1.length - 1
    let e2 = c2.length - 1

    // 情况一：从头开始，两两比对，比到其中一个孩子的长度结束
    // abc
    // abde
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]
      if (isSameVnode(n1, n2)) {
        patch(n1, n2, el)
      } else {
        break
      }
      i++
    }

    // 情况二：从结尾开始，两两比对，比到其中一个孩子的长度结束
    //  abc
    // eabc
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]
      if (isSameVnode(n1, n2)) {
        patch(n1, n2, el)
      } else {
        break
      }
      e1--
      e2--
    }

    if (i) {
    } else if (i > e2) {
    } else {
      // 无规律的情况，头尾复用，中间的做diff
      // ab [cde] fg   // s1 = 2，e1 = 4
      // ab [edch] fg  // s2 = 2，e2 = 5
      const s1 = i
      const s2 = i

      // 映射表，保存 新的key 和 索引位置i 的关系
      const map = new Map()
      for (let i = s2; i <= e2; i++) {
        const newChild = c2[i]
        map.set(newChild.key, i)
      }

      // 创建一个数组，长度等于 e2 - s2 + 1，内容都是0，[0,0,0,0]，
      const toBePatched = e2 - s2 + 1
      const arr = new Array(toBePatched).fill(0)
      // 循环老的，拿到老的key，去map里看有没有，有就复用，没有就删除
      for (let i = s1; i <= e1; i++) {
        const oldChild = c1[i]
        const indexInNew = map.get(oldChild.key)
        if (indexInNew == undefined) {
          // 新的没有老的这个key，就是新的里删除了这个老的
          renderOptions.removeChild(oldChild.el)
        } else {
          // 老的key在新的里找到了，就复用，并且通过patch继续比对他们的属性和孩子
          arr[indexInNew - s2] = i + 1
          patch(oldChild, c2[indexInNew], el)
        }
      }
    }
  }

  const patchChildren = (n1, n2, el) => {
    let c1 = n1.children
    let c2 = n2.children
    let prevShapeFlag = n1.shapeFlag
    let nextShapeFlag = n2.shapeFlag
    // h('div', {}, ['div', 'p'])，孩子是数组
    // h('div', {}, 'hello')，孩子是文本

    // 1.老的是文本，新的是文本 =》新的覆盖老的
    // 2.老的是数组，新的是文本 =》新的覆盖老的
    if (nextShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (c1 !== c2) {
        renderOptions.setText(el, c2)
      }
    } else {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 4.老的是数组，新的是数组 =》dom diff
        patchKeydChildren(c1, c2, el)
      } else {
        // 3.老的是文本，新的是数组 =》删除老文本，生成新节点放进去
        renderOptions.setText(el, '')
        for (let i = 0; i < c2.length; i++) {
          const element = c2[i]
          patch(null, element, el)
        }
      }
    }
  }

  const patchProps = (oldProps, newProps, el) => {
    if (oldProps !== newProps) {
      // 新的有，直接覆盖老的；
      for (const key in newProps) {
        const oldP = oldProps[key]
        const newP = newProps[key]
        if (oldP !== newP) {
          renderOptions.updateProp(el, key, oldP, newP)
        }
      }
      // 老的有，新的没有，删除老的
      for (const key in oldProps) {
        if (newProps[key] == undefined) renderOptions.updateProp(el, key, oldProps[key], null)
      }
    }
  }

  // 深入对比两个虚拟节点，同时不停更新el
  const patchElement = (n1, n2, container) => {
    // 1. 走到这里说明是sameVnode，进行节点复用，把老的el赋给新的el
    let el = (n2.el = n1.el)

    // 2. 比对属性，通过新、老的属性差异，去更新el
    let oldProps = n1.props || {}
    let newProps = n2.props || {}
    patchProps(oldProps, newProps, el)

    // 3. 对比孩子，更新el
    patchChildren(n1, n2, el)
  }

  // 设置孩子
  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      patch(null, children[i], container)
    }
  }

  // 生成真实dom
  const mountElement = (vnode, container) => {
    const { type, props, children, shapeFlag } = vnode

    let el = (vnode.el = renderOptions.createElement(type))

    if (props) {
      for (const key in props) {
        renderOptions.setProp(el, key, props[key])
      }
    }

    // 设置完父亲，设置孩子
    if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 孩子是数组，递归
      mountChildren(children, el)
    } else if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 孩子是文本，直接设置
      renderOptions.setText(el, children)
    }

    renderOptions.appendChild(el, container)
  }

  const handleElement = (vnode1, vnode2, container) => {
    if (vnode1 == null) {
      // 首次挂载元素
      mountElement(vnode2, container)
    } else {
      // dom diff 算法 比较两个虚拟节点
      // 情况2：是sameVnode，且是元素，走到handleElement的 dom diff 里
      patchElement(vnode1, vnode2, container)
    }
  }
  /******************** handleElement *********************/

  /******************** handleComponent *********************/
  // 执行 h函数
  const setupRenderer = (instance, container) => {
    if (!instance.isMounted) {
      let subTree = (instance.subTree = instance.render())

      patch(null, subTree, container)
      instance.isMounted = false
    } else {
      // 更新逻辑
      let prev = instance.subTree // 上一次的渲染结果，旧的vnode
      let next = instance.render() // instance.render就是setup的执行结果 h函数，就是新的vnode
      // 调用patch去对比
      patch(prev, next, container)
    }
  }

  // 创建组件实例，并执行setup得到h函数
  const mountComponent = (vnode2, container) => {
    // 1. 创建实例
    let instance = (vnode2.component = createComponentInstance(vnode2))

    // 2. 拿出实例中的 setup 执行，把props、ctx传过去
    let { setup } = instance.type
    if (setup) {
      // 3. 创建好 ctx
      let ctx = createSetupContext(instance)
      // 结果可能是一个对象，是给模板使用的数据
      // 可能是一个函数，那就是 h函数，执行 h 函数 得到 虚拟节点
      let setupResult = setup(instance.props, ctx)
      if (isFunction(setupResult)) instance.render = setupResult

      // 执行 h函数
      setupRenderer(instance, container)
    }
  }

  const handleComponent = (vnode1, vnode2, container) => {
    if (vnode1 == null) {
      mountComponent(vnode2, container)
    } else {
      updateComponent(vnode1, vnode2, container)
    }
  }
  /******************** handleComponent *********************/

  const isSameVnode = (n1, n2) => {
    return n1.type == n2.type && n1.key == n2.key
  }

  // patch里判断vnode类型，根据不同类型，触发不同方法去处理
  const patch = (vnode1, vnode2, container) => {
    const { shapeFlag } = vnode2

    // 情况1：新老节点不是sameVnode，不可复用，直接删除老节点，挂载新节点
    if (vnode1 && !isSameVnode(vnode1, vnode2)) {
      renderOptions.removeChild(vnode1.el)
      vnode1 = null
    }

    // 情况2：是sameVnode，且是元素，走到handleElement的 dom diff 里
    if (shapeFlag & ShapeFlags.ELEMENT) {
      // 包含元素，那就走处理元素的方法
      handleElement(vnode1, vnode2, container)
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      // 包含组件，那就走处理组件的方法
      handleComponent(vnode1, vnode2, container)
    }
  }

  // 根据虚拟节点生成真实节点，放到container中
  const render = (vnode, container) => {
    // 首次渲染，老的vnode = null
    patch(null, vnode, container)
  }

  return {
    render,
    createApp: createApp(render)
  }
}

// 创建组件实例，挂载到页面
let uid = 0
function createComponentInstance(vnode) {
  const instance = {
    uid: uid++,
    vnode,
    type: vnode.type,
    props: {},
    slots: {},
    attrs: {},
    setupState: {},
    ctx: {},
    isMounted: false,
    subTree: null,
    render: null
  }
  return instance
}

// 创建setup函数中的 上下文ctx
function createSetupContext(instance) {
  return {
    attrs: instance.attrs,
    slots: instance.slots,
    emit: instance.emit,
    expose: () => {}
  }
}
