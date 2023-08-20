import { isFunction } from '@mini-vue/shared'
import { getCurrentInstance } from './component'

export function provide(key, value) {
  const instance = getCurrentInstance()
  const { provides } = instance
  // 课程内这里判断 instance.provides 与 parent.provides 一致再以 parent.provides 为原型创建新的 provides, 感觉可以直接在 createComponentInstance 的时候就可以处理
  Reflect.set(provides, key, value)
}

export function inject(key, defaultValue) {
  const instance = getCurrentInstance()
  const { provides } = instance
  const result = Reflect.get(provides, key)
  return result ?? (isFunction(defaultValue) ? defaultValue() : defaultValue)
}
