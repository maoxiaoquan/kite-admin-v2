import axios from 'axios'
import qs from 'qs'
import { message } from 'antd';

const http = axios.create({
  baseURL: '/api-admin/v1',
  headers: {
    'x-requested-with': 'XMLHttpRequest'
  }
})

/* 稳定背后的代价，是我们在消耗自己未来的可能性。 */

http.interceptors.request.use(config => {
  if (localStorage.box_tokens) {
    config.headers['x-access-token'] = localStorage.box_tokens
  }
  /* if (config.method === 'post') {
    const data = config.data || {}
    config.data = qs.stringify(data)
  } */
  return config
})

http.interceptors.response.use(
  response => {
    const data = response.data

    if (!data.is_login) {
      message.warning(data.message);
      // windows.location.replace('#/sign_in')
      return false
    }

    if (data.state === 'error') {
      message.warning(data.message)
      return Promise.reject(new Error(data.message))
    } else {
      return data.data
    }
  },
  function (error) {
    console.warn(error)
    message.warning('服务器正忙，请稍后重试!')
    return Promise.reject(new Error('服务器正忙!'))
  }
)

export default http
