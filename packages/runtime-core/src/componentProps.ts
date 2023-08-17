import { shallowReadonly } from '@mini-vue/reactivity'

export function initProps(instance) {
  instance.props = shallowReadonly(instance.vnode.props ?? {})
}
