import { h, ref } from '../../lib/mini-vue.esm.js'

export const App = {
  name: 'App',
  setup() {
    return {
      count: ref(0),
    }
  },
  render() {
    return h('div', null, [
      h('p', null, `count: ${this.count}`),
      h('button', {
        onClick: () => {
          this.count++
        },
      }, 'increase'),
    ])
  },
}
