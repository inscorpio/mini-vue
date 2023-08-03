import { extend, isObject } from '@mini-vue/shared'
import { track, trigger } from './effect'
import { ReactiveFlags, reactive, readonly } from './reactive'

function createGetter(isReadonly = false, shallow = false) {
  return function getter(target, key) {
    Reflect.set(
      target,
      isReadonly
        ? ReactiveFlags.IS_READONLY
        : ReactiveFlags.IS_REACTIVE,
      true,
    )
    const value = Reflect.get(target, key)
    if (shallow)
      return value
    track(target, key)
    return isObject(value)
      ? isReadonly
        ? readonly(<object>value)
        : reactive(<object>value)
      : value
  }
}

function createSetter() {
  return function setter(target, key, value) {
    Reflect.set(target, key, value)
    trigger(target, key)
    return true
  }
}

const get = createGetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)
const set = createSetter()

export const reactiveHandlers: ProxyHandler<object> = {
  get,
  set,
}

export const readonlyHandlers: ProxyHandler<object> = {
  get: readonlyGet,
  set(target, key) {
    console.warn(`Set operation on key "${String(key)}" failed: ${target} is readonly.`)
    return true
  },
}

export const shallowReactiveHandlers: ProxyHandler<object> = extend(
  {},
  reactiveHandlers,
  {
    get: shallowReadonlyGet,
  },
)
