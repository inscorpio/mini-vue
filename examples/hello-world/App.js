import { h } from '../../lib/mini-vue.esm.js'

export const App = {
  render() {
    window.self = this
    return h(
      'div',
      {
        class: 'parent',
      },
      [
        h('p', { class: 'red' }, this.msg),
        h('p', { class: 'blue' }, this.msg),
        // FIX: 根据课程的判断条件，如果是 boolean 或 number 就没法渲染了
        h('p', { class: 'red' }, true),
        h('p', { class: 'blue' }, 1),
      ],
    )
  },
  setup() {
    return {
      msg: 'hello, mini-vue',
    }
  },
}
