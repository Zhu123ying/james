import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import store, { history } from './store'
import { IntlProvider } from 'react-intl'
import { ConnectedRouter } from 'connected-react-router'
import zh from './locales/zh_CN'

export async function bootstrap() {
  console.log('子应用初始化成功')
}

export async function mount(props) {
  console.log('子应用加载成功')

  // 在主应用提供的dom节点下插入子应用index.html定义的节点，保证style顺利加载
  let appDom = document.createElement('div')
  appDom.id = 'childapp'
  document.getElementById(props.container.id).appendChild(appDom)
  ReactDOM.render(
    <React.StrictMode>
      <IntlProvider locale={navigator.language} messages={zh}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <ConfigProvider prefixCls="ult" locale={window.LangCode === 'zh_CN' ? zhCN : en}>
              <App />
            </ConfigProvider>
          </ConnectedRouter>
        </Provider>
      </IntlProvider>
    </React.StrictMode>,
    document.getElementById('childapp')
  )
}
/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  console.log('子应用卸载成功')
  if (document.getElementById('childapp')) {
    ReactDOM.unmountComponentAtNode(document.getElementById('childapp'))
  }
}

export async function update(props) {
  console.log('子应用更新成功')
}

if (!window.__POWERED_BY_QIANKUN__) {
  ReactDOM.render(
    <React.StrictMode>
      <IntlProvider locale={navigator.language} messages={zh}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <App />
          </ConnectedRouter>
        </Provider>
      </IntlProvider>
    </React.StrictMode>,
    document.getElementById('root')
  )
}
