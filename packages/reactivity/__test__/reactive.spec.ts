import { isReactive, reactive } from '@mini-vue/reactivity'

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const wrapped = reactive(original)

    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
  })

  it('isReactive', () => {
    const original = { foo: 1 }
    const wrapped = reactive(original)

    expect(isReactive(original)).toBe(false)
    expect(isReactive(wrapped)).toBe(true)
  })
})
