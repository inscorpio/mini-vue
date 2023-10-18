import { NodeTypes } from './ast'

const startDelimiter = '{{'
const endDelimiter = '}}'

export function baseParse(content: string) {
  const context = createParseContext(content)
  return createRoot(context)
}

function createRoot(context: { source: string }) {
  const children = parseChildren(context)
  return {
    children,
  }
}

function createParseContext(content: string) {
  return {
    source: content,
  }
}

function parseChildren(context) {
  const nodes = []

  // 没解析完就一直解析
  while (context.source) {
    let node

    if (context.source.startsWith(startDelimiter)) {
      node = parseInterpolation(context)
    }

    nodes.push(node)
  }
  return nodes
}

function parseInterpolation(context) {
  // {{message}}
  const index = context.source.indexOf(endDelimiter)

  // 解析 {{
  advanceBy(context, startDelimiter.length)
  const content = context.source.slice(0, index - startDelimiter.length)
  // 解析 content
  advanceBy(context, content.length)
  // 解析 }}
  advanceBy(context, endDelimiter.length)

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content.trim(),
    },
  }
}

function advanceBy(context, length) {
  context.source = context.source.slice(length)
}
