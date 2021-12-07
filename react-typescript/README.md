# 描述

这个项目主要学习 react 中的 typescript 类型，并实现一些底层类型

# 重点记录

### 深刻理解 ts 中 & 交叉类型 和 | 联合类型

```ts
interface Foo {
  foo: string
  name: string
}
interface Bar {
  bar: string
  name: string
}

// 联合类型
// 在sayHello函数内部，只能访问 obj.name，因为它是两种类型都包含的属性
// 不能访问 obj.foo 或者 obj.bar ，因为 foo 和 bar 都不一定存在
const sayHello = (obj: Foo | Bar) => {
  /* ... */
}
sayHello({ foo: 'foo', name: 'lolo' })
sayHello({ bar: 'bar', name: 'growth' })

// 交叉类型
// 在sayHello函数内部，能访问 name、foo、bar三个属性
// 因为 只有同时包含 name、foo、bar 属性的对象，才是 Foo 和 Bar 的交集
const sayHello = (obj: Foo & Bar) => {
  /* ... */
}
sayHello({ foo: 'foo', bar: 'bar', name: 'kakuqo' })
```

`实战`
在 React 中，声明一个类组件时，可以使用 `属性类型 泛型` 对属性进行约束

```ts
class Counter extends React.Component<CounterProps> {
  /* ... */
}
```

在类中，可以通过 this.props 访问属性，然而 this.props 的类型不止包含 CounterProps，而是：

```ts
Readonly<CounterProps> & Readonly<{children?: ReactNode}>
```

因为 React 组件可以接收子元素，通过 `this.props.children` 可以访问子元素

所以这里是 `CounterProps & {children?: ReactNode}` 交叉类型

<hr>

### 深刻理解 ts 中 ReturnType、ConstructorParameters、Parameters、InstanceType

```ts
ReturnType：获取函数返回值的类型，泛型必须是一个`函数`

function sum(a: number, b: number): number { return 1}
type R1 = ReturnType<typeof sum>	// R1 = number

源码
type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any

使用
type T1 = ReturnType<(<T>() => T)>;	// unknown

function f1(a: number, b: string){
    return {a:1, b:'1'}
}
type T2 = ReturnType<typeof f1>;  // { a: number, b: string }
type T3 = ReturnType<never>;  // never

------------------------------------------------------------

Parameters：获取函数参数的类型，泛型必须是一个`函数`

使用
type ReturnUser = Parameters<typeof f1>	// [a: number, b: string]

源码
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never
------------------------------------------------------------

class Person {
  name

  constructor(name: string | number) {
    this.name = name
}

------------------------------------------------------------

ConstructorParameters：获取构造函数的参数类型，泛型必须是一个`构造函数，通常是 typeof Person`

源码
type ConstructorParameters<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : never;

使用
type Params1 = ConstructorParameters<typeof Person>	// [name: string | number]

------------------------------------------------------------

InstanceType：获取构造函数本身的类型，泛型必须是一个`构造函数，通常是 typeof Person`

使用
type Params1 = InstanceType<typeof Person>		// Person
```
