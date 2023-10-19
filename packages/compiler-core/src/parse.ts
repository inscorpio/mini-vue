import { NodeTypes } from './ast'

const startDelimiter = '{{'
const endDelimiter = '}}'

const openingTagReg = /^<([a-z]*)/
const closingTagReg = /^<\/([a-z]*)/

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
  while (!isEnd(context)) {
    let node

    if (context.source.startsWith(startDelimiter)) {
      node = parseInterpolation(context)
    }
    else if (context.source[0] === '<') {
      if (/[a-z]/.test(context.source[1])) {
        node = parseElement(context)
      }
    }

    nodes.push(node)
  }
  return nodes
}

// *** 当解析完 或 遇到结束标签时结束
function isEnd(context) {
  return !context.source || closingTagReg.test(context.source)
}

function parseElement(context) {
  // <div><span></div>
  const match = openingTagReg.exec(context.source)
  const tag = match[1]

  // parse opening tag: <div>
  advanceBy(context, 2 + tag.length)
  // parse children
  const children = parseChildren(context)

  const closingTag = closingTagReg.exec(context.source)[1]
  // 如果开始标签和结束标签匹配的话就继续，否则抛出错误
  if (tag === closingTag) {
    // parse closing tag: </div>
    advanceBy(context, 3 + tag.length)
  }
  else {
    throw new Error(`missing closing tag: ${tag}`)
  }

  return {
    type: NodeTypes.ELEMENT,
    tag,
    children,
  }
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
