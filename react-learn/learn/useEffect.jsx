import React from 'react'

export default function useEffecter() {
  return <div>useEffect</div>
}

/**
 * 1、在有 deps 依赖项的 useEffect中，清除函数会在 deps变化后每次都执行，并且会在下一次 useEffect 执行之前执行
 *
 * 2、如果 useState 是引用类型对象，且每次 setState 只修改对象的某一个属性，那么 deps 写成 obj 的属性名，
 * 就可以达到只有 obj 的属性变化时，才执行 useEffect；而不要写成 [obj]，这样每次 setState 都会执行 useEffect
 *
 */
