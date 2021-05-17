/**
 * 给class prototyp 混入方法和字段
 * @param {Object} target 元对象
 * @param {Object} source 混入对象
 */
export default function mixin(target, source) {
  for(const k in source) {
    if (target.hasOwnProperty(k)) {
      console.warn('重写' + k)
    }
    target[k] = source[k]
  }
}