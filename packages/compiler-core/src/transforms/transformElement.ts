import { NodeTypes } from '../ast'
import { CREATE_ELEMENT_VNODE } from '../runtimeHelper'

export function transformElement(node, context) {
  const { helpers } = context
  if (node.type === NodeTypes.ELEMENT) {
    helpers.add(CREATE_ELEMENT_VNODE)
  }
}
