import { reactiveHandlers, readonlyHandlers, shallowReactiveHandlers } from './baseHanders'

export enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

export function createReactiveObject(target, handlers) {
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
