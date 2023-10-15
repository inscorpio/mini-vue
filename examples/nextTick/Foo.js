/* eslint-disable no-console */
import { h, ref } from '../../lib/mini-vue.esm.js'

export default {
  name: 'Foo',
  setup() {
    const count = ref(0)
    window.onIncrease = () => {
      for (let i = 0; i < 10; i++) {
        count.value++
      }
    }
    return {
      count,
    }
  },
  render() {
    console.log('update Foo')
    return [
      h(
        'p',
        null,
      `foo's count: ${this.count}`,
      ),
    ]
  },
}
