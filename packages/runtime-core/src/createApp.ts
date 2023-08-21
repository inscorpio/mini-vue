import { createVNode } from './vnode'

export function createAppAPI(render) {
  return (rootComponent) => {
    return {
      mount(rootContainer) {
      // 后续的所有的东西都是基于 vnode 处理的
        const vnode = createVNode(rootComponent)

        render(vnode, rootContainer)
      },
    }
  }
}
