import { ShapeFlags } from '@mini-vue/shared/src/shapeFlags'
import { proxyRefs } from '@mini-vue/reactivity'
import { effect } from '@mini-vue/reactivity/src/effect'
import { Fragment, Text, normalizeVNode } from './vnode'
import { createComponentInstance, setupComponent } from './component'
import { createAppAPI } from './createApp'

export function createRenderer(options) {
  const { createElement: hostCreateElement, patchProp: hostPatchProp, insert: hostInsert } = options

  function render(vnode, container) {
    patch(null, vnode, null, container)
  }

  // TODO: 修改参数顺序为 n1, n2, container, parentComponentInstance
  function patch(n1, n2, parent, container) {
    const { type, shapeFlag } = n2
    switch (type) {
      case Text:
        processText(n1, n2, container)
        break
      case Fragment:
        processFragment(n1, n2, parent, container)
        break
      default:
        if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT)
          processComponent(n1, n2, parent, container)
        else if (shapeFlag & ShapeFlags.ELEMENT)
          processElement(n1, n2, parent, container)
        break
    }
  }

  function processComponent(n1, n2, parent, container) {
    mountComponent(n2, parent, container)
  }

  function mountComponent(vnode, parent, container) {
    const instance = createComponentInstance(vnode, parent)
    setupComponent(instance)
    setupRenderEffect(instance, container)
  }

  function setupRenderEffect(instance, container) {
    const { proxy, render, vnode } = instance
    effect(() => {
      if (!instance.isMounted) {
        const subTree = normalizeVNode(render.call(proxyRefs(proxy)))
        patch(null, subTree, instance, container)

        // subTree 上的 el 是在 mountElement 的时候赋值的
        // 等所有的 element 类型处理完成之后将 el 挂载到 vnode 上
        vnode.el = subTree.el
        instance.isMounted = true
        instance.subTree = subTree
      }
      else {
        const previousSubTree = instance.subTree
        const subTree = normalizeVNode(render.call(proxyRefs(proxy)))
        patch(previousSubTree, subTree, instance, container)

        vnode.el = subTree.el
        instance.subTree = subTree
      }
    })
  }

  function processText(n1, n2, container) {
    const textNode = document.createTextNode(n2.children)

    container.append(textNode)
  }

  function processFragment(n1, n2, parent, container) {
    mountChildren(n2.children, parent, container)
  }

  function processElement(n1, n2, parent, container) {
    !n1
      ? mountElement(n1, n2, parent, container)
      : patchElement(n1, n2)
  }

  function mountElement(n1, n2, parent, container) {
    const { type, props, children, shapeFlag } = n2
    // 这里的 n2 就是 component 里面的 subTree
    const el: Element = n2.el = hostCreateElement(type)

    for (const key in props) {
      if (Object.prototype.hasOwnProperty.call(props, key))
        hostPatchProp(el, key, null, props[key])
    }

    if (shapeFlag & ShapeFlags.ARRAY_CHILDREN)
      mountChildren(children, parent, el)
    else if (shapeFlag & ShapeFlags.TEXT_CHILDREN)
      el.append(children)

    hostInsert(el, container)
  }

  function mountChildren(children, parent, container) {
    children.forEach((child) => {
      patch(null, normalizeVNode(child), parent, container)
    })
  }

  function patchElement(n1, n2) {
    const el = n2.el = n1.el
    // TODO: patchChildren

    patchProps(el, n1.props, n2.props)
  }

  function patchProps(el, oldProps, newProps) {
    if (oldProps === newProps)
      return

    updateProps()
    removeProps()

    function updateProps() {
      for (const key in newProps) {
        if (Object.prototype.hasOwnProperty.call(newProps, key)) {
          if (oldProps !== newProps)
            hostPatchProp(el, key, oldProps[key], newProps[key])
        }
      }
    }

    function removeProps() {
      for (const key in oldProps) {
        if (Object.prototype.hasOwnProperty.call(oldProps, key)) {
          if (!(key in newProps))
            hostPatchProp(el, key, oldProps[key], null)
        }
      }
    }
  }

  return {
    createApp: createAppAPI(render),
  }
}
