import { NodeTypes } from '../ast'
import { isText } from '../utils'

export function transformText(node) {
  if (node.type === NodeTypes.ELEMENT) {
    const { children } = node
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      let compoundNode
      if (isText(child)) {
        for (let j = i + 1; j < children.length; j++) {
          const next = children[j]
          if (isText(next)) {
            compoundNode = {
              type: NodeTypes.COMPOUND_EXPRESSION,
              children: [
                child,
                ' + ',
                next,
              ],
            }
            children.splice(j, 1)
            j--
          }
          else {
            break
          }
        }
        if (compoundNode) {
          children[i] = compoundNode
        }
      }
    }
  }
}
