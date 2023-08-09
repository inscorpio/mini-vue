import { render } from './renderer'
import { createVNode } from './vnode'

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // 后续的所有的东西都是基于 vnode 处理的
      const vnode = createVNode(rootComponent)

      render(vnode, rootContainer)
    },
  }
}
