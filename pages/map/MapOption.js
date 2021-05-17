import { MyEChartsOption, loadBmap, loadJs, delay } from '@/components/my-echarts/MyEcharts.js'
const B_MAP_AK = 'CKXbsfREBTNY3fiYPoK5hs0GmFvCG2z8 '

export default class MapOption extends MyEChartsOption {
  static name = 'MapOption'

  async onCreate(id) {
    await super.onCreate(id)
    if (!window.BMap) {
      await Promise.all([this.loadBmapApi(B_MAP_AK), this.loadJs('./static/echarts/bmap.js')])
    }
  }

  onStart(context) {
    super.onStart(context)
    this.showLoading()
  }

  onDataChange(lines) {
    this.hideLoading()
    this.option = {
      ...this.option,
      grid: {
        top: '10%',
        bottom: '30%',
        left: '5%',
        right: '15%',
      },
      bmap: {
        center: [120.13066322374, 30.240018034923],
        zoom: 14,
        roam: true,
        mapStyle: {
          styleJson: [
            {
              featureType: 'water',
              elementType: 'all',
              stylers: {
                color: '#d1d1d1',
              },
            },
            {
              featureType: 'land',
              elementType: 'all',
              stylers: {
                color: '#f3f3f3',
              },
            },
            {
              featureType: 'railway',
              elementType: 'all',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'highway',
              elementType: 'all',
              stylers: {
                color: '#fdfdfd',
              },
            },
            {
              featureType: 'highway',
              elementType: 'labels',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'arterial',
              elementType: 'geometry',
              stylers: {
                color: '#fefefe',
              },
            },
            {
              featureType: 'arterial',
              elementType: 'geometry.fill',
              stylers: {
                color: '#fefefe',
              },
            },
            {
              featureType: 'poi',
              elementType: 'all',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'green',
              elementType: 'all',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'subway',
              elementType: 'all',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'manmade',
              elementType: 'all',
              stylers: {
                color: '#d1d1d1',
              },
            },
            {
              featureType: 'local',
              elementType: 'all',
              stylers: {
                color: '#d1d1d1',
              },
            },
            {
              featureType: 'arterial',
              elementType: 'labels',
              stylers: {
                visibility: 'off',
              },
            },
            {
              featureType: 'boundary',
              elementType: 'all',
              stylers: {
                color: '#fefefe',
              },
            },
            {
              featureType: 'building',
              elementType: 'all',
              stylers: {
                color: '#d1d1d1',
              },
            },
            {
              featureType: 'label',
              elementType: 'labels.text.fill',
              stylers: {
                color: '#999999',
              },
            },
          ],
        },
      },
      series: [
        {
          type: 'lines',
          coordinateSystem: 'bmap',
          data: lines,
          polyline: true,
          lineStyle: {
            color: 'purple',
            opacity: 1.6,
            width: 2,
          },
        },
      ],
    }
    console.log(this.option)
  }
}
