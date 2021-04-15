## easy-echarts

### 亮点

- <strong>无痛顺滑</strong>在 uni-app app 端编写 echarts 配置，几乎和在浏览器中书写方式一样。
- 支持 uniapp app 端 echarts 配置编写函数。
- 支持 uniapp H5 移动端 echarts 交互。
- 支持 echarts 事件，eg: <code>click,datazoom</code>，并将事件<code>$emit</code>到父组件，用户可自行处理。
- 支持 echarts 初始化完成<code>inited</code>事件通知。

### 使用方式

template: 
```html
<view class="my-echarts">
  <!-- id为option类的静态属性name -->
  <my-echarts
    id="TestOption"
    :data="data"
    :events="['click', 'datazoom']"
    @inited="onInited"
    @click="onClick"
    @datazoom="onDatazoom"
  ></my-echarts>
</view>
```
script: 设置echart需要展示数据
```javascript
import MyEcharts from '@/components/my-echarts/my-echarts.vue'
export default {
  components: { MyEcharts },
  data() {
    return {
      data: []
    }
  },
  onLoad() {
    /** 获取数据 */
    this.setData()
  }
}
```

renderjs: 在renderjs层注册自定义<code>TestOption</code>类
```javascript
import myEChartsReflect from '@/components/my-echarts/MyEcharts.js'
import TestOption from '@/pages/index/TestOption.js'
export default {
  created() {
    myEChartsReflect.registOptConstructor(TestOption)
  }
}
```

TestOption: 自定义option类，本示例中定义<strong>y轴formatter函数和serires label展示函数</strong>。

<strong style="background-color: red; color: white;">请一定要手动设置每个option类的静态属性name</strong>。

  * 说明1：在uni-app打包时，视图层的this.constructor.name
    和逻辑层this.constructor.name存在不一致情况，
    导致无法在renderjs层重新实例化逻辑层的option构造类。
  * 说明2：id需要和name保持一致。

```javascript

export default class TestOption extends MyEChartsOption {
  /** 
   * 构造函数名称，实际上可以赋值任何字符串，但建议是变量名称。
   * fix bug: 修复在uni-app打包时，视图层的this.constructor.name
   * 和逻辑层this.constructor.name不一致情况
   * 导致无法在renderjs层重新实例化逻辑层的option构造类。
   */
  static name = 'TestOption'

  constructor(data = []) {
    super()
    const total = data.reduce((prev, val) => {
      return prev + val
    }, 0)
    this.option = {
      .
      // 自定义option
      .
      yAxis: {
        axisLabel: {
          formatter: function (value, index) {
            return value.toFixed(2)
          }
        },
      },
      series: [{
        data: [],
        label: {
          formatter: function (params) {
            if (total === 0) return '0%'
            return Math.floor(params.data / total * 100) + '%'
          }
        }
      }],
      .
      // 自定义option
      .
    }
  }
}
```

### props参数

| key | type | desc |
| ---- | ---- | ---- |
| data | <code>any</code> | 需要展示的数据 |
| events | <code>string[]</code> | [echarts 支持的事件名称](https://echarts.apache.org/zh/api.html#events) |


### 约定
  * <code>\<my-echarts\></code>的id为option类静态属性<code>name</code>，建议全局唯一，不然新会覆盖老的。
  * 所有option类应类似<code>TestOption</code>那样，继承<code>MyEChartsOption</code>。
  * 不要在option类中修改入参对象，这个会触发vue setter，<strong>导致无限触发change:prop函数</strong>，如果一定需要改变原入参对象请深拷贝原对象。e.g <code>JSON.parse(JSON.stringify(data))</code>或者使用<code>MyEcharts.clone</code>工具函数。
    ```js
    import { MyEChartsOption, clone } from '@/components/my-echarts/MyEcharts.js'

    export default class TestOption extends MyEChartsOption {

      static name = 'TestOption'

      constructor(data = []) {
        // 深拷贝
        const newData = clone(data)
      }
    }

    ```
  * 如果需要对option类构造函数入参<code>data</code>做大量数据计算，请在逻辑层预先处理好。

### 思想
    作者从java中的反射机制得到灵感，在代码运行的时候，动态实例化新对象。  
    所以在renderjs层先注册了echarts option的类（<code>T extends MyEChartsOption</code>）。  
    在渲染echarts时候，只用逻辑层data实际上重新实列化了option，这一步的意义是保留option中函数设置。  
    这样就和在浏览器中编写方式一样。


#### 如果本项目帮助到您的话，请您不要吝啬，赠人玫瑰，手留余香。随手点个[star](https://gitee.com/gitee_zhangp/easy-echarts-uniapp)，或者满分好评。

#### 如遇问题，欢迎提[issue](https://gitee.com/gitee_zhangp/easy-echarts-uniapp/issues)，或者底部留言。
