import { isReadonly, readonly } from '../src'

describe('readonly', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const wrapped = readonly(original)

    wrapped.foo = 2
    expect(wrapped.foo).toBe(1)
  })

  it('warn', () => {
    console.warn = vi.fn()
    const original = { foo: 1 }
    const wrapped = readonly(original)

    wrapped.foo = 2
    expect(console.warn).toHaveBeenCalled()
  })

  it('isReadonly', () => {
    const original = { foo: 1 }
    const wrapped = readonly(original)

    expect(isReadonly(original)).toBe(false)
    expect(isReadonly(wrapped)).toBe(true)
  })
})
