import { isObject } from '@mini-vue/shared'
import type { ReactiveEffect } from './effect'
import { isTracking, trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'

class RefImpl<T> {
  private _value: T

  // 重点理解 ref 只有一个 value key 的 dep, 不用像 reactive 那样根据不同的 key 存 deps
  // 依赖收集和触发依赖逻辑与 reactive 一致
  public dep = new Set<ReactiveEffect>()
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
