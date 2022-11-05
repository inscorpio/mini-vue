let activeEffect

class ReactiveEffect {
  private _fn: any

  constructor(fn) {
    this._fn = fn
  }

  run() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    activeEffect = this
    this._fn()
  }
}

export const effect = (fn) => {
  const reactiveEffect = new ReactiveEffect(fn)
  reactiveEffect.run()
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
  for (const reactiveEffect of deps)
    reactiveEffect.run()
}
