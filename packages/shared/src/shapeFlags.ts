export enum ShapeFlags {
  ELEMENT = 1,
  // 看了下源码，修改为和源码一致的值
  STATEFUL_COMPONENT = 1 << 2,
  TEXT_CHILDREN = 1 << 3,
  ARRAY_CHILDREN = 1 << 4,
  SLOTS_CHILDREN = 1 << 5,
  // custom value
  // 我感觉这里可以将插槽的类型细分为 functional 或 object 为后面处理插槽做判断更细化
  FUNCTIONAL_SLOTS_CHILDREN = 1 << 10,
  OBJECT_SLOTS_CHILDREN = 1 << 11,
}
