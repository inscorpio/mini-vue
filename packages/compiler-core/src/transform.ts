import { NodeTypes } from './ast'
import { TO_DISPLAY_STRING } from './runtimeHelper'

export function transform(root, options = {}) {
  const context = createTransformContext(root, options)
  traverseNode(root, context)
  createRootCodegen(root)
  createRootHelpers(root, context)
}

function createRootHelpers(root, context) {
  const { helpers } = context
  root.helpers = helpers
}

function createRootCodegen(root) {
  root.codegenNode = root.children[0]
}

function traverseNode(node, context) {
  const { nodeTransforms, helpers } = context
  nodeTransforms.forEach(nodeTransform => nodeTransform(node))
  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      helpers.push(TO_DISPLAY_STRING)
      break
    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      traverseChildren(node, context)
      break
    default:
      break
  }
}

function traverseChildren(parent, context) {
  const { children = [] } = parent
  children.forEach(node => traverseNode(node, context))
}

function createTransformContext(
  root,
  {
    nodeTransforms = [],
  },
) {
  return {
    root,
    nodeTransforms,
    helpers: [],
  }
}
