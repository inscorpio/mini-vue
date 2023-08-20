import { ShapeFlags } from '@mini-vue/shared/src/shapeFlags'
import { processComponent } from './component'
import { Fragment, Text, normalizeVNode } from './vnode'

export function render(vnode, container) {
  patch(vnode, null, container)
}

export function patch(vnode, parent, container) {
  const { type, shapeFlag } = vnode
  switch (type) {
    case Text:
      processText(vnode, container)
      break
    case Fragment:
      processFragment(vnode, parent, container)
      break
    default:
      if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT)
        processComponent(vnode, parent, container)
      else if (shapeFlag & ShapeFlags.ELEMENT)
        processElement(vnode, parent, container)
      break
  }
}

function processText(vnode, container) {
  const textNode = document.createTextNode(vnode.children)

  container.append(textNode)
}

function processFragment(vnode, parent, container) {
  mountChildren(vnode.children, parent, container)
}

function processElement(vnode, parent, container) {
  mountElement(vnode, parent, container)
}

function mountElement(vnode, parent, container) {
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
    mountChildren(children, parent, el)
  else if (shapeFlag & ShapeFlags.TEXT_CHILDREN)
    el.append(children)

  container.append(el)
}

function mountChildren(children, parent, container) {
  children.forEach((child) => {
    patch(normalizeVNode(child), parent, container)
  })
}
