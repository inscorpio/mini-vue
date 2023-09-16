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

export function setElementText(el, text) {
  el.textContent = text
}

export function remove(el) {
  el.parentNode?.removeChild(el)
}

const renderer = createRenderer({ createElement, patchProp, insert, remove, setElementText })

export const createApp = renderer.createApp

export * from '@mini-vue/runtime-core'
