export function generate(ast) {
  const context = createCodegenContext()
  const { push } = context
  const functionName = 'render'
  const args = ['_ctx']
  const signature = args.join(', ')

  push(`export function${functionName}(${signature}) {`)
  push('return ')
  genNode(ast.codegenNode, context)
  push('}')
  return {
    code: context.code,
  }
}

function genNode(node, context) {
  const { push } = context
  push(`"${node.content}"`)
}

function createCodegenContext() {
  const context = {
    code: '',
    push(source) {
      context.code += source
    },
  }
  return context
}
