import React, { useEffect, useRef, useState } from 'react'

/********** 以下是错误示例：ref不可直接传递 *********/
function Child(props) {
  const { ref } = props
  return <input type='text' ref={ref} />
}

function forwardRefApp() {
  const ref = useRef(null)

  return (
    <div>
      <Child ref={ref}></Child>
    </div>
  )
}

/********** 通过 forwardRef 解决 *********/

/** 定义子组件，使用 forwardRef 包裹子组件 **/
const Child = forwardRef((props, ref) => {
  return <input type='text' ref={ref} />
})

function forwardRefApp() {
  const ref = useRef(null)
  useEffect(() => {
    ref.current.focus()
  })
  return (
    <div>
      <Child ref={ref}></Child>
    </div>
  )
}

/**
 * react ref 无法获取 被高阶组件HOC 包装的原始组件
 * 因为 ref 获取到的是 容器组件，而不是被包装的组件
 */

function wrapComponent(Component) {
  // 1. 接收一个组件作为参数，返回一个新的组件
  // InnerCom 包裹了 Component，在 Component 的基础上做了一些操作
  class InnerCom extends React.Component {
    componentDidUpdate(prevProps) {
      console.log(prevProps)
      console.log(this.props)
    }

    render() {
      const { forwardedRef, ...rest } = this.props
      return <Component ref={forwardedRef} {...rest} />
    }
  }

  // 2. 再包裹一层 forwardRef，用于外界获取内部真正的 Component ，而非容器组件 InnerCom
  return React.forwardRef((props, ref) => {
    return <InnerCom {...props} forwardedRef={ref} />
  })
}
