import { useCallback, useEffect } from 'react'

export default function App1() {
  // num变了，cbfn才会变
  const cbfn = useCallback(() => {
    console.log(num)
  }, [num])

  // cbfn变了，才会执行useEffect
  useEffect(() => {
    cbfn()
  }, [cbfn])
}
