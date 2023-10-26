import { baseCompile } from '@mini-vue/compiler-core'
import { registerRuntimeCompiler } from '@mini-vue/runtime-dom'
import * as runtimeDom from '@mini-vue/runtime-dom'

export * from '@mini-vue/runtime-dom'
export * from '@mini-vue/compiler-core'

export function compilerToFunction(template) {
  const { code } = baseCompile(template)
  // eslint-disable-next-line no-new-func
  const render = new Function('Vue', code)(runtimeDom)
  return render
}

registerRuntimeCompiler(compilerToFunction)
