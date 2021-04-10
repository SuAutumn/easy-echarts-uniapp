## easy-echarts

### 亮点

- <strong>无痛顺滑</strong>在 uni-app app 端编写 echarts 配置，几乎和在浏览器中书写方式一样。
- 支持 uniapp app 端 echarts 配置编写函数。
- 支持 uniapp H5 移动端 echarts 交互。
- 支持echarts事件，eg: <code>click,datazoom</code>，并将事件<code>$emit</code>到父组件，用户可自行处理。
- echarts初始化完成会有<code>inited</code>事件通知。

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
  作者从java中的反射机制得到灵感，在代码运行的时候，动态实例化新对象。  
  所以在renderjs层先注册了echarts option的类（<code>T extends MyEChartsOption</code>）。  
  在渲染echarts时候，实际上重新实列化了option，这一步的意义是保留option中函数设置。  
  这一就和在浏览器中编写方式一样。
