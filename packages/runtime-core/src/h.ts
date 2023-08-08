export function h(tag, props, children) {
  const el: Element = document.createElement(tag)

  el.innerHTML = children

  return el
}
