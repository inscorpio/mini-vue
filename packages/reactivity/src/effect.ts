let activeEffect

class ReactiveEffect {
  private _fn: any

  deps: Set<any>[] = []

  constructor(fn, public scheduler?) {
    this._fn = fn
    this.scheduler = scheduler
  }

  run() {
    activeEffect = this
    return this._fn()
  }

  stop() {
    this.deps.forEach((deps) => {
      deps.delete(this)
    })
  }
}

export declare interface EffectOptions {
  scheduler: Function
}

export const effect = (fn, options?: EffectOptions) => {
  const { scheduler } = options ?? {}

  const _effect = new ReactiveEffect(fn, scheduler)

  _effect.run()

  const runner: any = _effect.run.bind(_effect)

  runner.effect = _effect

  return runner
}

// targetMap: [[target: depsMap]]
// depsMap: [[key: deps]]
// deps: [effectFn]
// target -> key -> deps

const targetMap = new Map()

export const track = (target, key) => {
  const depsMap = targetMap.get(target) ?? new Map()
  targetMap.set(target, depsMap)

  const deps = depsMap.get(key) ?? new Set()
  depsMap.set(key, deps)

  deps.add(activeEffect)

  if (!activeEffect)
    return

  activeEffect.deps.push(deps)
}

export const trigger = (target, key) => {
  const depsMap = targetMap.get(target)
  const deps = depsMap.get(key)
  for (const reactiveEffect of deps) {
    const { scheduler } = reactiveEffect
    scheduler
      ? reactiveEffect.scheduler()
      : reactiveEffect.run()
  }
}

export const stop = (runner) => {
  runner.effect.stop()
}
