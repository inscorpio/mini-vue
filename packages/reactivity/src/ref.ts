import { isObject } from '@mini-vue/shared'
import type { ReactiveEffect } from './effect'
import { isTracking, trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'

interface Ref<T = any> {
  value: T
}

type MaybeRef<T> = T | Ref<T>

class RefImpl<T> {
  private _value: T

  // 重点理解 ref 只有一个 value key 的 dep, 不用像 reactive 那样根据不同的 key 存 deps
  // 依赖收集和触发依赖逻辑与 reactive 一致
  public dep = new Set<ReactiveEffect>()
  public __v_isRef = true

  constructor(value) {
    this._value = isObject(value)
      ? reactive(value) // 如果初始值是对象，应该将对象转化为响应式的
      : value
  }

  get value() {
    isTracking() && trackEffects(this.dep)
    return this._value
  }

  set value(newValue) {
    if (newValue === this.value)
      return
    this._value = newValue
    triggerEffects(this.dep)
  }
}

export function ref<T>(value?: T) {
  return new RefImpl<T>(value)
}

// 不是很理解这里的类型处理和函数重载
export function isRef<T>(ref: Ref<T> | unknown): ref is Ref<T>
export function isRef(ref: any): ref is Ref {
  return !!ref?.__v_isRef
}

export function unref<T>(ref: MaybeRef<T>): T {
  return isRef(ref)
    ? ref.value
    : ref
}

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unref(Reflect.get(target, key))
    },

    set(target, key, value) {
      const oldValue = Reflect.get(target, key)
      const handleRef = isRef(oldValue) && !isRef(value)
      handleRef
        ? Reflect.set(oldValue, 'value', value)
        : Reflect.set(target, key, value)

      return true
    },
  })
}
