import { track, trigger } from './effect'

enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

export function reactive<T extends object>(target: T) {
  return new Proxy(target, {
    get(target, key) {
      Reflect.set(target, ReactiveFlags.IS_REACTIVE, true)
      track(target, key)
      return Reflect.get(target, key)
    },
    set(target, key, value) {
      Reflect.set(target, key, value)
      trigger(target, key)
      return true
    },
  })
}

export function readonly<T extends object>(target: T) {
  return new Proxy(target, {
    get(target, key) {
      Reflect.set(target, ReactiveFlags.IS_READONLY, true)
      return Reflect.get(target, key)
    },
    set(target, key) {
      console.warn(`Set operation on key "${String(key)}" failed: ${target} is readonly.`)
      return true
    },
  })
}

export function isReactive(value: unknown) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value: unknown) {
  return !!value[ReactiveFlags.IS_READONLY]
}
