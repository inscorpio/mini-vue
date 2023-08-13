import { isObject } from '@mini-vue/shared'
import { reactiveHandlers, readonlyHandlers, shallowReactiveHandlers } from './baseHanders'

export enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}
// 为什么不叫 createProxyObject 呢？
export function createReactiveObject(target, handlers) {
  if (!isObject(target))
    return console.warn(`${target} is not an object`)
  return new Proxy(target, handlers)
}

export function reactive<T extends object>(target: T) {
  return createReactiveObject(target, reactiveHandlers)
}

export function readonly<T extends object>(target: T) {
  return createReactiveObject(target, readonlyHandlers)
}

export function shallowReadonly<T extends object>(target: T) {
  return createReactiveObject(target, shallowReactiveHandlers)
}

export function isReactive(value: unknown) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value: unknown) {
  return !!value[ReactiveFlags.IS_READONLY]
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value)
}
