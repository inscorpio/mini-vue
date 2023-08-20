import { h, inject, provide } from '../../lib/mini-vue.esm.js'
import { Bar } from './Bar.js'

export const Foo = {
  name: 'Foo',
  setup() {
    const a = inject('a')
    const b = inject('b')
    const c = inject('c', 3)
    provide('a', 11)
    provide('c', c)
    return {
      a,
      b,
      c,
    }
  },
  render() {
    return [
      h('p', null, 'Foo'),
      h('p', null, `App.a: ${this.a} - App.b: ${this.b} - Foo.defaultVariable.c: ${this.c}`),
      h(Bar),
    ]
  },
}
