## easy-echarts

### 亮点

- <strong>无痛顺滑</strong>在 uni-app app 端编写 echarts 配置，几乎和在浏览器中书写方式一样。
- 解决 app 端 echarts 配置中函数去除问题。
- 可以配置echarts支持事件，并将事件<code>$emit</code>到父组件，用户可自行处理。

### 使用方式
template: <code>

    <my-echarts :option="option" style="width: 300px; height: 300px;"></my-echarts>
  </code>

script: 设置echart option
```javascript
import MyEcharts from '@/components/my-echarts/my-echarts.vue'
import TestOption from '@/pages/index/TestOption.js'
export default {
  components: { MyEcharts },
  data() {
    return {
      option: (new TestOption()).option, // 获取自定义option
    }
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

TestOption: 自定义option类，本示例中定义<strong>y轴formatter函数</strong>
```javascript

export default class TestOption extends MyEChartsOption {
  constructor() {
    super()
    this.option = {
      ...this.option,
      .
      .
      .
      // 自定义option
    }
  }
}
```

### props参数

| key | type | desc |
| ---- | ---- | ---- |
| option | <code>(T extends MyEChartsOption)T.option</code> |echarts 配置 |
| events | <code>string[]</code> | [echarts 支持的事件名称](https://echarts.apache.org/zh/api.html#events) |


### 约定
  * option的id为类名，这步代码已经默认设置好。
  * 所有option类应类似<code>TestOption</code>那样，继承<code>MyEChartsOption</code>。

### 思想
    在renderjs层缓存了option实现类，当在渲染echarts时候，实际上重新实列化了option。   
    并且重新实例化的option的内容和一开始option内容是一致的。   
    作者从java中的反射机制得到灵感，通过在运行的时候，动态构造一个新类。  
    所以先注册了要被构造的类，在渲染的时候再重新生成。
