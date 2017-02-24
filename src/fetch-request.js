import 'whatwg-fetch'
import isArray from 'lodash/isArray'
// 注册钩子
let globalConfig = {
  // api地址
  apiHost: '',
  // 参数
  options: {},
  // 头信息
  headers: {},
  // 错误处理
  errHandle() {},
  // 请求前处理
  reqHandle() {},
  // 请求后处理
  respHandle() {}
}

// 将参数转换为queryStr
const toQueryStr = params => {
  const queryStrs = []
  flatPath(params).forEach(({key, value}) => {
    if (typeof value === 'undefined') {
      value = ''
    }
    value = encodeURIComponent(value)
    queryStrs.push(`${key}=${value}`)
  })
  return queryStrs.join('&')
}

/**
 * 递归拉平params
 */
const flatPath = (obj, paths = []) => {
  let values = []
  if (typeof obj === 'object') {
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        const newPaths = [...paths]
        if (isArray(obj)) {
          // 数组情况需要组装成[0]格式
          let lastPath = newPaths.splice(paths.length - 1, 1)
          newPaths.push(`${lastPath}[${p}]`)
        } else {
          newPaths.push(p)
        }
        values = values.concat(flatPath(obj[p], newPaths))
      }
    }
  } else if (paths.length) {
    values.push({
      key: paths.join('.'),
      value: obj
    })
  }
  return values
}

// 内部状态转换
const checkInternalStatus = resp => {
  if (resp.status >= 200 && resp.status < 300) {
    return resp
  } else {
    const error = new Error(resp.statusText)
    error.resp = resp
    throw error
  }
}

// 发送请求
const request = (url, _options = {}) => {
  return new Promise((resolve, reject) => {
    const {apiHost, options, headers, reqHandle, respHandle, errHandle} = globalConfig
    if (!_options.headers) {
      _options.headers = {}
    }
    _options = Object.assign({}, _options, options, {headers})
    url = `${apiHost}${url}`
    reqHandle(url, _options)
    /* eslint-disable no-undef  */
    fetch(url, _options)
    .then(checkInternalStatus)
    .then(resp => resp.json())
    .then(respHandle)
    .then(data => resolve(data))
    .catch(err => {
      if (errHandle) {
        errHandle(String(err))
      }
      reject(err)
    })
  })
}

// post
const post = (url, params = {}) => {
  const queryStr = toQueryStr(params)
  const options = {
    method: 'POST',
    body: queryStr,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  return request(url, options)
}

// get
const get = (url, params = {}) => {
  const queryStr = toQueryStr(params)
  const options = {
    method: 'GET'
  }
  return request(url + '?' + queryStr, options)
}

// put
const put = (url, params = {}) => {
  params['_method'] = 'PUT'
  return post(url, params)
}

// patch
const patch = (url, params = {}) => {
  params['_method'] = 'PATCH'
  return post(url, params)
}

// del
const del = (url, params = {}) => {
  params['_method'] = 'DELETE'
  return post(url, params)
}

// setConfig
const setConfig = config => {
  globalConfig = Object.assign({}, globalConfig, config)
}

export {
  setConfig,
  get,
  post,
  put,
  patch,
  del
}
export default get
