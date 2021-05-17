/** ak CKXbsfREBTNY3fiYPoK5hs0GmFvCG2z8 */
/**
 * 加载百度地图api
 * @param {string} ak 百度地图ak 请使用自己申请ak
 * @returns {Promise<void>}
 */
export function loadBmapApi(ak) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://api.map.baidu.com/api?v=2.0&ak=' + ak + '&callback=bmapload'
    window.bmapload = () => {
      delete window.bmapload
      resolve()
    }
    script.onerror = reject
    document.body.appendChild(script)
  })
}

/**
 * 动态加载js资源
 * @param {string} src js文件地址
 * @returns
 */
export function loadJs(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })
}

/** 加载资源回调函数 id为元素的id */
export default async function loadJsCallback(id) {
  if (!(window.echarts && window.echarts.version)) {
    await loadJs('./static/echarts/echarts.36.min.js')
  }
  /** MapOption组件加载地图相关js */
  if (id === 'MapOption' && !window.BMap) {
    await Promise.all([loadBmapApi('CKXbsfREBTNY3fiYPoK5hs0GmFvCG2z8'), loadJs('./static/echarts/bmap.js')])
  } 
}