class MyEChartsReflect {
  constructor() {
    this.constructorList = {}
  }
  registOptConstructor(optCons) {
    if (optCons.prototype instanceof MyEChartsOption) {
      this.constructorList[optCons.name] = optCons
    } else {
      throw new TypeError('注册类应都为MyEChartsOption子类')
    }
  }

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

export class MyEChartsOption {
  constructor() {
    this.option = {
      id: this.constructor.name
    }
  }
}
