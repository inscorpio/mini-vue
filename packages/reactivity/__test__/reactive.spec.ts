import { describe, expect, it } from 'vitest'
import { reactive } from '../src/reactive'

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 0 }
    const observed = reactive(original)

    expect(original).not.toBe(observed)
    expect(observed.foo).toBe(0)
  })
})
