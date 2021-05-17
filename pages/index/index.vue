<template>
  <view class="content">
    <view>单独展示</view>
    <view class="my-echarts">
      <my-echarts
        id="TestOption"
        :data="data"
        :events="['click', 'datazoom']"
        @inited="onInited"
        @click="onClick"
        @datazoom="onDatazoom"
        @rendered="onRendered"
        @finished="onFinished"
      ></my-echarts>
    </view>
    <view>点击事件：{{ text || '-' }}</view>
    <view>列表展示</view>
    <view class="my-echarts" v-for="(opt, i) in dataList" :key="i">
      <my-echarts id="TestOption" :data="opt" :events="['click']" @click="onClick"></my-echarts>
    </view>
    <button @click="toMap">map</button>
  </view>
</template>

<script>
import MyEcharts from '@/components/my-echarts/my-echarts.vue'
export default {
  components: { MyEcharts },
  data() {
    return {
      dataList: [0, 1].map(() => [11, 12, 9, 10, 32]),
      text: '',
      data: [],
    }
  },
  onLoad() {
    this.setData()
  },
  methods: {
    setData() {
      // for (let i = 0; i < 30; i++) {
      //   this.data.push(Math.floor(20 * Math.random()))
      // }
      /** 模仿接口请求数据 */
      setTimeout(() => {
        this.data = []
        for (let i = 0; i < 30; i++) {
          this.data.push(Math.floor(20 * Math.random()))
        }
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
    onRendered(params) {
      // console.log('on rendered', params)
    },
    onFinished(params) {
      console.log('on finished', params)
    },
    toMap() {
      uni.navigateTo({
        url: '/pages/map/index',
      })
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
  padding-bottom: 20px;
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
