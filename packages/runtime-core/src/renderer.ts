import { isObject } from '@mini-vue/shared'
import { processComponent } from './component'

export function render(vnode, container) {
  patch(vnode, container)
}

export function patch(vnode, container) {
  if (isObject(vnode.type))
    processComponent(vnode, container)
  else if (typeof vnode.type === 'string')
    processElement(vnode, container)
}

function processElement(vnode, container) {
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  // 这里的 vnode 就是 component 里面的 subTree
  const el: Element = vnode.el = document.createElement(vnode.type)

  for (const key in vnode.props) {
    const value = vnode.props[key]
    el.setAttribute(key, value)
  }

  const { children } = vnode

  if (Array.isArray(children))
    mountChildren(children, el)
  else
    el.append(children)

  container.append(el)
}

function mountChildren(children, container) {
  children.forEach((child) => {
    patch(child, container)
  })
}
