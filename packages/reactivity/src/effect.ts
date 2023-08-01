type EffectFn = () => void
type EffectScheduler = () => void
// 现在终于搞懂了 Dep 就是 new ReactiveEffect() 的集合，所以下面全部得改一下命名
type Dep = Set<ReactiveEffect>
interface EffectOptions {
  scheduler?: EffectScheduler
  onStop?: () => void
}
// 这个类型也不知道取什么名字，根据源码看，这里其实需要封装一个 ReactiveEffect 的类
// Question:
// 1. 为什么取名为 ReactiveEffect
// 2. 为什么要封装成 class? 是源码中有多次使用吗？
interface ReactiveEffect {
  fn: EffectFn & { stop?: () => void }
  scheduler?: EffectScheduler
  deps: Dep[]
  onStop?: () => void
}

let activeEffect: ReactiveEffect

export function effect(fn: EffectFn, options?: EffectOptions) {
  const { scheduler, onStop } = options ?? {}
  // 暂时不知道给这个对象取什么名字, 但是根据源码来看，它还是一个 _effect

  // Question:
  // 1. 为什么这里已经有一个 effect 函数了，还要给这个对象取名为 _effect

  activeEffect = {
    fn,
    scheduler,
    deps: [],
    onStop,
  }

  // 这里涉及到函数添加静态属性，其实可以考虑将 activeEffect 封装为一个 class 了
  activeEffect.fn.stop = () => {
    activeEffect.deps.forEach((dep) => {
      // fix:  activeEffect 一定在 dep 内 ， 所以不需要判断
      dep.delete(activeEffect)
    })
    activeEffect.onStop?.()
  }
  activeEffect.fn()

  return activeEffect.fn
}

const targetMap = new Map<object, Map<unknown, Dep>>()

// 收集函数(fn)
// 一个 key 有多个 fn 且不会重复，所以使用 Set 的数据结构
export function track(target: object, key: unknown) {
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

  // 如果只是单纯的访问 reactive 中的属性时，没有调用 effect 就不会有 activeEffect
  if (!activeEffect)
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

  dep.forEach((effect) => {
    // 一开始只是为了执行 effectFn, 但是现在还需要执行 scheduler, 那收集依赖的时候除了收集 effectFn 之外，就还需要收集对应的 scheduler, 所以 在 track 中应该做出改变
    effect.scheduler
      ? effect.scheduler()
      : effect.fn()
  })
}

export function stop(runner: ReactiveEffect['fn']) {
  runner.stop()
}
