let activeEffect

class ReactiveEffect {
  private _fn: any

  constructor(fn, public scheduler?) {
    this._fn = fn
    this.scheduler = scheduler
  }

  run() {
    activeEffect = this
    return this._fn()
  }
}

export declare interface EffectOptions {
  scheduler: Function
}

export const effect = (fn, options?: EffectOptions) => {
  const { scheduler } = options ?? {}

  const reactiveEffect = new ReactiveEffect(fn, scheduler)

  reactiveEffect.run()

  return reactiveEffect.run.bind(reactiveEffect)
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
