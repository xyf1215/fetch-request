# fetch-request

> 基于fetch封装的ajax组件

## 使用
``````
import {setConfig} from './fetch-request'
setConfig({
  apiHost: 'http://www.baidu.com/',
  options: {
    credentials: 'include'
  },
  headers: {
    Accept: 'application/json'
  },
  errHandle(err) {
    console.log(err)
  },
  reqHandle(url, options) {
    console.log(url, options)
  },
  respHandle(resp) {
    if (resp.errorCode === 200) {
      return resp.data
    } else {
      // 这里处理errorCode为其他的情况
      const error = new Error(resp.errorMessage || '未知错误')
      error.resp = resp
      throw error
    }
  }
})
``````
