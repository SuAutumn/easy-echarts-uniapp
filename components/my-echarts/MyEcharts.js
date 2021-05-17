import { loadBmapApi, loadJs } from './loadJsCallback'
import mixin from './mixin'

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
      throw new ReferenceError('未找到' + consName + '类，您可能没有设置' + consName + '类的静态属性name')
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
  constructor() {
    if (new.target === MyEChartsOption) {
      throw new Error(MyEChartsOption.name + '不能被直接实例化')
    }
    if (!Object.getOwnPropertyDescriptor(this.constructor, 'name').writable) {
      throw new Error('请设置' + this.constructor.name + '类的静态属性name')
    }
    this.context = null
    this.option = {}
  }

  /**
   * 请求echarts 资源依赖
   * @param {string} id 页面组件id属性
   */
  async onCreate(id) {
    if (!(window.echarts && window.echarts.version)) {
      await this.loadJs('./static/echarts/echarts.min.js')
    }
  }

  /**
   * 执行echart初始化
   * @param {Object} context echarts.init返回值
   */
  onStart(context) {
    this.context = context
  }

  /**
   * data发生改变回调函数
   * @param {any} data 页面组件接受的data
   */
  onDatachange(option, data, callJsMethod) {}

  onDestroy() {
    this.context.dispose()
  }

  /** events */

  onTouchstart(option, event, callJsMethod) {}
  onTouchmove(option, event, callJsMethod) {}
  onTouchend(option, event, callJsMethod) {}

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

/**
 * 添加loadjs方法
 */
mixin(MyEChartsOption.prototype, {
  loadJs: loadJs,
  loadBmapApi: loadBmapApi,
})

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
