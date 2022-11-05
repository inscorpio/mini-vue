import { track, trigger } from './effect'

export const reactive = (target) => {
  return new Proxy(target, {
    get(target, key) {
      const res = Reflect.get(target, key)

      // track dep
      track(target, key)

      return res
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value)

      // trigger dep
      trigger(target, key)

      return res
    },
  })
}
