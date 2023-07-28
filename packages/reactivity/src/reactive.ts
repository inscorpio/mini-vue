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
