/** 反射容器 */
class MyEChartsReflect {
  constructor() {
    this.constructorList = {}
  }
  /**
   * 注册option构造函数
   * @param {typeof MyEChartsOption} optCons option构造函数
   */
  registOptConstructor(optCons) {
    if (typeof optCons === 'function' && optCons.prototype instanceof MyEChartsOption) {
      if (process.env.NODE_ENV === 'development') {
        if (this.constructorList[optCons.name]) {
          console.warn(optCons.name + '已经注册过，确定覆盖原来，请忽略。')
        }
      }
      this.constructorList[optCons.name] = optCons
    } else {
      throw new TypeError(String(optCons) + '应为MyEChartsOption子类')
    }
  }

  /**
   * 创建option实列
   * @param {string} consName option构造函数名称
   * @returns {(MyEChartsOption|undefined)} 实列
   */
  reflect(consName) {
    const Cons = this.constructorList[consName]
    if (!Cons) {
      throw new ReferenceError('未找到' + consName + '类')
    }
    return Cons
  }
}

/** 单列模式 */
const myEChartsReflect = new MyEChartsReflect()
export default myEChartsReflect

/** 所有option父类 */
export class MyEChartsOption {
  /**
   * 构造函数名称
   * fix bug: 修复在uni-app打包时，视图层的this.constructor.name和逻辑层this.constructor.name不一致情况
   * 导致无法在renderjs层重新实例化逻辑层的option构造类。
   */
  static name = 'MyEChartsOption'

  /**
   * @param {ECharts} context echarts实列
   */
  constructor(context) {
    if (!Object.getOwnPropertyDescriptor(this.constructor, 'name').writable) {
      throw new Error('请设置' + this.constructor.name + '类的静态属性name')
    }
    this.context = context
  }

  showLoading() {
    this.context.showLoading('default', {
      /** 数据内容参照 https://echarts.apache.org/zh/api.html#echartsInstance.showLoading */
      text: '加载中',
      textColor: '#8358dd',
      color: '#8358dd',
      lineWidth: 2,
    })
  }

  hideLoading() {
    this.context.hideLoading()
  }
}

function isPrimaryType(input) {
  return ['undefined', 'string', 'number', 'boolean', 'symbol'].indexOf(typeof input) > -1
}

function getConstructor(obj) {
  return (obj.__proto__ || Object.getPrototypeOf(obj)).constructor
}

/** 深拷贝 */
export function clone(obj) {
  if (isPrimaryType(obj) || !obj) return obj
  const root = new getConstructor(obj)()
  const stack = [[obj, root]]
  while (stack.length > 0) {
    const [origin, res] = stack.pop()
    for (const k in origin) {
      if (Object.prototype.toString.call(origin, k)) {
        if (isPrimaryType(origin[k]) || !origin[k]) {
          res[k] = origin[k]
        } else {
          res[k] = new getConstructor(origin[k])()
          stack.push([origin[k], res[k]])
        }
      }
    }
  }
  return root
}
