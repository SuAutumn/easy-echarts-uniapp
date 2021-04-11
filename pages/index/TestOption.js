import {
  MyEChartsOption
} from '@/components/my-echarts/MyEcharts.js'
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
  constructor() {
    super()
    this.option = {
      ...this.option,
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
        data: [],
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
            return value;
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
          }
        },
      },
      dataZoom: [{
        textStyle: {
          color: '#999',
        },
        zoomLock: false,
        top: '84%',
        bottom: '5%',
        handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
        handleSize: 20,
        handleStyle: {
          color: '#ffc541',
        },
        fillerColor: 'rgba(255,197,65,0.4)',
      },],
      series: [{
        type: 'line',
        //symbol: "none",
        smooth: true,
        name: '看多',
        data: [],
        color: '#FE6F5E',
        lineStyle: {
          width: 1,
        },
        label: {
          show: true,
          formatter: (params) => {
            /** 箭头函数访问option数据 */
            const total = this.option.series[0].data.reduce((prev, val) => {
              return prev + val
            }, 0)
            if (total === 0) return '0%'
            return Math.floor(params.data / total * 100) + '%'
          }
        }
      },
      {
        type: 'line',
        //symbol: "none",
        smooth: true,
        name: '看空',
        data: [],
        color: '#80CFAA',
        lineStyle: {
          width: 1,
        },
        label: {
          show: true
        }
      },
      ],
    }
  }

  /** 更新option */
  update() {
    this.option.xAxis.data = ['周一', '周二', '周三', '周四', '周五', '周六', '周日', '周八']
    this.option.series[0].data = [10, 43, 12, 12, 4, 5, 6, 5]
    this.option.series[1].data = [64, 10, 45, 8, 7, 89, 54, 5, 7]
  }
}
