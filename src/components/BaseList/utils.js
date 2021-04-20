import _ from 'lodash'

// 删除参数值
export const DelQueryString = (url, ref) => {
  let str = ''

  if (url.indexOf('?') !== -1) {
    str = url.substr(url.indexOf('?') + 1)
  } else {
    return url
  }

  let arr = ''
  let returnurl = ''
  let setparam = ''

  if (str.indexOf('&') !== -1) {
    arr = str.split('&')
    for (let i in arr) {
      if (arr[i].split('=')[0] !== ref) {
        returnurl =
          returnurl + arr[i].split('=')[0] + '=' + arr[i].split('=')[1] + '&'
      }
    }
    return (
      url.substr(0, url.indexOf('?')) +
      '?' +
      returnurl.substr(0, returnurl.length - 1)
    )
  } else {
    arr = str.split('=')
    if (arr[0] === ref) {
      return url.substr(0, url.indexOf('?'))
    } else {
      return url
    }
  }
}

export const deleteEmptyKey = params => {
  let target = _.cloneDeep(params)
  Object.keys(target).forEach(key => {
    if (!target[key]) {
      delete target[key]
    }
  })
  return target
}

// params转url
export const formatParamsUrl = params => {
  const target = deleteEmptyKey(params)
  return Object.keys(target)
    .reduce((arr, k) => {
      arr.push(`&${k}${Array.isArray(target[k]) ? '__in' : ''}=${target[k]}`)
      return arr
    }, [])
    .join('')
    .replace('&', '?')
}

// url转params
export const formatUrlParams = params => {
  params = decodeURIComponent(params).replace('?', '')

  if (_.isEmpty(params)) {
    return {}
  }

  const res = params.split('&').reduce((result, str) => {
    const [key, value] = str.split('=')
    return {
      ...result,
      [key]: value
    }
  }, {})

  let target = {}

  Object.keys(res).map(item => {
    // 他是数组
    if (item.includes('__in')) {
      target[item.replace('__in', '')] = res[item].split(',')
    } else {
      target[item] = res[item]
    }
  })

  return target
}
