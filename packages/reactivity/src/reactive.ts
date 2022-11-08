import { mutableHandles, readonlyHandlers } from './baseHandlers'

const createReactiveObject = (target, handlers) => {
  return new Proxy(target, handlers)
}

export const reactive = <T extends object>(target: T) => {
  return createReactiveObject(target, mutableHandles)
}

export const readonly = <T extends object>(target: T) => {
  return createReactiveObject(target, readonlyHandlers)
}
