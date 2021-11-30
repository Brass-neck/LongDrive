import React, { Suspense } from 'react'
import Loading from '../components/Loading'

/**
 * 动态加载路由组件
 * @param {function} loadComponentFn
 */
export function dynamicRoute(loadComponentFn) {
  const LazyComponent = React.lazy(loadComponentFn)
  return () => (
    <Suspense fallback={Loading}>
      <LazyComponent />
    </Suspense>
  )
}
