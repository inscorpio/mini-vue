import { h, ref } from '../../lib/mini-vue.esm.js'

export const App = {
  name: 'App',
  setup() {
    const count = ref(0)
    const props = ref({
      foo: 'foo',
      bar: 'bar',
    })
    const onIncrease = () => {
      count.value++
    }
    const onChangeProp = () => {
      props.value.foo = 'new-foo'
    }
    const onDeleteProp = () => {
      props.value.foo = null
    }
    const onDeleteProps = () => {
      props.value = {}
    }
    return {
      count,
      props,
      onIncrease,
      onChangeProp,
      onDeleteProp,
      onDeleteProps,
    }
  },
  render() {
    return h(
      'div',
      {
        id: 'root',
        ...this.props,
      },
      [
        h('p', null, `count: ${this.count}`),
        h(
          'button',
          {
            onClick: this.onIncrease,
          },
          'increase',
        ),
        // update props
        h(
          'button',
          {
            onClick: this.onChangeProp,
          },
          'change props',
        ),
        h(
          'button',
          {
            onClick: this.onDeleteProp,
          },
          'delete prop',
        ),
        h(
          'button',
          {
            onClick: this.onDeleteProps,
          },
          'delete props',
        ),
      ],
    )
  },
}
