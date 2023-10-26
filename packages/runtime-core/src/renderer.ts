import { ShapeFlags } from '@mini-vue/shared/src/shapeFlags'
import { proxyRefs } from '@mini-vue/reactivity'
import { effect } from '@mini-vue/reactivity/src/effect'
import { Fragment, Text, normalizeVNode } from './vnode'
import { createComponentInstance, setupComponent } from './component'
import { createAppAPI } from './createApp'
import { shouldUpdateComponent } from './componentUpdateUtils'
import { queueJob } from './scheduler'

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
    !n1
      ? mountComponent(n2, container, parentComponentInstance, anchor)
      : updateComponent(n1, n2)
  }

  // 实现方式与课程不一致，但是效果正确
  // 都没有使用 updateComponentPreRender 方法，instance.next 等
  function updateComponent(n1, n2) {
    const instance = n2.component = n1.component
    n2.el = n1.el
    instance.props = n2.props
    shouldUpdateComponent(n1.props, n2.props) && instance.update()
  }

  function mountComponent(vnode, container, parentComponentInstance, anchor) {
    const instance = vnode.component = createComponentInstance(vnode, parentComponentInstance)
    setupComponent(instance)
    setupRenderEffect(instance, container, anchor)
  }

  function setupRenderEffect(instance, container, anchor) {
    instance.update = effect(
      () => {
        // console.log(`update component: ${instance.type.name}`)
        const { proxy, render, vnode, subTree: oldSubTree } = instance
        const context = proxyRefs(proxy)
        const newSubTree = normalizeVNode(render.call(context, context))
        patch(oldSubTree, newSubTree, container, instance, anchor)
        vnode.el = newSubTree.el
        instance.subTree = newSubTree
      },
      {
        scheduler: () => {
          // console.log(`update ${instance.type.name}'s data -> `, instance.setupState.count)
          queueJob(instance.update)
        },
      },
    )
  }

  function processText(n1, n2, container) {
    const textNode = document.createTextNode(n2.children)

    container.append(textNode)
  }

  function processFragment(n1, n2, container, parentComponentInstance, anchor) {
    !n1
      ? mountChildren(n2.children, container, parentComponentInstance, anchor)
      : patchChildren(n1, n2, container, parentComponentInstance, anchor)
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

    // 5. unknown sequence
    // a b (d u e m) f g
    // a b (m n U e) f g
    else {
      const s1 = i
      const s2 = i
      const keyToNewIndexMap = getKeyToNewIndexMap()
      const toBePatched = e2 - s2 + 1
      let patched = 0
      const newIndexToOldIndexMap = Array.from<number>({ length: toBePatched }).fill(0)
      // 优化是否移动(不是很懂)
      let maxNewIndexSoFar = 0
      let moved = false

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
          // 由于 newIndexToOldIndexMap 的初始值为 0，而在这里 i 为 0 代表第一个老节点，所以将索引 +1
          newIndexToOldIndexMap[newIndex - s2] = i + 1
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex
          }
          else {
            moved = true
          }
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

      // 5.3 move and mount
      // 根据最长递增子序列得到不需要处理的元素索引
      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToOldIndexMap)
        : []
      let j = increasingNewIndexSequence.length - 1

      // 如果正序处理会出现新增多个节点时，后续节点还未插入到视图中导致 anchor 错误，所以使用倒序的方式处理，保证 anchor 始终是正确的
      for (let i = toBePatched - 1; i >= 0; i--) {
        // 当新节点在旧节点中在不存在时则新增
        const newIndex = s2 + i
        const n2 = c2[newIndex]
        const nextPos = newIndex + 1
        const anchor = nextPos < l2 ? c2[nextPos].el : null
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, n2, container, parentComponentInstance, anchor)
        }
        else if (moved) {
          // 如果当前元素不需要处理，就对比下一个
          if (i === increasingNewIndexSequence[j]) {
            j--
          }
          else {
            hostInsert(n2.el, container, anchor)
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

// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
function getSequence(arr: number[]): number[] {
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      while (u < v) {
        c = (u + v) >> 1
        if (arr[result[c]] < arrI) {
          u = c + 1
        }
        else {
          v = c
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]
        }
        result[u] = i
      }
    }
  }
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}
