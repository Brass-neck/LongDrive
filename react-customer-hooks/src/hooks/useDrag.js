import { useRef, useLayoutEffect, useState } from 'react'

export default function useDrag() {
  const position = useRef({
    lastX: 0,
    lastY: 0,
    x: 0,
    y: 0
  })

  const dragRef = useRef()

  const [, forceUpdate] = useState({})

  useLayoutEffect(() => {
    dragRef.current.onmousedown = function (e) {
      let startx = e.clientX
      let starty = e.clientY

      this.onmousemove = function (e) {
        position.current.x = position.current.lastX + (e.clientX - startx)
        position.current.y = position.current.lastY + (e.clientY - starty)
        forceUpdate({})
      }

      this.onmouseup = function (e) {
        position.current.lastX = position.current.x
        position.current.lastY = position.current.y
        this.onmousemove = null
      }
    }
  }, [])

  let style = { x: position.current.x, y: position.current.y }
  return [style, dragRef]
}
