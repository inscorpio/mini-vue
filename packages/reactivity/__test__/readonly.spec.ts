import { describe, expect, it, vi } from 'vitest'
import { readonly } from '../src/reactive'

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
})
