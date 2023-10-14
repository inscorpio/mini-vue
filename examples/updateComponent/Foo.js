import { h } from '../../lib/mini-vue.esm.js'

export default {
  name: 'Foo',
  render() {
    return h(
      'p',
      null,
      `foo' s count: ${this.$props.count}`,
    )
  },
}
