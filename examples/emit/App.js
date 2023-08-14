/* eslint-disable no-console */
import { h } from '../../lib/mini-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  render() {
    return h(
      'div',
      null,
      [
        h(
          Foo,
          {
            onAdd(a, b) {
              console.log('onAdd', a, b)
            },
            onAddFoo() {
              console.log('onAddFoo')
            },
          },
        ),
      ],
    )
  },
}
