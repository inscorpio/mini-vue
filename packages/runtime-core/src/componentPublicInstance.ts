import { hasOwn } from '@mini-vue/shared'

export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { setupState, props } = instance
    if (setupState && hasOwn(setupState, key)) {
      return Reflect.get(setupState, key)
    }
    else if (props && hasOwn(props, key)) {
      return Reflect.get(props, key)
    }
    else {
      const map = {
        $el: i => i.vnode.el,
        $slots: i => i.slots,
        $props: i => i.props,
      }
      return map[key]?.(instance)
    }
  },
}
