import { h, ref } from '../../lib/mini-vue.esm.js'

export default {
  name: 'App',
  setup() {
    let i = 0
    const children = ref('A')
    window.changeChildrenToText = () => {
      children.value = `A${++i}`
    }
    window.changeChildrenToArray = () => {
      children.value = [
        h('div', null, `A${++i}`),
        h('div', null, 'B'),
      ]
    }

    return {
      children,
    }
  },
  render() {
    return h(
      'div',
      null,
      this.children,
    )
  },
}
