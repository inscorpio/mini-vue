import { h } from '../../lib/mini-vue.esm.js'

export const App = {
  name: 'App',
  render() {
    return h('rect', { color: '#ace', x: 10, y: 10, width: 200, height: 300 })
  },
}
