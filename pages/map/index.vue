
<template>
  <view class="content">
    <view class="my-echarts">
      <my-echarts id="MapOption" :data="mapData" @inited="getMapData"></my-echarts>
    </view>
  </view>
</template>

<script>
import MyEcharts from '@/components/my-echarts/my-echarts.vue'
export default {
  components: { MyEcharts },
  data() {
    return {
      text: '',
      mapData: [],
    }
  },
  onLoad() {
    // this.getMapData()
  },
  methods: {
    getMapData() {
      uni.request({
        url: 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/asset/data/hangzhou-tracks.json',
        method: 'GET',
        success: ({data}) => {
          this.mapData = data.map(function (track) {
            return {
              coords: track.map(function (seg, idx) {
                return seg.coord
              }),
            }
          })
        },
      })
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
import MapOption from '@/pages/map/MapOption.js'
export default {
  created() {
    myEChartsReflect.registOptConstructor(MapOption)
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
  width: 100vw;
  height: 100vh;
}
</style>
