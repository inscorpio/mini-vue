import { h } from '../../lib/mini-vue.esm.js'

/* eslint-disable no-console */
export const Foo = {
  name: 'Foo',
  setup(props) {
    console.log(props)
    props.count++
    return {}
  },
  render() {
    return h('div', null, `count: ${this.count}`)
  },
}
