<template>
  <view class="content">
    <my-echarts :option="option" style="width: 300px; height: 300px;"></my-echarts>
  </view>
</template>

<script>
import MyEcharts from '@/components/my-echarts/my-echarts.vue'
import TestOption from '@/pages/index/TestOption.js'
export default {
  components: { MyEcharts },
  data() {
    return {
      title: 'Hello',
      option: (new TestOption()).option // 添加到reflect列表中
    }
  },
  onLoad() {
    this.setOption()
  },
  methods: {
    setOption() {
      setTimeout(() => {
        this.option.series[0].data = [10, 43, 12, 12, 4, 5, 6, 5].reverse()
      }, 2000)
    }
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
</style>
