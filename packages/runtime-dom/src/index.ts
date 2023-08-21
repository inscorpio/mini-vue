import { createRenderer } from '@mini-vue/runtime-core'

export function createElement(type) {
  return document.createElement(type)
}

export function patchProp(props, el) {
  for (const key in props) {
    const value = props[key]
    const isOn = (key: string) => /^on[A-Z]/.test(key)

    if (isOn(key))
      el.addEventListener(key.slice(2).toLowerCase(), value)

    else
      el.setAttribute(key, value)
  }
}

export function insert(el, container) {
  container.append(el)
}

const renderer = createRenderer({ createElement, patchProp, insert })

export const createApp = renderer.createApp

export * from '@mini-vue/runtime-core'
