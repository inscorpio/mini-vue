import { h, provide } from '../../lib/mini-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  setup() {
    const a = 1
    const b = 2
    provide('a', a)
    provide('b', b)
    return {
      a,
      b,
    }
  },
  render() {
    return [
      h('p', null, 'App'),
      h('p', null, `App.a: ${this.a} - App.b: ${this.b}`),
      h(Foo),
    ]
  },
}
