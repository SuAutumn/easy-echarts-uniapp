<template>
  <view class="my-echarts" :id="option.id" :prop="option" :change:prop="echarts.onPropChange"></view>
</template>

<script>
export default {
  props: ['option'],
  mounted() {
    // console.log('js:', this.option)
  },
  data() {
    return {}
  },
}
</script>

<script module="echarts" lang="renderjs">
import myEChartsReflect from '@/components/my-echarts/MyEcharts.js'
export default {
  props: ['option'],
  data() {
    return{}
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
    /** 挂在函数 */
    // this.myCharts.setOption(this.myEChartsReflect)
  },
  methods: {
    onPropChange(option, oldOption) {
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
        this.myCharts = echarts.init(document.querySelector('#' + id))
        this.myCharts.setOption(this.myEChartsReflect.option)
        this.isInited = true // 初始化标记
      }
    },
    update(option, oldOption) {
      this.myCharts.setOption(option)
    }
  }
}
</script>

<style lang="scss">
.my-echarts {
  height: 100%;
}
</style>
