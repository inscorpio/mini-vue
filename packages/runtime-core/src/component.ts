import { hasOwn, isObject } from '@mini-vue/shared'
import { shallowReadonly } from '@mini-vue/reactivity'
import { patch } from './renderer'

export function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode)
  setupComponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container) {
  const { proxy, render, vnode } = instance
  const subTree = render.call(proxy)
  patch(subTree, container)

  // subTree 上的 el 是在 mountElement 的时候赋值的
  // 等所有的 element 类型处理完成之后将 el 挂载到 vnode 上
  vnode.el = subTree.el
}

function setupComponent(instance) {
  // TODO
  initProps(instance)
  // initSlots()
  setupStatefulComponent(instance)
}

function initProps(instance) {
  instance.props = shallowReadonly(instance.vnode.props ?? {})
}

function setupStatefulComponent(instance) {
  const { type: Component, props } = instance

  const { setup } = Component
  const setupResult = setup?.(props)
  handleSetupResult(instance, setupResult)
}

function createComponentInstanceProxy(instance) {
  const { setupState, props } = instance
  instance.proxy = new Proxy(
    {},
    {
      get(target, key) {
        if (hasOwn(setupState, key)) {
          return Reflect.get(setupState, key)
        }
        else if (hasOwn(props, key)) {
          return Reflect.get(props, key)
        }
        else {
          const map = {
            $el: i => i.vnode.el,
          }
          return map[key]?.(instance)
        }
      },
    },
  )
}

function handleSetupResult(instance, setupResult) {
  if (isObject(setupResult)) {
    instance.setupState = setupResult
    createComponentInstanceProxy(instance)
  }
  // TODO: handler render function

  finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
  const { type: Component } = instance

  instance.render = Component.render
}

function createComponentInstance(vnode) {
  return {
    vnode,
    type: vnode.type,
    setupState: null,
    proxy: null,
    render: null,
    props: null,
  }
}
