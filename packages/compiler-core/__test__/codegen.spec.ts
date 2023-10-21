import { describe, expect, it } from 'vitest'
import { baseParse } from '../src/parse'
import { transform } from '../src/transform'
import { generate } from '../src/codegen'

describe('codegen', () => {
  it('should return a render function with text', () => {
    const ast = baseParse('hello world')
    transform(ast)
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })
})
