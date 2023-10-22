import { describe, expect, it } from 'vitest'
import { baseParse } from '../src/parse'
import { transform } from '../src/transform'
import { generate } from '../src/codegen'
import { transformExpression } from '../src/transforms/transformExpression'

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
})
