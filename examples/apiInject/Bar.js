import { h, inject } from '../../lib/mini-vue.esm.js'

export const Bar = {
  name: 'Bar',
  setup() {
    const a = inject('a')
    const b = inject('b')
    const c = inject('c')
    const d = inject('d', () => 4)
    return {
      a,
      b,
      c,
      d,
    }
  },
  render() {
    return [
      h('p', null, 'Bar'),
      h('p', null, `Foo.a: ${this.a} - App.b: ${this.b} - Foo.c: ${this.c} - Bar.defaultFunctionalValue.d: ${this.d}`),
    ]
  },
}
