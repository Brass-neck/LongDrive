import React, { useState, useRef, useEffect } from 'react'

export default function Home() {
  // 封装一个带有callback的 useState hook
  function useCallbackState(initialState) {
    const cbRef = useRef()
    const [data, setData] = useState(initialState)

    useEffect(() => {
      cbRef.current && cbRef.current(data)
    }, [data])

    return [
      data,
      function (state, callback) {
        cbRef.current = callback
        setData(state)
      }
    ]
  }

  const [list, setlist] = useCallbackState([])

  const timeSlice = (num, per) => {
    if (num >= per)
      requestAnimationFrame(() => {
        console.log('rafing')
        num -= per
        setlist([...list, ...new Array(per).fill(0)], () => {
          timeSlice(num, per)
        })
      })
  }

  const renderData = () => {
    // 直接一次性设置 1w 条数据，会卡死，input框失去响应
    // setlist(new Array(10000).fill(0))

    // 使用时间分片
    timeSlice(10000, 500)
  }

  return (
    <div>
      <input type='text' />
      <button onClick={() => renderData()}>加载数据</button>
      <ul>{list && list.map((l, i) => <li key={i}>{l}</li>)}</ul>
    </div>
  )
}
