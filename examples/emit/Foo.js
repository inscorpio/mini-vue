import { h } from '../../lib/mini-vue.esm.js'

export const Foo = {
  name: 'Foo',
  setup(props, { emit }) {
    return {
      onAdd() {
        emit('add', 0, 1)
        emit('add-foo')
      },
    }
  },
  render() {
    return h(
      'button',
      {
        onClick: this.onAdd,
      },
      'click me',
    )
  },
}
