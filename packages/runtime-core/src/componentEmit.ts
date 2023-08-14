import { camelize, capitalize } from '@mini-vue/shared'

export function emit(instance, event: string, ...args) {
  const { props } = instance

  const handlerName = `on${capitalize(event)}`

  const hander = props[camelize(handlerName)]

  hander?.(...args)
}
