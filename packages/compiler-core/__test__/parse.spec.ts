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

  describe('element', () => {
    it('should parse simple element', () => {
      const template = '<div></div>'

      const ast = baseParse(template)

      expect(ast).toEqual({
        children: [
          {
            type: NodeTypes.ELEMENT,
            tag: 'div',
            children: [],
          },
        ],
      })
    })

    it('should parse multiple element', () => {
      const template = '<div></div><div></div>'

      const ast = baseParse(template)

      expect(ast).toEqual({
        children: [
          {
            type: NodeTypes.ELEMENT,
            tag: 'div',
            children: [],
          },
          {
            type: NodeTypes.ELEMENT,
            tag: 'div',
            children: [],
          },
        ],
      })
    })

    it('should parse nested element', () => {
      const template = '<div><div><div></div></div></div>'

      const ast = baseParse(template)

      expect(ast).toEqual({
        children: [
          {
            type: NodeTypes.ELEMENT,
            tag: 'div',
            children: [
              {
                type: NodeTypes.ELEMENT,
                tag: 'div',
                children: [
                  {
                    type: NodeTypes.ELEMENT,
                    tag: 'div',
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      })
    })

    it('should throw an error when missing closing tag', () => {
      const template = '<div><span></div>'

      expect(() => {
        baseParse(template)
      }).toThrowError('missing closing tag: span')
    })
  })

  describe('text', () => {
    it('should parse simple text', () => {
      const template = 'hello world'

      const ast = baseParse(template)

      expect(ast).toEqual({
        children: [
          {
            type: NodeTypes.TEXT,
            content: 'hello world',
          },
        ],
      })
    })
  })
})
