import { useEffect, useState } from 'react'

export default function useRequest(url) {
  // 查询参数
  const [options, setoptions] = useState({
    currentPage: 1,
    pageSize: 5
  })

  // 结果
  const [data, setdata] = useState({
    totalPage: 0,
    list: []
  })

  function getData() {
    let { currentPage, pageSize } = options
    fetch(`${url}?currentPage=${currentPage}&pageSize=${pageSize}`)
      .then((res) => res.json())
      .then((res) => setdata({ ...res }))
      .catch((e) => {
        console.error(e)
      })
  }

  useEffect(getData, [options, url])
  return [data, options, setoptions]
}
