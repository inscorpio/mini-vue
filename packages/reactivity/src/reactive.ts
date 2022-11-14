import { mutableHandles, readonlyHandlers } from './baseHandlers'

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

const createReactiveObject = (target, handlers) => {
  return new Proxy(target, handlers)
}

export const reactive = <T extends object>(target: T) => {
  return createReactiveObject(target, mutableHandles)
}

export const readonly = <T extends object>(target: T) => {
  return createReactiveObject(target, readonlyHandlers)
}

export const isReactive = (target) => {
  return !!target[ReactiveFlags.IS_REACTIVE]
}

export const isReadonly = (target) => {
  return !!target[ReactiveFlags.IS_READONLY]
}
