import { getType } from '@mini-vue/shared'
import { ShapeFlags } from '@mini-vue/shared/src/shapeFlags'

export function createVNode(type, props?, children?) {
  return {
    // 这个标识是 为了处理 children 是 vnode 这些形式的 slot, 源码里面好像没有
    __v_isVnode: true, // 标识 vnode
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
    // 看了源码的处理是将 children 转化为 String(children) 的形式，所以不需要处理 boolean 和 number 了
    Undefined: vnodeShapeFlag,
    Boolean: vnodeShapeFlag | ShapeFlags.TEXT_CHILDREN,
    Number: vnodeShapeFlag | ShapeFlags.TEXT_CHILDREN,
    String: vnodeShapeFlag | ShapeFlags.TEXT_CHILDREN,
    Array: vnodeShapeFlag | ShapeFlags.ARRAY_CHILDREN,
    // SLOTS_CHILDREN 的条件应该是 component vnode + object children || function children
    // 源码里面只有 SLOTS_CHILDREN 这个 shapeFlag, 后续处理 children 又判断了一次类型，我觉得这里可以细分 slot 类型，后续处理 children 就可以直接使用 shapeFlag 了
    Object: vnodeShapeFlag | ShapeFlags.OBJECT_SLOTS_CHILDREN,
    Function: vnodeShapeFlag | ShapeFlags.FUNCTIONAL_SLOTS_CHILDREN,
  }

  const shapeFlag = childrenMap[getType(children)]

  return shapeFlag
}
