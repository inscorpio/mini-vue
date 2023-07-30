import { describe, expect, it, vi } from 'vitest'
import { reactive } from '../src/reactive'
import { effect } from '../src/effect'

describe('effect', () => {
  it('happy path', () => {
    let dummy
    const counter = reactive({ num: 0 })

    effect(() => dummy = counter.num)

    expect(dummy).toBe(0)

    counter.num = 9
    expect(dummy).toBe(9)
  })

  // Question: 为什么需要返回这个 runner 呢？
  // 目前并没有体现出它的作用
  it('should return a runner when call effect', () => {
    const counter = reactive({ num: 0 })

    const runner = effect(() => counter.num)

    expect(runner()).toBe(0)

    counter.num = 1
    expect(runner()).toBe(1)
  })

  // Question:
  // 1. 在 Vue 源码中 哪里使用到了 scheduler?

  // 1. 如果传入 scheduler , 初始化调用 fn 不调用 scheduler
  // 2. 更新时不调用 effectFn 而是调用 scheduler
  it('scheduler', () => {
    let dummy
    const observed = reactive({ foo: 0 })
    const scheduler = vi.fn()
    effect(
      () => dummy = observed.foo,
      { scheduler },
    )

    expect(dummy).toBe(0)
    expect(scheduler).not.toHaveBeenCalled()

    observed.foo = 1
    expect(dummy).toBe(0)
    expect(scheduler).toBeCalledTimes(1)
  })
})
