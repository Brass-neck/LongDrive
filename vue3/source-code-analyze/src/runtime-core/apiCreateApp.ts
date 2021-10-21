import { createVnode } from './vnode'

/**
 * 1. api都单独抽离为文件，文件名以api开头
 * 2. 通过包一层函数的方式，拿到 renderer.ts传过来的render方法
 */
export function createApp(render) {
  return (rootComponent, rootProps) => {
    // app就是应用，会有很多属性，和mount方法
    const app = {
      _component: rootComponent,
      _props: rootProps,
      _container: null,

      mount(container) {
        app._container = container

        // 1. 根据用户传入的组件，生成一个虚拟节点
        const vnode = createVnode(rootComponent, rootProps)

        // 2. 把虚拟节点渲染到容器中
        render(vnode, container)
      }
    }

    return app
  }
}
