/**
 *
 * 这里手写react一些方法的底层原理
 *
 */

/**
 * 手写 React.lazy 原理
 *
 * import() 返回一个promise，可以then拿到结果
 */
function lazy(loadComponentFn) {
  return class extends React.Component {
    state = { Component: null }

    componentDidMount() {
      loadComponentFn().then((res) => {
        this.setState({ Component: res.default })
      })
    }

    render() {
      const { Component } = this.state
      return Component && <Component />
    }
  }
}

/**
 * 手写 PureComponent 原理
 *
 * state 和 props 有一个和老的不一样，就更新
 */
class PureComponent extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !isShallowEqual(this.props, nextProps) || !isShallowEqual(this.state, nextState)
  }
}

function isShallowEqual(obj1, obj2) {
  if (obj1 == obj2) return true

  let keys1 = Object.keys(obj1)
  let keys2 = Object.keys(obj2)
  if (keys1.length != keys2.length) return false
  for (const key of keys1) {
    if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) return false
  }
  return true
}

/**
 *
 * 手写 memo 原理
 *
 * 实际上是一个 HOC 高阶组件，接收一个老组件，返回一个新组件
 */
function memo(OldFunctionComponent) {
  return class extends PureComponent {
    render() {
      return <OldFunctionComponent {...this.props} />
    }
  }
}

/**
 * 手写 reselect 的 createSelector 原理
 *
 * @param {*} depSelectors 这个计算selector依赖的selector
 * @param {*} compute 根据依赖进行计算的函数
 * @returns
 */
function createSelector(depSelectors, compute) {
  // 缓存
  let lastValue
  return function (state) {
    // 判断依赖是否变化，变化了就走下面的重新计算，否则直接返回lastValue
    let values = depSelectors.map((dep) => dep(state))
    let result = compute(...values)
    lastValue = result
    return lastValue
  }
}
