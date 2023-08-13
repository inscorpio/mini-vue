import { ShapeFlags } from '@mini-vue/shared/src/shapeFlags'
import { processComponent } from './component'

export function render(vnode, container) {
  patch(vnode, container)
}

export function patch(vnode, container) {
  const { shapeFlag } = vnode
  if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT)
    processComponent(vnode, container)
  else if (shapeFlag & ShapeFlags.ELEMENT)
    processElement(vnode, container)
}

function processElement(vnode, container) {
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  const { type, props, children, shapeFlag } = vnode
  // 这里的 vnode 就是 component 里面的 subTree
  const el: Element = vnode.el = document.createElement(type)

  for (const key in props) {
    const value = props[key]
    const isOn = (key: string) => /^on[A-Z]/.test(key)

    if (isOn(key))
      el.addEventListener(key.slice(2).toLowerCase(), value)
    else
      el.setAttribute(key, value)
  }

  if (shapeFlag & ShapeFlags.ARRAY_CHILDREN)
    mountChildren(children, el)
  else if (shapeFlag & ShapeFlags.TEXT_CHILDREN)
    el.append(children)

  container.append(el)
}

function mountChildren(children, container) {
  children.forEach((child) => {
    patch(child, container)
  })
}