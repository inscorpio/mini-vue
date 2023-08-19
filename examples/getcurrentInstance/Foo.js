/* eslint-disable no-console */
import { getCurrentInstance } from '../../lib/mini-vue.esm.js'

export const Foo = {
  name: 'Foo',
  setup() {
    console.log(getCurrentInstance())
  },
  render() {
    return 'Foo'
  },
}
