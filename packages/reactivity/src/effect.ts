import { extend } from '@mini-vue/shared'

// 现在终于搞懂了 Dep 就是 new ReactiveEffect() 的集合，所以下面全部得改一下命名
export type Dep = Set<ReactiveEffect>
interface ReactiveEffectOptions {
  scheduler?: () => void
  onStop?: () => void
}

let activeEffect: ReactiveEffect
let shouldTrack = true

// 其实不是很懂封装这个类的技巧
export class ReactiveEffect {
  public fn
  public scheduler
  public deps = []
  public onStop
  // 缺少 active 属性，但是单测没报错

  constructor(fn, scheduler?) {
    this.fn = fn
    this.scheduler = scheduler
  }

  run() {
    shouldTrack = true
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    activeEffect = this
    const runner = this.fn()
    shouldTrack = false
    return runner
  }

  stop() {
    shouldTrack = false
    cleanupEffect(this)
    this.onStop?.()
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect)
  })
}

export function effect(fn, options?: ReactiveEffectOptions) {
  // Question:
  // 1. 为什么这里已经有一个 effect 函数了，还要给这个对象取名为 _effect
  // 2. 课程内传传入了 scheduler 参数，但是下面 extend 还是会把 scheduler 挂在 effect 上，可以不用传吗？(没有传单测也没报错)
  const _effect = new ReactiveEffect(fn)
  extend(_effect, options)

  _effect.run()
  fn.effect = _effect

  return _effect.fn
}

const targetMap = new Map<object, Map<unknown, Dep>>()

export function isTracking() {
  // 如果只是单纯的访问 reactive 中的属性时，没有调用 effect 就不会有 activeEffect
  return activeEffect && shouldTrack
}

// 收集函数(fn)
// 一个 key 有多个 fn 且不会重复，所以使用 Set 的数据结构
export function track(target: object, key: unknown) {
  if (!isTracking())
    return

  let depsMap = targetMap.get(target)

  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)

  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  trackEffects(dep)
}

// ref 和 reactive 共有的逻辑
//  为什么不叫 trackDep 呢
export function trackEffects(dep: Dep) {
  // perf: 如果有该 effect 就不添加了
  if (dep.has(activeEffect))
    return
  // 最开始只是为了收集 fn, 如果这里添加的是 activeEffect, 那么叫 fnSet 就不合适了
  dep.add(activeEffect)

  activeEffect.deps.push(dep)
}

// 触发函数(fn)
export function trigger(target: object, key: unknown) {
  // targetMap -> depsMap -> effect.fn

  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)

  triggerEffects(dep)
}

// ref 和 reactive 共有的逻辑
//  为什么不叫 triggerDep 呢
export function triggerEffects(dep: Dep) {
  dep.forEach((effect) => {
    // 一开始只是为了执行 effectFn, 但是现在还需要执行 scheduler, 那收集依赖的时候除了收集 effectFn 之外，就还需要收集对应的 scheduler, 所以 在 track 中应该做出改变
    effect.scheduler
      ? effect.scheduler()
      : effect.fn()
  })
}

export function stop(runner) {
  // 之前的 stop 是挂在 runner 上的，现在 runner 上挂载了 effect, 将 stop 方法移到了 effect 内部
  runner.effect.stop()
}
