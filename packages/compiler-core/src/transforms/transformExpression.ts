import { NodeTypes } from '../ast'

export function transformExpression(node) {
  if (node.type === NodeTypes.INTERPOLATION) {
    node.content = processExpression(node.content)
  }
}

export function processExpression(node) {
  node.content = `_ctx.${node.content}`
  return node
}
