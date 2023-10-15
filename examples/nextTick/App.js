/* eslint-disable no-console */
import { getCurrentInstance, h, nextTick, ref } from '../../lib/mini-vue.esm.js'
import Foo from './Foo.js'

export default {
  name: 'App',
  setup() {
    const instance = getCurrentInstance()
    const count = ref(0)

    // 测试同时更新 App 和 Foo 组件
    const onIncrease = async () => {
      for (let i = 0; i < 10; i++) {
        count.value++
      }
      // Foo's increase method
      window.onIncrease()

      // 由于这时视图还未更新，所以获取到的还是原始值 count-0
      console.log(instance.vnode.el.className)

      // nextTick callback
      nextTick(() => {
        console.log(instance.vnode.el.className)
      })

      // nextTick Promise
      await nextTick()
      console.log(instance.vnode.el.className)
    }
    return {
      count,
      onIncrease,
    }
  },
  render() {
    console.log('update App')
    return h(
      'div',
      {
        class: `count-${this.count}`,
      },
      [
        h(
          'p',
          null,
          `app's count: ${this.count}`,
        ),
        h(Foo),
        h(
          'button',
          {
            onClick: this.onIncrease,
          },
          'onIncrease',
        ),
      ],
    )
  },
}
