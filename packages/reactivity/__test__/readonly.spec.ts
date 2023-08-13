import { describe, expect, it, vi } from 'vitest'
import { isProxy, isReadonly, readonly, shallowReadonly } from '../src/reactive'

describe('readonly', () => {
  // 1. 只读对象，不能修改属性
  // 2. 修改属性时警告
  it('happy path', () => {
    const original = { foo: 0 }
    const observed = readonly(original)
    console.warn = vi.fn()

    observed.foo = 1
    expect(observed.foo).toBe(0)
    expect(console.warn).toHaveBeenCalledWith(`Set operation on key "foo" failed: ${observed} is readonly.`)
  })

  it('isReadonly', () => {
    const original = { foo: 0 }
    const observed = readonly(original)

    expect(isReadonly(original)).toBe(false)
    expect(isReadonly(observed)).toBe(true)
  })

  it('nested readonly', () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2 }],
    }
    const observed = readonly(original)
    expect(isReadonly(observed.nested)).toBe(true)
    expect(isReadonly(observed.array)).toBe(true)
    expect(isReadonly(observed.array[0])).toBe(true)
  })

  // 只有第一层是只读的
  it('shallow readonly', () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2 }],
    }
    const observed = shallowReadonly(original)

    observed.foo = 2
    expect(console.warn).toHaveBeenCalledWith(`Set operation on key "foo" failed: ${observed} is readonly.`)

    expect(isReadonly(observed)).toBe(true)
    expect(isReadonly(observed.nested)).toBe(false)
    expect(isReadonly(observed.array)).toBe(false)
    expect(isReadonly(observed.array[0])).toBe(false)
  })

  it('isProxy', () => {
    const original = { foo: 0 }
    const observed = readonly(original)

    expect(isProxy(original)).toBe(false)
    expect(isProxy(observed)).toBe(true)
  })
})
