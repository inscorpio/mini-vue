import { isObject } from '@mini-vue/shared'
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
  const { proxy, render } = instance
  const subTree = render.call(proxy)
  patch(subTree, container)
}

function setupComponent(instance) {
  // TODO
  // initProps()
  // initSlots()
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  const { type: Component } = instance

  const { setup } = Component
  const setupResult = setup?.()
  handleSetupResult(instance, setupResult)
}

function createComponentInstanceProxy(instance) {
  const { setupState } = instance
  instance.proxy = new Proxy(
    {},
    {
      get(target, key) {
        if (key in setupState)
          return Reflect.get(setupState, key)
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
  }
}
