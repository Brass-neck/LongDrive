import React, { useEffect, useRef, useState } from 'react'

function Time() {
  const time = useRef(new Date().getTime())
  return <>time组件：{time.current}</>
}

export default function App1() {
  /********** 1. ref.current 会保存上一次的值 *************/
  const [num, setnum] = useState(0)
  const ref = useRef()
  const refCurrent = ref.current

  useEffect(() => {
    // 每次 setnum 都会执行这个 effect
    // 虽然 ref.current 保存了上一次的值，但是页面不会渲染
    ref.current = num
  })

  /********** 2. 子组件的 ref.current 值不会变 *************/

  // 每次 setnum ，App1父组件会刷新，导致重新渲染子组件 Time
  // 但是 Time 组件的 ref.current 值不会变

  return (
    <div>
      <button onClick={() => setnum(num + 1)}>{num}</button>
      <p>{refCurrent}</p>
      <Time></Time>
    </div>
  )
}

/**
 * 总结
 * 1、ref.current 会保存上一次的值
 * 2、子组件的 ref.current 值不会变
 * 3、修改 ref.current 的值，页面不会重新渲染
 */
