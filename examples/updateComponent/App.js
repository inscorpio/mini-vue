import { h, ref } from '../../lib/mini-vue.esm.js'
import Foo from './Foo.js'

export default {
  name: 'App',
  setup() {
    const appCount = ref(0)
    const fooCount = ref(0)
    const onIncreaseApp = () => {
      // 这里需要注意：更新 App 组件时，会导致 Foo 组件也更新，但是 由于 Foo 组件的 props 并未改变，所以 Foo 组件不需要更新
      appCount.value++
    }
    const onIncreaseFoo = () => {
      fooCount.value++
    }
    return {
      appCount,
      fooCount,
      onIncreaseApp,
      onIncreaseFoo,
    }
  },
  render() {
    return h(
      'div',
      null,
      [
        h(
          'p',
          null,
          `app' s count: ${this.appCount}`,
        ),
        h(
          Foo,
          { count: this.fooCount },
        ),
        h(
          'button',
          {
            onClick: this.onIncreaseApp,
          },
          'onIncreaseApp',
        ),
        h(
          'button',
          {
            onClick: this.onIncreaseFoo,
          },
          'onIncreaseFoo',
        ),
      ],
    )
  },
}
