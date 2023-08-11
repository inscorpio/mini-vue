import { getType } from '@mini-vue/shared'
import { ShapeFlags } from '@mini-vue/shared/src/shapeFlags'

export function createVNode(type, props?, children?) {
  return {
    type,
    props,
    children,
    el: null,
    shapeFlag: getShapeFlag(type, children),
  }
}

function getShapeFlag(type, children) {
  const vnodeMap = {
    String: ShapeFlags.ELEMENT,
    Object: ShapeFlags.STATEFUL_COMPONENT,
  }

  const vnodeShapeFlag = vnodeMap[getType(type)]

  const childrenMap = {
    // 不知道这样处理对不对，但是可以解决不能渲染 boolean 和 number 的 children 的 bug
    Undefined: vnodeShapeFlag,
    Boolean: vnodeShapeFlag | ShapeFlags.TEXT_CHILDREN,
    Number: vnodeShapeFlag | ShapeFlags.TEXT_CHILDREN,
    String: vnodeShapeFlag | ShapeFlags.TEXT_CHILDREN,
    Array: vnodeShapeFlag | ShapeFlags.ARRAY_CHILDREN,
  }

  const shapeFlag = childrenMap[getType(children)]

  return shapeFlag
}
