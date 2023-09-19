import { ShapeFlags } from '@mini-vue/shared/src/shapeFlags'
import { proxyRefs } from '@mini-vue/reactivity'
import { effect } from '@mini-vue/reactivity/src/effect'
import { Fragment, Text, normalizeVNode } from './vnode'
import { createComponentInstance, setupComponent } from './component'
import { createAppAPI } from './createApp'

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options

  function render(vnode, container) {
    patch(null, vnode, container, null, null)
  }

  function patch(n1, n2, container, parentComponentInstance, anchor) {
    const { type, shapeFlag } = n2
    switch (type) {
      case Text:
        processText(n1, n2, container)
        break
      case Fragment:
        processFragment(n1, n2, container, parentComponentInstance, anchor)
        break
      default:
        if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT)
          processComponent(n1, n2, container, parentComponentInstance, anchor)
        else if (shapeFlag & ShapeFlags.ELEMENT)
          processElement(n1, n2, container, parentComponentInstance, anchor)
        break
    }
  }

  function processComponent(n1, n2, container, parentComponentInstance, anchor) {
    mountComponent(n2, container, parentComponentInstance, anchor)
  }

  function mountComponent(vnode, container, parentComponentInstance, anchor) {
    const instance = createComponentInstance(vnode, parentComponentInstance)
    setupComponent(instance)
    setupRenderEffect(instance, container, anchor)
  }

  function setupRenderEffect(instance, container, anchor) {
    const { proxy, render, vnode } = instance
    effect(() => {
      if (!instance.isMounted) {
        const subTree = normalizeVNode(render.call(proxyRefs(proxy)))
        patch(null, subTree, container, instance, anchor)

        // subTree 上的 el 是在 mountElement 的时候赋值的
        // 等所有的 element 类型处理完成之后将 el 挂载到 vnode 上
        vnode.el = subTree.el
        instance.isMounted = true
        instance.subTree = subTree
      }
      else {
        const previousSubTree = instance.subTree
        const subTree = normalizeVNode(render.call(proxyRefs(proxy)))
        patch(previousSubTree, subTree, container, instance, anchor)

        vnode.el = subTree.el
        instance.subTree = subTree
      }
    })
  }

  function processText(n1, n2, container) {
    const textNode = document.createTextNode(n2.children)

    container.append(textNode)
  }

  function processFragment(n1, n2, container, parentComponentInstance, anchor) {
    mountChildren(n2.children, container, parentComponentInstance, anchor)
  }

  function processElement(n1, n2, container, parentComponentInstance, anchor) {
    !n1
      ? mountElement(n1, n2, container, parentComponentInstance, anchor)
      : patchElement(n1, n2, parentComponentInstance, anchor)
  }

  function mountElement(n1, n2, container, parentComponentInstance, anchor) {
    const { type, props, children, shapeFlag } = n2
    // 这里的 n2 就是 component 里面的 subTree
    const el: Element = n2.el = hostCreateElement(type)

    for (const key in props) {
      if (Object.prototype.hasOwnProperty.call(props, key))
        hostPatchProp(el, key, null, props[key])
    }

    if (shapeFlag & ShapeFlags.ARRAY_CHILDREN)
      mountChildren(children, el, parentComponentInstance, anchor)
    else if (shapeFlag & ShapeFlags.TEXT_CHILDREN)
      el.textContent = children

    hostInsert(el, container, anchor)
  }

  function mountChildren(children, container, parentComponentInstance, anchor) {
    children.forEach((child) => {
      patch(null, normalizeVNode(child), container, parentComponentInstance, anchor)
    })
  }

  function patchElement(n1, n2, parentComponentInstance, anchor) {
    const el = n2.el = n1.el
    patchChildren(n1, n2, el, parentComponentInstance, anchor)
    patchProps(el, n1.props, n2.props)
  }

  function patchChildren(n1, n2, container, parentComponentInstance, anchor) {
    const { children: c1, shapeFlag: s1 } = n1
    const { children: c2, shapeFlag: s2 } = n2

    if (s1 & ShapeFlags.TEXT_CHILDREN) {
      // text to array
      if (s2 & ShapeFlags.ARRAY_CHILDREN) {
        hostSetElementText(container, null)
        mountChildren(c2, container, parentComponentInstance, anchor)
      }
    }
    else if (s1 & ShapeFlags.ARRAY_CHILDREN) {
      // array to text
      if (s2 & ShapeFlags.TEXT_CHILDREN)
        // Questions:
        // 就算不移除子节点结果也是正确的
        unmountChildren(c1)
      // array to array
      else
        patchKeyedChildren(c1, c2, container, parentComponentInstance, anchor)
    }

    // common: new children are text type
    if (s2 & ShapeFlags.TEXT_CHILDREN) {
      if (c1 !== c2)
        hostSetElementText(container, c2)
    }
  }

  function patchKeyedChildren(c1, c2, container, parentComponentInstance, parentAnchor) {
    let i = 0
    const l2 = c2.length
    let e1 = c1.length - 1
    let e2 = l2 - 1

    const isSameVNode = (n1, n2) => {
      return n1.type === n2.type && n1.key === n2.key
    }

    // 1. sync from start
    // a b c
    // a b d e
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]
      if (isSameVNode(n1, n2)) {
        patch(n1, n2, container, parentComponentInstance, parentAnchor)
        i++
      }
      else {
        break
      }
    }

    // 2. sync from end
    //   c a b
    // d e a b
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]
      if (isSameVNode(n1, n2)) {
        patch(n1, n2, container, parentComponentInstance, parentAnchor)
        e1--
        e2--
      }
      else {
        break
      }
    }

    // 3. common sequence + mount
    // a b
    // a b c
    // { i: 2, e1: 1, e2: 2 }
    //   a b
    // c a b
    // { i: 0, e1: -1, e2: 1 }
    if (i > e1) {
      const nextPos = e2 + 1
      const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor
      while (i <= e2) {
        patch(null, c2[i], container, parentComponentInstance, anchor)
        i++
      }
    }

    // 4. common sequence + unmount
    // a b c
    // a b
    else if (i > e2) {
      while (i <= e1) {
        hostRemove(c1[i].el)
        i++
      }
    }

    // diff middle
    // a b (d u e m) f g
    // a b (m n U e) f g
    else {
      const s1 = i
      const s2 = i
      const keyToNewIndexMap = getKeyToNewIndexMap()
      const toBePatched = e2 - s2 + 1
      let patched = 0

      // 遍历旧的节点
      for (let i = s1; i <= e1; i++) {
        const n1 = c1[i]

        // perf: 如果新节点已经处理完了，依然存在旧节点，在可以直接将剩下的节点删除
        if (patched >= toBePatched) {
          hostRemove(n1.el)
          continue
        }

        // 旧节点对应在新节点中的索引
        const newIndex = findSameVNodeIndex(n1)
        const n2 = c2[newIndex]

        if (newIndex) {
          patch(n1, n2, container, parentComponentInstance, null)
          patched++
        }
        else {
          hostRemove(n1.el)
        }

        function findSameVNodeIndex(n1) {
          if (n1.key) {
            return keyToNewIndexMap.get(n1.key)
          }
          else {
            for (let j = s2; j <= e2; j++) {
              if (isSameVNode(n1, c2[j])) {
                return j
              }
            }
          }
        }
      }

      function getKeyToNewIndexMap() {
        const keyToIndexMap = new Map()
        if (c2[s2].key) {
          for (let i = s2; i <= e2; i++) {
            const n2 = c2[i]
            keyToIndexMap.set(n2.key, i)
          }
        }
        return keyToIndexMap
      }
    }
  }

  function unmountChildren(children) {
    children.forEach((child) => {
      // Questions:
      // 这里的 child 一定是 vnode 吗？
      child.el && hostRemove(child.el)
    })
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
