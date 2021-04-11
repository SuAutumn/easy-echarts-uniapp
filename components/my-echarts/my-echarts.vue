<template>
  <view
    class="my-echarts"
    :id="option.id"
    :prop="option"
    :data-events="events"
    :change:prop="echarts.onPropChange"
  ></view>
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
  data() {
    this.isInited = false // 初始化标记
    this.cacheOption = null // 记录在初始化之前的已变更option
    this.instance = null // echarts instance
    return {}
  },
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
      this.update(option, oldOption)
    },
    init() {
      const id = this.option.id
      if (id && !this.isInited) {
        this.instance = myEChartsReflect.reflect(id)
        /** 不再使用id获取元素，在列表中展示，id会重复。 */
        this.myCharts = echarts.init(this.$el)

        this.update(this.instance.option)
        this.setEventTransfer()
        this.isInited = true
        // 更新一把option, 防止option已发生改变
        if (this.cacheOption) {
          this.update(this.cacheOption)
          this.cacheOption = null
        }
      }
    },
    update(option, oldOption) {
      /** 防止option更新时候 还没有初始化好 */
      if (this.myCharts) {
        this.instance.updateOption(option)
        this.myCharts.setOption(option)
      } else {
        this.cacheOption = option
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
            delete params.event
            this.$ownerInstance.callMethod('eventTransfer', {name, value: params})
          })
        })
      }
      /** 初始化事件 */
      this.$ownerInstance.callMethod('eventTransfer', {name: 'inited', value: true})
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
}
</style>
