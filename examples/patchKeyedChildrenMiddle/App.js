import { h, ref } from '../../lib/mini-vue.esm.js'

export default {
  name: 'App',
  setup() {
    const isChange = ref(true)

    window.onChange = () => {
      isChange.value = !isChange.value
    }

    return {
      isChange,
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
            // ----------------------
            h('p', { key: 'D' }, 'D'),
            h('p', { key: 'U' }, 'U'),
            h('p', { key: 'E' }, 'E'),
            h('p', { key: 'M' }, 'M'),
            // ----------------------
            h('p', { key: 'G' }, 'G'),
            h('p', { key: 'H' }, 'H'),
          ]
        : [
            h('p', { key: 'A' }, 'A'),
            h('p', { key: 'B' }, 'B'),
            // ---------------------- 删除 D 更新 U 移动 M 新增 N
            h('p', { key: 'M' }, 'M'),
            h('p', { key: 'U' }, 'U2'),
            h('p', { key: 'E' }, 'E'),
            h('p', { key: 'N' }, 'N'),
            // ----------------------
            h('p', { key: 'G' }, 'G'),
            h('p', { key: 'H' }, 'H'),
          ],
    )
  },
}
