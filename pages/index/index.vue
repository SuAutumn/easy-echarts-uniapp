<template>
  <view class="content">
    <view>单独展示</view>
    <view class="my-echarts">
      <my-echarts
        :option="option"
        :events="['click', 'datazoom']"
        @inited="onInited"
        @click="onClick"
        @datazoom="onDatazoom"
      ></my-echarts>
    </view>
    <view>点击事件：{{ text || '-' }}</view>
    <view>列表展示</view>
    <view class="my-echarts" v-for="(opt, i) in optionList" :key="i">
      <my-echarts
        :option="opt"
        :events="['click']"
        @click="onClick"
      ></my-echarts>
    </view>
  </view>
</template>

<script>
import MyEcharts from '@/components/my-echarts/my-echarts.vue'
import TestOption from '@/pages/index/TestOption.js'
export default {
  components: { MyEcharts },
  data() {
    this.testOption = new TestOption()
    this.testOptionList = [0, 1, 2].map(() => new TestOption())
    return {
      title: 'Hello',
      option: this.testOption.option, // 添加到reflect列表中
      optionList: this.testOptionList.map((item) => item.option),
      text: '',
    }
  },
  onLoad() {
    this.setOption()
  },
  methods: {
    setOption() {
      /** 模仿接口请求数据 */
      setTimeout(() => {
        this.testOption.update()
        this.testOptionList.forEach(item => item.update())
      }, 2000)
    },
    onInited(val) {
      console.log('onInited: ', val)
    },
    onClick(params) {
      console.log(params)
      this.text = `${params.name} ${params.seriesName} ${params.data}`
    },
    onDatazoom(params) {
      console.log(params)
    },
  },
}
</script>
<script module="index" lang="renderjs">
import myEChartsReflect from '@/components/my-echarts/MyEcharts.js'
import TestOption from '@/pages/index/TestOption.js'
export default {
  created() {
    myEChartsReflect.registOptConstructor(TestOption)
  }
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
.my-echarts {
  width: 300px;
  height: 160px;
}
</style>
