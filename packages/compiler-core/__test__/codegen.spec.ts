import { describe, expect, it } from 'vitest'
import { baseParse } from '../src/parse'
import { transform } from '../src/transform'
import { generate } from '../src/codegen'
import { transformExpression } from '../src/transforms/transformExpression'
import { transformElement } from '../src/transforms/transformElement'
import { transformText } from '../src/transforms/transformText'

describe('codegen', () => {
  it('should return a render function with text', () => {
    const ast = baseParse('hello world')
    transform(ast)
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })

  it('should return a render function with interpolation', () => {
    const ast = baseParse('{{message}}')
    transform(ast, { nodeTransforms: [transformExpression] })
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })

  it('should return a render function only with element', () => {
    const ast = baseParse('<div></div>')
    transform(ast, { nodeTransforms: [transformElement] })
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })

  it('should return a render function with element nested with text', () => {
    const ast = baseParse('<div>hello world</div>')
    transform(ast, { nodeTransforms: [transformElement] })
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })

  it('should return a render function with compound node', () => {
    const ast = baseParse('<div>hello {{message}}</div>')
    transform(ast, { nodeTransforms: [transformElement, transformText, transformExpression] })
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })

  it('should return a render function with compound node 2', () => {
    const ast = baseParse('<div><span>hello </span>{{message}}</div>')
    transform(ast, { nodeTransforms: [transformElement, transformText, transformExpression] })
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })
})
