export function transform(root, options) {
  const context = createTransformContext(root, options)
  traverseNode(root, context)
}

function traverseNode(node, context) {
  const { nodeTransforms } = context
  nodeTransforms.forEach(nodeTransform => nodeTransform(node))
  traverseChildren(node, context)
}

function traverseChildren(parent, context) {
  const { children = [] } = parent
  children.forEach(node => traverseNode(node, context))
}

function createTransformContext(root, { nodeTransforms }) {
  return {
    root,
    nodeTransforms,
  }
}
