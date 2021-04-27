<template>
  <view class="my-echarts" :prop="data" :data-events="events" :change:prop="echarts.onPropChange"></view>
</template>

<script>
export default {
  props: ['events', 'data'],
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
import loadJsCallback from '@/components/my-echarts/loadJsCallback.js'
export default {
  data() {
    this.isInited = false // 初始化标记
    this.consOpt = () => {} // echarts option constructor
    return {}
  },
  mounted() {
    // #ifdef H5
    /** [参照](https://ask.dcloud.net.cn/question/88473) */
    window.wx = undefined
    // #endif
    loadJsCallback(this.$el.id).then(this.init)
  },
  methods: {
    onPropChange(option, oldOption) {
      this.update(option, oldOption)
    },
    init() {
      if (!this.$el.id) throw new TypeError('请设置元素的id')
      this.consOpt = myEChartsReflect.reflect(this.$el.id)
      if (!this.isInited && this.consOpt) {
        /** 不再使用id获取元素，在列表中展示，id会重复。 */
        this.myCharts = echarts.init(this.$el)
        this.isInited = true
        this.setEventTransfer()
        this.update(this.data)
      }
    },
    update(data, oldData) {
      /** 防止option更新时候 还没有初始化好 */
      if (this.isInited) {
        this.myCharts.setOption(new this.consOpt(data, this.myCharts).option, true)
      } 
    },
    /**
     * 转发事件，可以自行添加echarts支持的事件
     * https://echarts.apache.org/zh/api.html#events
     */
    setEventTransfer() {
		  const events = this.getEvents()
      if (events instanceof Array && events.length > 0) {
        /** e.g. ['click', 'datazoom'] */
        events.forEach(name => {
          this.myCharts.on(name, params => {
            /** event 存在循环引用 暂时先去除该属性 */
            if (Object.prototype.toString.call(params) === '[object Object]') {
              delete params.event
            }
            this.$ownerInstance.callMethod('eventTransfer', {name, value: params})
          })
        })
      }
      /** 初始化事件 */
      this.$ownerInstance.callMethod('eventTransfer', {name: 'inited', value: this.isInited})
    },
	  getEvents() {
		  const e = this.$ownerInstance.getDataset().events
		  if (e) {
			  return e.split(',')
		  }
	  }
  },
  beforeDestroy() {
    if (this.myCharts) {
      this.myCharts.dispose()
    }
  }
}
</script>

<style lang="scss">
.my-echarts {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
