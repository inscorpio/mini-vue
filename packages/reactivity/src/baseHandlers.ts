import { track, trigger } from './effect'
import { ReactiveFlags } from './reactive'

export const createGetter = (isReadonly = false) => {
  return (target, key) => {
    if (key === ReactiveFlags.IS_REACTIVE)
      return !isReadonly

    if (key === ReactiveFlags.IS_READONLY)
      return isReadonly

    const res = Reflect.get(target, key)

    // track dep
    !isReadonly && track(target, key)

    return res
  }
}

export const createSetter = () => {
  return (target, key, value) => {
    const res = Reflect.set(target, key, value)

    // trigger dep
    trigger(target, key)

    return res
  }
}

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

export const mutableHandles = {
  get,
  set,
}

export const readonlyHandlers = {
  get: readonlyGet,
  set() {
    console.warn('readonly cannot update')
    return true
  },
}
