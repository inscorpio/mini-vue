import { h } from '../../lib/mini-vue.esm.js'

export const Foo = {
  name: 'Foo',
  render() {
    return h(
      'div',
      null,
      // 源码里面是怎么处理 undefine 或 null 的 children 的呢？
      [
        this.$slots.header?.({ value: 'header slot' }),
        this.$slots.default?.({ value: 'default named slot' }),
        this.$slots.footer?.({ value: 'footer slot' }),
      ].filter(Boolean),
    )
  },
}
