// --------------------------------------------------------
// --------------------------------------------------------
// --------------------------------------------------------
// 第一个参数是 字符串

/**
 * react创建虚拟dom的方法
 *
 *
 * let props: Props = {className: 'box'}
 * interface Props{
 *    className: string
 * }
 *
 * React.createElement('div', props, 'hello', 'world')
 */

export declare function createElement<P>(
  type: string,
  props: P,
  ...children: ReactNode[]
): ReactElement

/**
 * P是属性，T是元素类型
 *
 * createElement的元素可以传入 字符串、函数组件、类组件
 */

// 如果一个函数，返回一个 ReactElement 元素，那这个函数就是一个JSX元素构造器
type JSXElementConstructor<P> =
  | ((props: P) => ReactElement | null)
  | (new (props: P) => Component<P, any>)

interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string> {
  type: T
  props: P
}

interface DOMElement extends ReactElement {}

interface ReactHTML {
  div: HTMLDivElement
  span: HTMLSpanElement
}

//
type ReactText = string | number
type ReactChild = ReactElement | ReactText
type ReactNode = ReactChild | boolean | null | undefined

// 第一个参数是 string，react返回的 虚拟dom 的类型
interface DetailedReactHTMLElement extends DOMElement {
  type: keyof ReactHTML
}

// --------------------------------------------------------
// --------------------------------------------------------
// --------------------------------------------------------
// 第一个参数是函数组件

/**
 *
 * 方法的重载：方法名一样，参数不一样
 *
 *
 */
export declare function createElement<P>(
  type: FunctionComponent<P>,
  props: P,
  ...children: ReactNode[]
): FunctionComponentElement<P>

/**
 * 函数组件
 *
 * 通过 interface 修饰一个函数
 */
interface FunctionComponent<P> {
  (props: P): ReactElement | null
}

// 第一个参数是 函数组件，react返回的 虚拟dom 的类型
interface FunctionComponentElement<P> extends ReactElement<P, FunctionComponent<P>> {}

// --------------------------------------------------------
// --------------------------------------------------------
// --------------------------------------------------------
// 第一个参数是 类组件，继续重载方法

export declare function createElement<P>(
  type: ComponentClass<P>,
  props: P,
  ...children: ReactNode[]
): ComponentElement<P>

// 组件状态
type ComponentState = any

// 修饰 React.Component
declare class Component<P, S> {
  setState(state: ComponentState): void
  render(): ReactNode
}

/**
 * interface修饰函数时，前面加 new ，表示这是一个构造函数
 */
interface ComponentClass<P = {}, S = ComponentState> {
  new (props: P): Component<P, S>
}

// 第一个参数是 类组件， react返回的 虚拟dom 的类型
interface ComponentElement<P> extends ReactElement<P, ComponentClass<P>> {}
