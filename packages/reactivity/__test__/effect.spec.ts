import { effect, reactive } from '@mini-vue/reactivity'

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 10,
    })

    let nextAge

    effect(() => {
      nextAge = user.age + 1
    })
    expect(nextAge).toBe(11)

    // update
    user.age++
    expect(nextAge).toBe(12)
  })

  it('should return runner when call effect', () => {
    let foo = 10

    const runner = effect(() => {
      foo++
      return 'foo'
    })

    expect(foo).toBe(11)

    const res = runner()
    expect(foo).toBe(12)
    expect(res).toBe('foo')
  })

  it('scheduler', () => {
    let dummy, run

    const scheduler = vi.fn(() => {
      run = runner
    })

    const obj = reactive({ foo: 1 })

    const runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler },
    )

    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)

    obj.foo++
    expect(scheduler).toHaveBeenCalledOnce()
    expect(dummy).toBe(1)

    run()
    expect(dummy).toBe(2)
  })
})
