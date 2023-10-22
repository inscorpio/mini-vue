import { NodeTypes } from './ast'
import { TO_DISPLAY_STRING, helperMapName } from './runtimeHelper'

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
  const VueBinging = 'Vue'
  const aliasHelper = (s) => {
    const helper = helperMapName[s]
    return `${helper}: _${helper}`
  }

  if (helpers.length) {
    push(`const { ${helpers.map(aliasHelper)} } = ${VueBinging}`)
    push('\n')
  }
}

function genNode(node, context) {
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
    default:
      break
  }
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
