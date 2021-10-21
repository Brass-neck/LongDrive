export const enum ShapeFlags {
  ELEMENT = 1, // 元素
  FUNCTIONAL_COMPONENT = 1 << 1, //函数组件
  STATEFUL_COMPONENT = 1 << 2, // 带状态的组件
  TEXT_CHILDREN = 1 << 3, // 组件的孩子是文本
  ARRAY_CHILDREN = 1 << 4, // 组件的孩子是数组
  SLOTS_CHILDREN = 1 << 5, // 组件的孩子是插槽
  TELEPORT = 1 << 6, // 传送门
  SUSPENSE = 1 << 7, // 实现异步组件
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT // |是按位或
}
