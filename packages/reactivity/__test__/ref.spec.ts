import { describe, expect, it, vi } from 'vitest'
import { effect } from '../src/effect'
import { isRef, proxyRefs, ref, unref } from '../src/ref'

describe('ref', () => {
  // 将传入的值通过 .value 的形式访问
  it('should hold a value', () => {
    const a = ref(1)
    expect(a.value).toBe(1)
    a.value = 2
    expect(a.value).toBe(2)
  })

  it('should be reactive', () => {
    const a = ref(1)
    let dummy
    const fn = vi.fn(() => {
      dummy = a.value
    })
    effect(fn)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(1)
    a.value = 2
    expect(fn).toHaveBeenCalledTimes(2)
    expect(dummy).toBe(2)
    // same value should not trigger
    a.value = 2
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should make nested properties reactive', () => {
    const a = ref({
      count: 1,
    })
    let dummy
    effect(() => {
      dummy = a.value.count
    })
    expect(dummy).toBe(1)
    a.value.count = 2
    expect(dummy).toBe(2)
  })

  it('should work without initial value', () => {
    const a = ref()
    let dummy
    effect(() => {
      dummy = a.value
    })
    expect(dummy).toBe(undefined)
    a.value = 2
    expect(dummy).toBe(2)
  })

  it('isRef', () => {
    expect(isRef(ref(1))).toBe(true)

    expect(isRef(0)).toBe(false)
    expect(isRef(1)).toBe(false)
    // an object that looks like a ref isn't necessarily a ref
    expect(isRef({ value: 0 })).toBe(false)
  })

  it('unref', () => {
    expect(unref(1)).toBe(1)
    expect(unref(ref(1))).toBe(1)
  })

  it('proxyRefs', () => {
    const original: any = {
      foo: ref(0),
      bar: 0,
    }
    const observed = proxyRefs(original)

    expect(original.foo.value).toBe(0)
    expect(observed.foo).toBe(0)
    expect(observed.bar).toBe(0)

    // update
    observed.foo = 1
    expect(original.foo.value).toBe(1)
    expect(observed.foo).toBe(1)

    observed.bar = 1
    expect(observed.bar).toBe(1)

    observed.foo = ref(2)
    expect(original.foo.value).toBe(2)
    expect(observed.foo).toBe(2)

    observed.bar = ref(2)
    expect(original.bar.value).toBe(2)
    expect(observed.bar).toBe(2)
  })
})
