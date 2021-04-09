<template>
  <view class="my-echarts" :id="option.id" :prop="option" :change:prop="echarts.onPropChange"></view>
</template>

<script>
export default {
  props: ['option', 'events'],
  mounted() {
    // console.log('js:', this.option)
  },
  data() {
    return {}
  },
  methods: {
    /** 事件转发 */
    eventTransfer({ name, value }) {
      this.$emit(name, value)
    },
  },
}
</script>

<script module="echarts" lang="renderjs">
import myEChartsReflect from '@/components/my-echarts/MyEcharts.js'
export default {
  props: ['option', 'events'],
  mounted() {
    if (typeof echarts === 'object') {
    	this.init()
    } else {
      // #ifdef H5
      /** [参照](https://ask.dcloud.net.cn/question/88473) */
      window.wx = undefined
      // #endif
    	const script = document.createElement('script')
    	script.src = './static/echarts/echarts.36.min.js'
    	script.onload = this.init
    	document.head.appendChild(script)
    }
  },
  methods: {
    onPropChange(option, oldOption) {
      console.log('option change')
      if (Object.keys(oldOption).length === 0) {
        this.init()
      } else {
        this.update(option, oldOption)
      }
      // console.log(option)
      /** diff option 增量更新 */
    },
    init() {
      const id = this.option.id
      if (window.echarts && id && !this.isInited) {
        this.myEChartsReflect = myEChartsReflect.reflect(id)
        /** 不再使用id获取元素，在列表中展示，id会重复。 */
        this.myCharts = echarts.init(this.$el)
        this.myCharts.setOption(this.myEChartsReflect.option)
        this.setEventTransfer()
        this.isInited = true // 初始化标记
      }
    },
    update(option, oldOption) {
      this.myCharts.setOption(option)
    },
    /** 
     * 转发事件，可以自行添加echarts支持的事件 
     * https://echarts.apache.org/zh/api.html#events
     */
    setEventTransfer() {
      if (this.events instanceof Array && this.events.length > 0) {
        /** e.g. ['click', 'datazoom'] */
        this.events.forEach(name => {
          this.myCharts.on(name, params => {
            /** event 存在循环引用 暂时先去除该属性 */
            delete params.event
            this.$ownerInstance.callMethod('eventTransfer', {name, value: params})
          })
        })
      }
    },
  }
}
</script>

<style lang="scss">
.my-echarts {
  height: 100%;
}
</style>
