type EffectFn = () => void
type EffectScheduler = () => void
interface EffectOptions {
  scheduler?: EffectScheduler
}
// 这个类型也不知道取什么名字，根据源码看，这里其实需要封装一个 ReactiveEffect 的类
// Question:
// 1. 为什么取名为 ReactiveEffect
// 2. 为什么要封装成 class? 是源码中有多次使用吗？
interface ReactiveEffect {
  fn: EffectFn
  scheduler?: EffectScheduler
}

let activeEffect: ReactiveEffect

export function effect(fn: EffectFn, options?: EffectOptions) {
  const { scheduler } = options ?? {}
  // 暂时不知道给这个对象取什么名字, 但是根据源码来看，它还是一个 _effect

  // Question:
  // 1. 为什么这里已经有一个 effect 函数了，还要给这个对象取名为 _effect

  activeEffect = {
    fn,
    scheduler,
  }

  activeEffect.fn()

  return fn
}

const targetMap = new Map<object, Map<unknown, Set<ReactiveEffect>>>()

// 收集函数(fn)
// 一个 key 有多个 fn 且不会重复，所以使用 Set 的数据结构
export function track(target: object, key: unknown) {
  let keyMap = targetMap.get(target)

  if (!keyMap) {
    keyMap = new Map()
    targetMap.set(target, keyMap)
  }

  let effectSet = keyMap.get(key)

  if (!effectSet) {
    effectSet = new Set()
    keyMap.set(key, effectSet)
  }

  // 最开始只是为了收集 fn, 如果这里添加的是 activeEffect, 那么叫 fnSet 就不合适了
  effectSet.add(activeEffect)
}

// 触发函数(fn)
export function trigger(target: object, key: unknown) {
  // targetMap -> keyMap -> effectSet

  const keyMap = targetMap.get(target)
  const effectSet = keyMap.get(key)

  effectSet.forEach((effect) => {
    // 一开始只是为了执行 effectFn, 但是现在还需要执行 scheduler, 那收集依赖的时候除了收集 effectFn 之外，就还需要收集对应的 scheduler, 所以 在 track 中应该做出改变
    effect.scheduler
      ? effect.scheduler()
      : effect.fn()
  })
}
