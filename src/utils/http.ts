import axios from 'axios'

const http = axios.create({
  baseURL: 'https://127.0.0.1:3000',
  timeout: 10000
})

// 请求拦截器
http.interceptors.request.use(config => {
  // 可以在这里添加token等
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
http.interceptors.response.use(response => {
  return response.data
}, error => {
  return Promise.reject(error)
})

// 取消请求功能
const CancelToken = axios.CancelToken
const cancelMap = new Map()

http.interceptors.request.use(config => {
  const source = CancelToken.source()
  config.cancelToken = source.token

  // 存储取消函数
  const url = config.url || ''
  if (cancelMap.has(url)) {
    cancelMap.get(url)('取消重复请求')
  }
  cancelMap.set(url, source.cancel)

  return config
})

http.interceptors.response.use(response => {
  const url = response.config?.url || ''
  cancelMap.delete(url)
  return response
}, error => {
  if (axios.isCancel(error)) {
    console.log('请求已取消:', error.message)
  }
  return Promise.reject(error)
})

export default http