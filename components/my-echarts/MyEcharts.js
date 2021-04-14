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
      if (this.constructorList[optCons.name]) {
        console.warn('存在相同' + optCons.name + '的构造函数，将会使新的覆盖老的，建议使用全局唯一name')
      }
      this.constructorList[optCons.name] = optCons
    } else {
      throw new TypeError('注册类应都为MyEChartsOption子类')
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

/** 所有option父类，设置option中id */
export class MyEChartsOption {
  /**
   * 构造函数名称
   * fix bug: 修复在uni-app打包时，视图层的this.constructor.name和逻辑层this.constructor.name不一致情况
   * 导致无法在renderjs层重新实例化逻辑层的option构造类。
   */
  static name = 'MyEChartsOption'

  constructor() {
    if (!Object.getOwnPropertyDescriptor(this.constructor, 'name').writable) {
      throw new Error('请设置' + this.constructor.name + '类的静态属性name')
    }
    // this.option = {
    //   id: this.constructor.name
    // }
  }

  /** 合并option */
  // updateOption(newOpt) {
  //   if (Object.prototype.toString.call(newOpt) === '[object Object]') {
  //     const stack = [[newOpt, this.option]]
  //     while (stack.length > 0) {
  //       const [newVal, val] = stack.pop()
  //       if (newVal === val) {
  //         continue
  //       }
  //       for (const k in newVal) {
  //         if (Object.prototype.hasOwnProperty.call(newVal, k)) {
  //           if (newVal[k] !== val[k]) {
  //             /** 数据直接替换，不做比较 */
  //             if (k === 'data' ||
  //               isPrimaryType(newVal[k]) ||
  //               !newVal[k] ||
  //               !Object.prototype.hasOwnProperty.call(val, k)) {
  //               val[k] = newVal[k]
  //             } else {
  //               stack.push([newVal[k], val[k]])
  //             }
  //           }
  //         }
  //       }

  //     }
  //   }
  // }
}

function isPrimaryType(input) {
  return ['undefined', 'string', 'number', 'boolean', 'symbol'].indexOf(typeof input) > -1
}

function getConstructor(obj) {
  return (obj.__proto__ || Object.getPrototypeOf(obj)).constructor
}

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
