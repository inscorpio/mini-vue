import { extend } from '@mini-vue/shared'

export function createApp(App) {
  return {
    mount(el) {
      const root = document.querySelector(el)
      const setupResult = App.setup()
      extend(App, setupResult)
      const child = App.render()
      root.appendChild(child)
    },
  }
}
