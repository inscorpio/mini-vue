import { describe, expect, it } from 'vitest'
import { baseParse } from '../src/parse'
import { NodeTypes } from '../src/ast'

describe('parse', () => {
  describe('interpolation', () => {
    it('should parse simple interpolation', () => {
      const template = '{{message}}'

      const ast = baseParse(template)

      expect(ast).toEqual({
        children: [
          {
            type: NodeTypes.INTERPOLATION,
            content: {
              type: NodeTypes.SIMPLE_EXPRESSION,
              content: 'message',
            },
          },
        ],
      })
    })

    it('should parse simple interpolation with whitespace characters', () => {
      const template = '{{ message }}'

      const ast = baseParse(template)

      expect(ast).toEqual({
        children: [
          {
            type: NodeTypes.INTERPOLATION,
            content: {
              type: NodeTypes.SIMPLE_EXPRESSION,
              content: 'message',
            },
          },
        ],
      })
    })

    it('should parse multiple interpolation', () => {
      const template = '{{message1}}{{message2}}'

      const ast = baseParse(template)

      expect(ast).toEqual({
        children: [
          {
            type: NodeTypes.INTERPOLATION,
            content: {
              type: NodeTypes.SIMPLE_EXPRESSION,
              content: 'message1',
            },
          },
          {
            type: NodeTypes.INTERPOLATION,
            content: {
              type: NodeTypes.SIMPLE_EXPRESSION,
              content: 'message2',
            },
          },
        ],
      })
    })
  })
})
