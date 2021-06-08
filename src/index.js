import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import store, { history } from './store'
import { IntlProvider } from 'react-intl'
import { ConnectedRouter } from 'connected-react-router'
import huayun_zhCN from './locales/zh_CN'
import ant_zhCN from 'antd/lib/locale/zh_CN'
import ant_en from 'antd/lib/locale/en_US'
import { ConfigProvider } from 'huayunui'
import { ConfigProvider as AntdConfigProvider } from 'antd'
import 'huayunui/dist/index.css'
import '~/css/common.less'
import '~/css/newstyle.less'
import '~/css/create.less'
import { getUserPermission } from '~/redux/actions'
import language from '~/locales'
import _ from 'lodash'
window._ = _
window.LangCode = 'zh_CN'
window.LanguageData = language
ConfigProvider.config({
  prefixCls: 'archer'
})
export async function bootstrap() {
  console.log('子应用初始化成功')
}

export async function mount(props) {
  const { permission } = props
  console.log(props)
  // getUserPermission(permission) // 设置用户权限
  // 在主应用提供的dom节点下插入子应用index.html定义的节点，保证style顺利加载
  ReactDOM.render(
    <React.StrictMode>
      <IntlProvider locale={navigator.language} messages={huayun_zhCN}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <ConfigProvider prefixCls="archer" locale={ant_zhCN}>
              <AntdConfigProvider prefixCls="archer" locale={ant_zhCN}>
                <App />
              </AntdConfigProvider>
            </ConfigProvider>
          </ConnectedRouter>
        </Provider>
      </IntlProvider>
    </React.StrictMode>,
    document.getElementById('applicationCenterRoot')
  )
}
/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  console.log('子应用卸载成功')
  if (document.getElementById('applicationCenterRoot')) {
    ReactDOM.unmountComponentAtNode(document.getElementById('applicationCenterRoot'))
  }
}

export async function update(props) {
  console.log('子应用更新成功')
}

if (!window.__POWERED_BY_QIANKUN__) {
  ReactDOM.render(
    <React.StrictMode>
      <IntlProvider locale={navigator.language} messages={huayun_zhCN}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <ConfigProvider prefixCls="archer" locale={ant_zhCN}>
              <AntdConfigProvider prefixCls="archer" locale={ant_zhCN}>
                <App />
              </AntdConfigProvider>
            </ConfigProvider>
          </ConnectedRouter>
        </Provider>
      </IntlProvider>
    </React.StrictMode>,
    document.getElementById('applicationCenterRoot')
  )
}
