/* eslint-disable */
/**
 * 将请求参数转为query params
 */
 const _ = window._

 export const queryParams = function (params) {
     if (!params) { return '' }
     return Object.keys(params)
         .sort()
         .filter(key => {
             const val = _.trim(params[key])
             return !_.isEmpty(val)
         })
         .map(key => `${key}=${_.trim(params[key])}`)
         .join('&')
 }
 /**
  * 将请求参数字符串转为对象 query params to object
  */
 export const queryParamsToObject = (params = '') => {
     params = params.replace('?', '')
     if (_.isEmpty(params)) {
         return {}
     }
     return params.split('&').reduce((result, str) => {
         const [key, value] = str.split('=')
         return {
             ...result,
             [key]: value
         }
     }, {})
 }
 /**
  * 将请求参对象数转为字符串 query object to params
  */
 export const queryObjectToParams = (data = {}) => {
     return Object.keys(data).reduce((arr, k) => {
         arr.push(`&${k}=${data[k]}`)
         return arr
     }, []).join('').replace('&', '?')
 }
 
 export const getHash = () => {
     return location.hash.replace('#', '')
 }
 
 /**
  * 获取指定path
  */
 export const getPath = (num) => {
     let _arr = window.location.pathname.split('/')
     let _str = []
     _arr.map((item, index) => {
         if (index <= num) {
             _str.push(item)
         }
     })
     _str = _str.join('/')
     return _str
 }
 
 /**
  没有参数的时候queryParamsToObject会返回{'':undefined}
  */
 export const addAdvancedSearchQueryToUrl = (data = {}) => {
     let query = queryParamsToObject(location.search)
     // 过滤值为undefined的属性
     let newQuery = Object.assign({}, query, data)
     Object.keys(newQuery).forEach(key => {
         if ((newQuery[key] === undefined) || (key === '')) {
             delete newQuery[key]
         }
     })
     window.history.pushState(null, null, location.origin + location.pathname + queryObjectToParams(newQuery))
 }
 
 // 获取url对应的参数值
 export const GetQueryString = (name = '') => {
     let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
     let r = window.location.search.substr(1).match(reg)
     if (r != null) {
         return decodeURI(r[2])
     }
     return null
 }
 
 // 检测地址栏是否有高级搜索参数
 export const checkHasAdvsearchQuery = (options = {}) => {
     let data = options, f = true
     Object.keys(data).forEach((key) => {
         if (GetQueryString(data[key].key)) {
             f = false
         }
     })
     return f
 }
 
 // 检测地址栏是否有高级搜索参数
 export const getCloudEnvBasePath = (commonQuery = ['env', 'logicalZoneId']) => {
     let obj = {}
     commonQuery.forEach(key => {
         obj[key] = GetQueryString(key)
     })
     return location.pathname + queryObjectToParams(obj)
 }
 
 // 获取所有的菜单路由
 export const getMenuPath = (menus, menuPath = []) => {
     menus.map((item) => {
         menuPath.push(item.path)
         if (!_.isEmpty(item.subMenus)) {
             getMenuPath(item.subMenus, menuPath)
         }
     })
     return menuPath
 }
 
 // 删除参数值
 export const DelQueryString = (url, ref) => {
     let str = ""
 
     if (url.indexOf('?') !== -1) {
         str = url.substr(url.indexOf('?') + 1)
     } else {
         return url
     }
 
     let arr = ""
     let returnurl = ""
     let setparam = ""
 
     if (str.indexOf('&') !== -1) {
         arr = str.split('&')
         for (let i in arr) {
             if (arr[i].split('=')[0] !== ref) {
                 returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&"
             }
         }
         return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1)
     } else {
         arr = str.split('=')
         if (arr[0] === ref) {
             return url.substr(0, url.indexOf('?'))
         } else {
             return url
         }
     }
 }
 /**
  * 获取url查询参数
  */
 export const getQueryParams = (url, options = ['env', 'availableZoneId']) => {
     let str = ""
 
     if (url.indexOf('?') !== -1) {
         str = url.substr(url.indexOf('?') + 1)
     } else {
         return url
     }
 
     let arr = ""
     let returnurl = ""
 
     if (str.indexOf('&') !== -1) {
         arr = str.split('&')
         for (let i in arr) {
             if (options.includes(arr[i].split('=')[0])) {
                 returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&"
             }
         }
         return "?" + returnurl.substr(0, returnurl.length - 1)
     } else {
         arr = str.split('=')
         if (!options.includes(arr[0])) {
             return ""
         } else {
             return "?" + str
         }
     }
 }
 
 const parseType = (data) => {
     if (data === 'true') {
         return true
     }
     if (data === 'false') {
         return false
     }
     if (!_.isNaN(+data)) {
         return data
     }
     try {
         return JSON.parse(data)
     } catch (e) {
         return data
     }
 }
 const stringify = (data) => {
     if (_.isString(data)) {
         return data
     } else {
         return JSON.stringify(data)
     }
 }
 
 export const parseSearchToObject = (searchStr) => {
     return decodeURI(searchStr).replace('?', '').split('&').map(item => item.split('=')).reduce((prev, curr) => {
         return {
             ...prev,
             [curr[0]]: parseType(curr[1])
         }
     }, {})
 }
 
 export const parseObjectToSearch = (obj) => {
     return `?${Object.entries(obj).map(([key, val]) => `${key}=${stringify(val)}`).join('&')}`
 }
 