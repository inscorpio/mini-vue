import { createRenderer } from '../../lib/mini-vue.esm.js'
import { App } from './App.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const renderer = createRenderer({
  createElement(type) {
    if (type === 'rect') {
      const rectangle = {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        color: 'blue',
      }

      return rectangle
    }
  },
  patchProp(el, key, value) {
    Reflect.set(el, key, value)
  },
  insert(rect) {
    ctx.fillStyle = rect.color
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
  },
})

renderer.createApp(App).mount(canvas)
