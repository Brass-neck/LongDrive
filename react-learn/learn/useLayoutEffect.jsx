import React, { useEffect } from 'react'

export default function useLayoutEffecter() {
  const [num, setnum] = React.useState(0)

  // 用 useEffect，点击 button 页面会闪烁，因为页面会渲染 两次
  // 执行顺序：点击，set 0，页面渲染一次后，执行 effect，set random，页面渲染一次

  useEffect(() => {
    if (num === 0) {
      console.log('num=0 effect')
      const random = Math.random()
      setnum(random)
    }
  }, [num])

  // 用 useLayoutEffect，点击 button 不闪烁，因为页面会渲染 一次
  // 执行顺序：点击，set 0，页面渲染前，useLayoutEffect中set random，页面渲染一次
  useLayoutEffect(() => {
    if (num === 0) {
      console.log('num=0 effect')
      const random = Math.random()
      setnum(random)
    }
  }, [num])
  return (
    <div>
      <p>{num}</p>
      <button onClick={() => setnum(0)}>click</button>
    </div>
  )
}

/**
 * useEffect 和 useLayoutEffect 的对比：
 *
 * 1、useEffect 是异步的，useLayoutEffect 是同步的
 * 2、useEffect 是在页面渲染完成之后，异步执行；useLayoutEffect 是在页面渲染之前，同步执行
 * 3、useLayoutEffect 的 callback 会在 DOM更新完成后、页面绘制到浏览器之前完成
 * 4、执行顺序：useLayoutEffect -> 浏览器绘制 -> useEffect
 *
 */
