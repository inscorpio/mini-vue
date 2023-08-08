import { h } from '../../lib/mini-vue.esm.js'

export const App = {
  render() {
    return h('div', null, this.msg)
  },
  setup() {
    return {
      msg: 'hello, mini-vue',
    }
  },
}
