import { ref } from '../../lib/mini-vue.esm.js'

export default {
  name: 'App',
  setup() {
    const count = ref(0)
    window.onIncrease = () => {
      count.value++
    }
    return {
      count,
    }
  },
  template: '<p>count: {{count}}</p>',
}
