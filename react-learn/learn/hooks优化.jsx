/**
 * 一、函数定义位置优化
 * 如果函数与组件内的 props和state 无关，将函数声明在组件外部
 */

const { useEffect } = require('react')

const formatData = (data) => {
  return data ? new Date(data).toLocaleDateString() : ''
}

function App1() {
  return <div>App1</div>
}

/**
 * 二、组件更新优化
 *
 * 传递给子组件的 props 一定要是稳定的，不要传递函数，因为函数每次都是新的，会导致子组件每次都会更新。
 * 如果要传递函数，使用 useCallback 包裹，并且子组件要使用 memo 包裹
 */

/**
 * 三、频繁操作 做防抖优化
 *
 * 例如：输入框输入时，频繁调用接口
 * 例如：window.resize 事件
 * 例如：window.scroll 事件
 * 例如：window.mousemove 事件
 */

function App2() {
  // 函数组件每次重新渲染，都会重新创建变量，导致防抖无效, 所以要使用 useRef 保留
  const debounce = (fn, delay) => {
    let timer
    return (...params) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        fn(...params)
      }, delay)
    }
  }

  return <div>App2</div>
}

// 正确版本，把 debounce 做成 hooks
function useDebounce(fn, delay) {
  const { current } = useRef({ fn, timer: null })

  useEffect(() => {
    current.fn = fn
  }, [fn])

  return function back(...args) {
    if (current.timer) clearTimeout(current.timer)
    current.timer = setTimeout(() => {
      current.fn.call(this, ...args)
    }, delay)
  }
}

function App3() {
  const [value, setValue] = useState('')

  // 触发太频繁
  // const onChange = (v) => {
  //   setValue(v)
  // }
  // 使用 debounce 优化
  const onChange = useDebounce((v) => {
    setValue(v)
  }, 500)

  useEffect(() => {
    queryData()
  }, [value])

  return (
    <div>
      <input type='text' onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
