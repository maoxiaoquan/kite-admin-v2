import axios from 'axios'
import qs from 'qs'
import { message } from 'antd'

const http = axios.create({
  baseURL: '/api-admin/v1',
  headers: {
    'x-requested-with': 'XMLHttpRequest',
  },
})

/* 稳定背后的代价，是我们在消耗自己未来的可能性。 */

http.interceptors.request.use((config) => {
  if (localStorage.kiteToken) {
    config.headers['x-access-token'] = localStorage.kiteToken || ''
  }
  /* if (config.method === 'post') {
    const data = config.data || {}
    config.data = qs.stringify(data)
  } */
  return config
})

http.interceptors.response.use(
  (response) => {
    const data = response.data
    const win: any = window
    if (data.state === 'nologin') {
      message.warning(data.message)
      win.location.replace('#/sign-in')
      return false
    }

    if (data.state === 'error') {
      message.warning(data.message)
      return Promise.reject(data.message)
    } else {
      return data
    }
  },
  function (error) {
    message.warning('服务器正忙，请稍后重试!')
    return Promise.reject(error.message)
  }
)

export default http
