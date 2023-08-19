/* eslint-disable no-console */
import { getCurrentInstance, h } from '../../lib/mini-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  setup() {
    console.log(getCurrentInstance())
  },
  render() {
    return h(Foo)
  },
}
