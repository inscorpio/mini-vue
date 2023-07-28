type EffectFn = () => void

let activeFn: EffectFn

export function effect(fn: EffectFn) {
  activeFn = fn
  const res = fn()
  return res
}

const targetMap = new Map<object, Map<unknown, Set<EffectFn>>>()

// 收集函数(fn)
// 一个 key 有多个 fn 且不会重复，所以使用 Set 的数据结构
export function track(target: object, key: unknown) {
  let keyMap = targetMap.get(target)

  if (!keyMap) {
    keyMap = new Map()
    targetMap.set(target, keyMap)
  }

  let fnSet = keyMap.get(key)

  if (!fnSet) {
    fnSet = new Set()
    keyMap.set(key, fnSet)
  }

  fnSet.add(activeFn)
}

// 触发函数(fn)
export function trigger(target: object, key: unknown) {
  // targetMap -> keyMap -> fnSet

  const keyMap = targetMap.get(target)
  const fnSet = keyMap.get(key)

  fnSet.forEach(fn => fn())
}
