import { generate } from './codegen'
import { baseParse } from './parse'
import { transform } from './transform'
import { transformElement } from './transforms/transformElement'
import { transformExpression } from './transforms/transformExpression'
import { transformText } from './transforms/transformText'

export function baseCompile(template: string) {
  const ast = baseParse(template)
  transform(ast, { nodeTransforms: [transformElement, transformText, transformExpression] })
  return generate(ast)
}
