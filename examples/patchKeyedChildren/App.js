import { h, ref } from '../../lib/mini-vue.esm.js'

export default {
  name: 'App',
  setup() {
    const isChange = ref(true)
    const isOrder = ref(true)

    window.onChange = () => {
      isChange.value = !isChange.value
    }

    window.onChangeOrder = () => {
      isOrder.value = !isOrder.value
    }

    return {
      isChange,
      isOrder,
    }
  },
  render() {
    return h(
      'div',
      null,
      this.isChange
        ? [
            h('p', { key: 'A' }, 'A'),
            h('p', { key: 'B' }, 'B'),
          ]
        : this.isOrder
          ? [
              h('p', { key: 'A' }, 'A'),
              h('p', { key: 'B' }, 'B'),
              h('p', { key: 'C' }, 'C'),
              h('p', { key: 'D' }, 'D'),
            ]
          : [
              h('p', { key: 'C' }, 'C'),
              h('p', { key: 'D' }, 'D'),
              h('p', { key: 'A' }, 'A'),
              h('p', { key: 'B' }, 'B'),
            ],
    )
  },
}
