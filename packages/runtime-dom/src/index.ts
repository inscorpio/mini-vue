import { createRenderer } from '@mini-vue/runtime-core'

export function createElement(type) {
  return document.createElement(type)
}

export function patchProp(el, key, oldValue, newValue) {
  const isOn = (key: string) => /^on[A-Z]/.test(key)

  if (isOn(key))
    el.addEventListener(key.slice(2).toLowerCase(), newValue)
  else if (newValue === undefined || newValue === null)
    el.removeAttribute(key)
  else if (oldValue !== newValue)
    el.setAttribute(key, newValue)
}

export function insert(el, container) {
  container.append(el)
}

const renderer = createRenderer({ createElement, patchProp, insert })

export const createApp = renderer.createApp

export * from '@mini-vue/runtime-core'
