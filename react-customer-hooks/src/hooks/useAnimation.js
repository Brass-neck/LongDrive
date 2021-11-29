import { useState } from 'react'

export default function useAnimation(baseClsn, activeClsn) {
  const [className, setclassName] = useState(baseClsn)
  const toggle = () => {
    className === baseClsn ? setclassName(`${baseClsn} ${activeClsn}`) : setclassName(baseClsn)
  }
  return [className, toggle]
}
