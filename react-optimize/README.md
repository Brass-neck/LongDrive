# 简介

本项目总结从 webpack 编译、路由、组件更新、大数据渲染等多个层面对 react 项目进行优化

# key points record

### 编译阶段优化

- 开发环境重复构建速度更快

  - rules 配置 loader 规则时，使用 include、exclude
  - resolve.modules 配置包的查找范围
  - alias，配置别名
  - external，使用 cdn 方式引入第三方包，减小打包体积
  - cache: filesystem，编译缓存
  - 开启多进程

- 生产环境文件更小，加载更快

  - tree shaking
  - split chunks 分割
  - resolve.fallback 取消 node 核心模块的引入，减小体积

<hr>

### 路由懒加载优化

- 使用
  - 需要配合 suspense 标签
  - 需要 import() 动态导入

```jsx
const LazyComponent = React.lazy(() => import('./pages/Home'))
return (
  <Suspense fallback={Loading}>
    <LazyComponent />
  </Suspense>
)
```

- webpack 魔法注释开启 prefect，浏览器空闲时就会加载文件

```jsx
const LazyHome = dynamicRoute(() => import(/*webpackPrefetch: true*/ './pages/Home'))
```

- React.lazy 的原理
  借助 `import()` 返回 `promise`，在`then`之后拿到组件进行渲染

<hr>

### 更新优化

1. `PureComponent` 用于类组件，它重写了 `shouldComponentUpdate`，当传递给子组件的`props`不变时（浅对比），那么子组件不会重新渲染

2. `React.memo` 用于函数组件，作用同`PureComponent`

3. 使用 `immutable` 不可变数据，immutable 每次都会返回一个**新的引用地址**的对象，但是会尽可能的复用老对象的属性，可以高性能的进行深度比较

4. 使用 reselect 优化 redux

   - redux 每次 dispatch 后，都会让注册的回调函数都执行一遍，导致性能浪费
   - reselect 的出现就是为了避免一些不必要的 mapStateToProps 的计算，提升性能
   - reselect 使用场景： ① 当组件中的 state 需要经过**复杂的计算**才能呈现在界面上 ② store 状态树庞大且层次较深

<hr>

### 大数据 异步加载优化

当页面上渲染大量数据的时候，页面上的一些控件比如 input 框 就会失去响应，可以使用 `requestAnimationFrame（宏任务）`、`setTimeout`、`requestIdleCallback` 等进行时间切片的优化

React 自己实现了一套 `requestIdleCallback` ，使用 `MessageChannel（宏任务）` 模拟的

```js
通过构造函数 MessageChannel() 可以创建一个消息通道，实例化的对象会继承两个属性：port1 和 port2

// 1、port1 和 port2 可以进行通信
const {port1, port2} = new MessageChannel()
port1.onmessage = (msg)=>{}
port2.onmessage = (msg)=>{}
port1.postMessage('port1')
port2.postMessage('port2')

// 2、可以用于 web worker 的两个worker通信
let worker1 = new Worker('./worker1.js')
let worker2 = new Worker('./worker2.js')
const {port1, port2} = new MessageChannel()
worker1.postMessage('msg', [port1])   // 把 port1 分配给 worker1
worker2.postMessage('msg', [port2])   // 把 port2 分配给 worker2
worker1.onmessage = function(event) {
    console.log(event.data);
}
worker2.onmessage = function(event) {
    console.log(event.data);
}

// 3、通信的过程可以实现 深拷贝
JSON.parse(JSON.stringify(object))的方式会忽略 undefined、function、symbol 和循环引用的对象
通过MessageChannel的深拷贝只能解决 undefined 和循环引用对象的问题，对于 Symbol 和 function 依然束手无策

function deepClone(obj) {
  return new Promise((resolve, reject)=>{
    const {port1, port2} = new MessageChannel()
    port1.onmessage = (data) => resolve(data)
    port2.postMessage(obj)
  })
}

注意：该方法是异步的，因为 messageChannel是异步的
let cloneObj = await deepClone(obj)
```

<hr>

### 大数据 虚拟列表优化

#### 1、 CSS 页面渲染优化属性：will-change

当我们通过某些行为(点击、移动或滚动)触发页面进行大面积绘制的时候，浏览器往往是没有准备的，只能被动使用 `CPU 去计算与重绘`，由于没有事先准备，应付渲染够呛，于是掉帧卡顿

而 CSS 属性 `will-change` 为 web 开发者提供了一种告知浏览器该元素会有哪些变化的方法，这样浏览器可以在元素属性真正发生变化之前提前做好对应的优化准备工作。这种优化可以将一部分复杂的计算工作提前准备好，使页面的反应更为快速灵敏

`GPU` 是图形处理器，专门处理和绘制图形相关的硬件。GPU 是专为执行复杂的数学和几何计算而设计的，使得 `CPU` 从图形处理的任务中解放出来，可以执行其他更多的系统任务

所谓`硬件加速`，就是在计算机中把计算量非常大的工作分配给`专门的硬件`来处理，减轻 `CPU` 的工作量

CSS 的动画、变形、渐变**并不会自动触发** `GPU 加速`，而是使用浏览器稍慢的软件渲染引擎

只有 3D 变形会有自己的 layer，触发`GPU 加速`，而 2D 变形不会

所以我们经常会使用一种 `hack方式`，使用`translateZ()` 或 `translate3d()`方法为元素添加没有变化的 3D 变形，骗取浏览器启用 `GPU 加速`，但是代价就是，创建了额外的图层，占用了 RAM 和 GPU 的存储空间，且无法确定空间释放时间

```css
/* 不要像这样，在元素上直接使用 will-change
这样会导致浏览器将对应的优化工作一直保存在内存中，这其实是不必要的 */
.will-change {
  will-change: transform;
  transition: transform 0.3s;
}
.will-change:hover {
  transform: scale(1.5);
}

/* 在需要的时候才添加。可以让父元素hover的时候声明 will-change，这样在移出的时候就会remove */
.will-change-parent:hover .will-change {
  will-change: transform;
}
.will-change {
  transition: transform 0.3s;
}
.will-change:hover {
  transform: scale(1.5);
}
```

```js
// 通过js脚本准确的控制 will-change 属性
let el = document.getElementById('element')
el.addEventListener('mouseenter', openOpitimize)
el.addEventListener('animationEnd', removeOpitimize)

const openOpitimize = () => (this.style.willChange = 'transform, opacity') // 属性值填写动画中的改变
const removeOpitimize = () => (this.style.willChange = 'auto')
```

<hr>

#### 2、react-tiny-virtual-list 虚拟列表

原理：定义每行高度，可视区高度，每次只渲染可视区内的内容，子元素通过`position: absolute`定位，上下各富余 3 个缓冲子元素，防止拖动太快有白屏

### 其他

1. react 17 之后不需要再引入 react，因为编译器变了，之前是通过`React.createElement('div')`，之后不再需要`React`这个变量了，直接通过`require('react/jsx-runtime')('div')`
