import { ShapeFlags } from '@mini-vue/shared/src/shapeFlags'
import { Fragment, Text, normalizeVNode } from './vnode'
import { createComponentInstance, setupComponent } from './component'
import { createAppAPI } from './createApp'

export function createRenderer(options) {
  const { createElement, patchProp, insert } = options

  function render(vnode, container) {
    patch(vnode, null, container)
  }

  function patch(vnode, parent, container) {
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

  function processComponent(vnode, parent, container) {
    mountComponent(vnode, parent, container)
  }

  function mountComponent(vnode, parent, container) {
    const instance = createComponentInstance(vnode, parent)
    setupComponent(instance)
    setupRenderEffect(instance, container)
  }

  function setupRenderEffect(instance, container) {
    const { proxy, render, vnode } = instance
    const subTree = normalizeVNode(render.call(proxy))
    patch(subTree, instance, container)

    // subTree 上的 el 是在 mountElement 的时候赋值的
    // 等所有的 element 类型处理完成之后将 el 挂载到 vnode 上
    vnode.el = subTree.el
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
    const el: Element = vnode.el = createElement(type)

    for (const key in props)
      patchProp(el, key, props[key])

    if (shapeFlag & ShapeFlags.ARRAY_CHILDREN)
      mountChildren(children, parent, el)
    else if (shapeFlag & ShapeFlags.TEXT_CHILDREN)
      el.append(children)

    insert(el, container)
  }

  function mountChildren(children, parent, container) {
    children.forEach((child) => {
      patch(normalizeVNode(child), parent, container)
    })
  }

  return {
    createApp: createAppAPI(render),
  }
}
