import { describe, expect, it, vi } from 'vitest'
import { reactive } from '../src/reactive'
import { computed } from '../src/computed'

describe('computed', () => {
  it('happy path', () => {
    const observed = reactive({ foo: 0 })

    const getter = vi.fn(() => observed.foo)

    const cValue = computed(getter)

    expect(getter).not.toHaveBeenCalled()
    // 触发 getter
    expect(cValue.value).toBe(0)
    expect(getter).toHaveBeenCalledTimes(1)

    // Question1：
    // 触发 reactive trigger 逻辑，depsMap 是空的，targetMap 也是空的，说明没有触发 track 逻辑
    // track 函数调用了，由于没有 activeEffect 被 return 掉了
    // activeEffect 是在 effect 函数内被赋值的
    // 而 compute 内没有调用 effect
    // 那么怎么解决这个问题呢？
    // 尝试在 computed 内部调用 effect，将 getter 作为 fn，但是 getter 一开始就会执行，不满足
    // 这时候可以考虑将 activeEffect 赋值的操作抽离出来在 computed 内部调用(可行)
    observed.foo = 1
    expect(getter).toHaveBeenCalledTimes(1)
    // Question2：
    // observed.foo 更新触发 trigger 导致 getter 再次调用，但是并未访问 .value，所以不该调用 getter
    // 怎么控制呢？(我觉得这时候引入 scheduler 的概念解决这个问题才是恰当的)
    // 自己的想法：通过给 effect 一个变量来控制是否执行 fn
    // 源码的实现：通过传入 scheduler, 更新时执行 scheduler 不执行 getter
    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(2)
  })

  // 源码
  it('should return updated value', () => {
    const value = reactive<{ foo?: number }>({})
    const cValue = computed(() => value.foo)
    expect(cValue.value).toBe(undefined)
    value.foo = 1
    expect(cValue.value).toBe(1)
  })

  // 源码
  it('should compute lazily', () => {
    const value = reactive<{ foo?: number }>({})
    const getter = vi.fn(() => value.foo)
    const cValue = computed(getter)

    // lazy
    expect(getter).not.toHaveBeenCalled()

    expect(cValue.value).toBe(undefined)
    expect(getter).toHaveBeenCalledTimes(1)

    // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    // should not compute until needed
    value.foo = 1
    expect(getter).toHaveBeenCalledTimes(1)

    // now it should compute
    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(2)

    // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(2)
  })
})
