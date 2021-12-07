/**
 * react库 导出的类型是 commonjs ，在ts中不能直接 import React from 'react'，会报错
 * 需要 tsconfig.json 中开启 `esModuleInterop`，以支持在 commonjs 模块下使用 import React from 'react' 的形式
 */
import * as React from 'react'
import * as ReactDOM from 'react-dom'

let root: HTMLElement | null = document.getElementById('root')

interface Props {
  className: string
}

let props: Props = {
  className: 'title'
}

// let element = <div>123</div>
// 这个 jsx 会 编译为 React.createElement

/**
 * React.createElement(第一个参数可以是 字符串、函数组件、类组件)
 *
 * 如果是 函数组件，函数组件首字母需要大写
 * function Comp() {return '<div>1</div>'}
 * <Comp></Comp>
 * React.createElement(Comp, null)
 *
 * 如果首字母是小写，就会被编译成字符串，进而报错
 * function comp() {return '<div>1</div>'}
 * <comp></comp>
 * React.createElement('comp', null)
 *
 * -------------------------------------------
 *
 * element是一个虚拟dom，是一个对象 {type: span、div等等，props: id，className等等}
 * HTMLDivElement是真实dom
 */

// --------------------------------------------------------
// --------------------------------------------------------
// --------------------------------------------------------

// 第一个参数是 字符串 ，返回值是 DetailedReactHTMLElement
let element1: React.DetailedReactHTMLElement<Props, HTMLDivElement> = React.createElement<Props>(
  'div',
  props,
  'hello',
  1,
  true,
  null,
  undefined
)
// --------------------------------------------------------
// --------------------------------------------------------
// --------------------------------------------------------

// 第一个参数是 函数组件 ，返回值是 FunctionComponentElement
function FnCom(props) {
  return <div>111</div>
}
let element2: React.FunctionComponentElement<Props> = React.createElement(FnCom, props)

// --------------------------------------------------------
// --------------------------------------------------------
// --------------------------------------------------------

// 第一个参数是 类组件 ，返回值是 FunctionComponentElement
interface State {
  count: number
}
class ClassCom extends React.Component<Props, State> {
  // Props是类组件的属性类型，State是类组件的状态类型
  state = {}
  render() {
    return <div>11</div>
  }
}

let element3 = React.createElement(ClassCom, props)
// --------------------------------------------------------
// --------------------------------------------------------
// --------------------------------------------------------

ReactDOM.render(element1, root)
