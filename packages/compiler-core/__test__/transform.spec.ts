import { describe, expect, it } from 'vitest'
import { baseParse } from '../src/parse'
import { transform } from '../src/transform'
import { NodeTypes } from '../src/ast'

describe('transform', () => {
  it('should transform text', () => {
    const ast = baseParse('<div>hello</div>')

    const plugin = (node) => {
      if (node.type === NodeTypes.TEXT) {
        node.content = node.content += ' world'
      }
    }

    transform(ast, { nodeTransforms: [plugin] })

    expect(ast.children[0].children[0].content).toBe('hello world')
  })
})
