import { extend } from '@mini-vue/shared'

let activeEffect

const cleanupEffect = (effect) => {
  effect.deps.forEach((deps) => {
    deps.delete(effect)
  })
}

export declare interface EffectOptions {
  scheduler?: Function
  onStop?: () => void
}

class ReactiveEffect {
  private _fn: any

  active = true
  deps: Set<any>[] = []
  onStop: EffectOptions['onStop']

  constructor(fn) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    return this._fn()
  }

  stop() {
    if (!this.active)
      return
    cleanupEffect(this)
    this.active = false
    this.onStop?.()
  }
}

export const effect = (fn, options?: EffectOptions) => {
  const _effect = new ReactiveEffect(fn)
  extend(_effect, options)

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
