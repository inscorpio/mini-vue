import { shallowReadonly } from '@mini-vue/reactivity'
import { emit } from './componentEmit'
import { initSlots } from './componentSlots'
import { initProps } from './componentProps'
import { PublicInstanceProxyHandlers } from './componentPublicInstance'

export function setupComponent(instance) {
  initProps(instance, instance.vnode.props)
  initSlots(instance)
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  // 我觉得现在好像没必要挂载到 instance 上，因为直接在这里就能处理，而且后续也没有使用到
  instance.emit = emit.bind(null, instance)

  const { type: Component, props } = instance

  // Questions
  // 1. PublicInstanceProxyHandlers 内部使用了 setupState, 为什么 instance.proxy 赋值要比 handleSetupResult 先处理？
  // 2. 如果直接将 PublicInstanceProxyHandlers 的内容放到 handlers 参数位置 emit 测试 case 会失败？
  //    - 间接原因是 Foo 组件 render 函数内 this 指向的是父组件（App）内传给 Foo 组件的 props, 而不是 Foo 组件实例的 instance.proxy
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)

  const { setup } = Component
  setCurrentInstance(instance)
  const setupResult = setup?.(shallowReadonly(props), { emit: instance.emit })
  setCurrentInstance(null)

  handleSetupResult(instance, setupResult)
}

function handleSetupResult(instance, setupResult) {
  instance.setupState = setupResult
  // TODO: handler render function

  finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
  const { type: Component } = instance

  instance.render = Component.render
}

export function createComponentInstance(vnode, parent) {
  return {
    vnode,
    parent,
    type: vnode.type,
    setupState: null,
    proxy: null,
    render: null,
    props: null,
    emit: null,
    slots: null,
    update: null,
    subTree: null,
    // 这里直接以 parent.provides 为原型创建 provides, 和课程的实现方式不一样
    provides: parent ? Object.create(parent.provides) : {},
  }
}

let currentInstance = null

export function getCurrentInstance() {
  return currentInstance
}

function setCurrentInstance(instance) {
  currentInstance = instance
}
