<template>
  <view
    class="my-echarts"
    :prop="data"
    :data-events="events"
    :change:prop="echarts.onPropChange"
    @touchstart="echarts.onTouchstart"
    @touchend="echarts.onTouchend"
    @touchmove="echarts.onTouchmove"
  ></view>
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
export default {
  data() {
    this.isInited = false // 初始化标记
    this.consOpt = () => {} // echarts option constructor
    this.consIns = null // consOpt 实列化
    this.myCharts = null
    this._newData = null // 缓存在初始化之前变化的data
    return {}
  },
  mounted() {
    // #ifdef H5
    /** [参照](https://ask.dcloud.net.cn/question/88473) */
    window.wx = undefined
    // #endif
    if (!this.$el.id) throw new TypeError('请设置元素的id')
    this.consOpt = myEChartsReflect.reflect(this.$el.id)
    this.consIns = new this.consOpt()
    this.consIns.onCreate(this.$el.id).then(this.init)
  },
  methods: {
    onPropChange(option, oldOption) {
      this.update(option, oldOption)
    },
    init() {
      /** 不再使用id获取元素，在列表中展示，id会重复。 */
      this.myCharts = echarts.init(this.$el)
      this.isInited = true
      this.consIns.onStart(this.myCharts)
      this.setEventTransfer()
      this.update(this._newData || this.data)
    },
    update(data, oldData) {
      /** 防止option更新时候 还没有初始化好 */
      if (this.isInited) {
        this.myDispatch('datachange', data)
      } else {
        // fix: 修复在手机端数据change之后this.data值为undefined，导致init时候this.data错误
        this._newData = data
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
            this.myDispatch(name, params)
          })
        })
      }
      /** 初始化事件 */
      this.callJsMethod('inited', this.isInited)
    },
    callJsMethod(name, value) {
      this.$ownerInstance.callMethod('eventTransfer', {name, value})
    },
    /**
     * call the class event method function(e.g. onClick, onDatazoom)
     */
    myDispatch(name, params) {
      const event = 'on' + name[0].toUpperCase() + name.slice(1)
      const option = this.myCharts.getOption()
      if ( typeof this.consIns[event] === 'function' ){
        const r = this.consIns[event](option, params, this.callJsMethod)
        r && this.myCharts.setOption(r)
      } else {
        console.warn(`请先定义${this.consOpt.name}#${name}方法。`)
      }
    },
	  getEvents() {
		  const e = this.$ownerInstance.getDataset().events
		  if (e) {
			  return e.split(',')
		  }
	  },
    onTouchstart(e) {
      this.onTouch('touchstart', e)
    },
    onTouchend(e) {
      this.onTouch('touchend', e)
    },
    onTouchmove(e) {
      this.onTouch('touchmove', e)
    },
    onTouch(name, e) {
      if (this.isInited) {
        /** event 存在循环引用 暂时先去除该属性 */
        this.myDispatch(name, e)
      }
    },
  },
  beforeDestroy() {
    if (this.consIns) {
      this.consIns.onDestroy()
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
