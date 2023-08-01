import { describe, expect, it, vi } from 'vitest'
import { reactive } from '../src/reactive'
import { effect, stop } from '../src/effect'

describe('effect', () => {
  it('happy path', () => {
    let dummy
    const counter = reactive({ num: 0 })

    effect(() => dummy = counter.num)

    expect(dummy).toBe(0)

    counter.num = 9
    expect(dummy).toBe(9)
  })

  // Question:
  // 1. 为什么需要返回这个 runner 呢？
  // 2. 在源码中哪里有使用到？
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

  // Question:
  // 1. 在源码中 哪里使用到了 stop 这个功能?

  // 1. 调用 stop , 再次更新时不会触发 fn 执行
  // 2. 再次调用 runner 时可以更新
  it('stop', () => {
    let dummy
    const observed = reactive({ foo: 0 })
    const runner = effect(
      () => {
        dummy = observed.foo
      },
    )

    expect(dummy).toBe(0)
    stop(runner)

    // observed.foo = 1
    // observed.foo++ -> observed.foo = observed.foo + 1
    // 如果是这种形式的话，触发 trigger 之前 会先触发 track，又进行了一次依赖收集，那么调用 stop 时就白清空了，所以需要一个状态控制什么时候应该收集
    observed.foo++
    expect(dummy).toBe(0)

    runner()
    expect(dummy).toBe(1)
  })

  // 1. 调用 stop 后触发 onStop
  it('onStop', () => {
    const onStop = vi.fn()
    const runner = effect(
      () => {},
      { onStop },
    )

    stop(runner)
    expect(onStop).toHaveBeenCalled()
  })
})
