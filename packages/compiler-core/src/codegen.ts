import { isString, nullable } from '@mini-vue/shared'
import { NodeTypes } from './ast'
import { CREATE_ELEMENT_VNODE, TO_DISPLAY_STRING, helperMapName } from './runtimeHelper'

export function generate(ast) {
  const { codegenNode } = ast
  const context = createCodegenContext()
  const { push } = context
  const functionName = 'render'
  const args = ['_ctx']
  const signature = args.join(', ')
  genFunctionPreamble(ast, context)
  push(`return function ${functionName}(${signature}) {`)
  push('\n')
  push('  return ')
  genNode(codegenNode, context)
  push('\n')
  push('}')
  return {
    code: context.code,
  }
}

function genFunctionPreamble(ast, context) {
  const { helpers } = ast
  const { push } = context
  const VueBinding = 'Vue'
  const aliasHelper = (s) => {
    const helper = helperMapName[s]
    return `${helper}: _${helper}`
  }

  if (helpers.size) {
    push(`const { ${Array.from(helpers).map(aliasHelper).join(', ')} } = ${VueBinding}\n`)
  }
}

function genNode(node, context) {
  const { push } = context
  if (isString(node)) {
    push(node)
    return
  }
  switch (node.type) {
    case NodeTypes.TEXT:
      genText(node, context)
      break
    case NodeTypes.INTERPOLATION:
      genInterpolation(node, context)
      break
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, context)
      break
    case NodeTypes.ELEMENT:
      genElement(node, context)
      break
    case NodeTypes.COMPOUND_EXPRESSION:
      genChildren(node.children, context)
      break
    default:
      break
  }
}

function genChildren(children, context) {
  children.forEach(child => genNode(child, context))
}

function genElement(node, context) {
  const { push, helper } = context
  const { tag, props, children } = node
  push(`${helper(CREATE_ELEMENT_VNODE)}(`)
  push(`"${tag}"`)
  if (children.length) {
    push(', ')
    push(`${nullable(props)}`)
    push(', ')
    if (children.length > 1) {
      push('[')
      genNodeList(children, context)
      push(']')
    }
    else {
      genChildren(children, context)
    }
  }
  else if (props) {
    push(props)
  }
  push(')')
}

function genNodeList(nodes, context) {
  const { push } = context
  nodes.forEach((node, i) => {
    genNode(node, context)
    if (i < nodes.length - 1) {
      push(', ')
    }
  })
}

function genExpression(node, context) {
  const { push } = context
  push(node.content)
}

function genInterpolation(node, context) {
  const { push, helper } = context
  push(`${helper(TO_DISPLAY_STRING)}(`)
  genExpression(node.content, context)
  push(')')
}

function genText(node, context) {
  const { push } = context
  push(`"${node.content}"`)
}

function createCodegenContext() {
  const context = {
    code: '',
    push(source) {
      context.code += source
    },
    helper(key) {
      return `_${helperMapName[key]}`
    },
  }
  return context
}
