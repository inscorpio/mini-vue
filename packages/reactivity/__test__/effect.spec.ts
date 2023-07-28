import { describe, expect, it } from 'vitest'
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

  it('should return a runner when call effect', () => {
    const counter = reactive({ num: 0 })

    const runner = effect(() => counter.num)

    expect(runner()).toBe(0)

    counter.num = 1
    expect(runner()).toBe(1)
  })
})
