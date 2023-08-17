import { h } from '../../lib/mini-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  render() {
    return h(
      'div',
      null,
      // 源码支持这么多格式吗？
      [
        // 默认插槽 - vnode
        h(Foo, null, h('p', null, 'default vnode slot')),
        // 默认插槽 - functional
        h(Foo, null, () => h('p', null, 'default functional slot')),
        // 默认插槽 - { deault: vnode }
        h(Foo, null, { default: h('p', null, 'default object vnode slot') }),
        // 默认插槽 - { deault: () => vnode }
        h(Foo, null, { default: () => h('p', null, 'default object functional slot') }),
        // 默认作用域插槽
        h(Foo, null, { default: ({ value }) => h('p', null, value) }),
        // 具名插槽
        h(Foo, null, { header: h('p', null, 'header slot') }),
        // 具名作用域插槽
        h(Foo, null, { header: () => h('p', null, 'header slot') }),
        // 具名作用域插槽
        h(Foo, null, { header: ({ value }) => h('p', null, value) }),
        // 混合
        h(
          Foo,
          null,
          {
            header: () => h('p', null, 'header slot'),
            default: h('p', null, 'deault slot'),
            footer: () => h('p', null, 'footer slot'),
          },
        ),
      ],
    )
  },
}
