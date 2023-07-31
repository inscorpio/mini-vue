import { track, trigger } from './effect'

export function reactive<T extends object>(target: T) {
  return new Proxy(target, {
    get(target, key) {
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
      return Reflect.get(target, key)
    },
    set(target, key) {
      console.warn(`Set operation on key "${String(key)}" failed: ${target} is readonly.`)
      return true
    },
  })
}
