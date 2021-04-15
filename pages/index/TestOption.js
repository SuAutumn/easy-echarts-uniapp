import { MyEChartsOption } from '@/components/my-echarts/MyEcharts.js'
const TOOLTIP_CONF = {
  trigger: 'axis',
  triggerOn: 'mousemove',
  axisPointer: {
    type: 'cross',
    lineStyle: {
      type: 'dashed',
      width: 0.5,
    },
    label: {
      precision: 0,
      fontSize: 10,
    },
  },
  textStyle: {
    fontSize: 12,
  },
  extraCssText: 'z-index: 9;',
}
export default class TestOption extends MyEChartsOption {
  /**
   * 构造函数名称
   * fix bug: 修复在uni-app打包时，视图层的this.constructor.name和逻辑层this.constructor.name不一致情况
   * 导致无法在renderjs层重新实例化逻辑层的option构造类。
   */
  static name = 'TestOption'

  constructor(data = []) {
    super()
    const total = data.reduce((prev, val) => {
      return prev + val
    }, 0)
    this.option = {
      animation: true,
      tooltip: TOOLTIP_CONF,
      grid: {
        top: '10%',
        bottom: '30%',
        left: '5%',
        right: '15%',
      },
      xAxis: {
        type: 'category',
        data: data.map((val, index) => index),
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          fontSize: 10,
          color: '#999',
          formatter: function (value, index) {
            return value
          },
        },
      },
      yAxis: {
        type: 'value',
        position: 'right',
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: true,
        },
        axisLabel: {
          fontSize: 10,
          color: '#999',
          formatter: function (value, index) {
            return value.toFixed(2)
          },
        },
      },
      dataZoom: [
        {
          textStyle: {
            color: '#999',
          },
          zoomLock: false,
          top: '84%',
          bottom: '5%',
          handleIcon:
            'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
          handleSize: 20,
          handleStyle: {
            color: '#ffc541',
          },
          fillerColor: 'rgba(255,197,65,0.4)',
        },
      ],
      series: [
        {
          type: 'line',
          //symbol: "none",
          smooth: true,
          name: '看多',
          data: data,
          color: '#FE6F5E',
          lineStyle: {
            width: 1,
          },
          label: {
            show: true,
            formatter: function (params) {
              if (total === 0) return '0%'
              return Math.round((params.data / total) * 100) + '%'
            },
          },
        },
        {
          type: 'line',
          //symbol: "none",
          smooth: true,
          name: '看空',
          data: data.map((item) => Math.floor(10 * Math.random())),
          color: '#80CFAA',
          lineStyle: {
            width: 1,
          },
          label: {
            show: true,
          },
        },
      ],
    }
  }
}
