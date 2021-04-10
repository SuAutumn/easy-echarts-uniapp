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
      throw new TypeError('注册类应都为MyEChartsOption子类')
    }
  }

  /**
   * 创建option实列
   * @param {string} consName option构造函数名称
   * @returns {(MyEChartsOption|undefined)} 实列
   */
  reflect(consName) {
    if (typeof consName === 'string' && this.constructorList[consName]) {
      const Cons = this.constructorList[consName]
      if (!Cons) {
        throw new ReferenceError('未找到' + consName + '类')
      }
      return new Cons()
    }
  }
}

/** 单列模式 */
const myEChartsReflect = new MyEChartsReflect()
export default myEChartsReflect

/** 所有option父类，设置option中id */
export class MyEChartsOption {
  constructor() {
    this.option = {
      id: this.constructor.name
    }
  }
}
