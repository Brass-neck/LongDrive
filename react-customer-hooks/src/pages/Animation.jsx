import React from 'react'
import useAnimation from '../hooks/useAnimation'
import './animation.css'

export default function Animation() {
  const [baseClsn, toggle] = useAnimation('circle', 'active')
  return (
    <div className={baseClsn} onClick={toggle}>
      Click me
    </div>
  )
}
