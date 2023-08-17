import { isFunction } from '@mini-vue/shared'
import { ShapeFlags } from '@mini-vue/shared/src/shapeFlags'

export function initSlots(instance) {
  const { shapeFlag, children: slots } = instance.vnode
  if (shapeFlag & ShapeFlags.OBJECT_SLOTS_CHILDREN) {
    if (slots.__v_isVnode) {
      instance.slots = { default: () => slots }
    }
    else {
      instance.slots = Object.entries(slots).reduce((res, [slotName, slot]) => {
        Reflect.set(
          res,
          slotName,
          isFunction(slot)
            ? slot
            : () => slot,
        )

        return res
      }, {})
    }
  }
  else if (shapeFlag & ShapeFlags.FUNCTIONAL_SLOTS_CHILDREN) {
    // () => vnode
    instance.slots = { default: slots }
  }
}
