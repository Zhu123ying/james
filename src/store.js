import { combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import ApplicationCenterReducer from './redux'
import { createBrowserHistory } from 'history'
import thunk from 'redux-thunk'
import { routerMiddleware, connectRouter } from 'connected-react-router'
import { applyMiddleware } from '@reduxjs/toolkit'

export const history = createBrowserHistory()

// 创建reducer，router必须有，react-router 与 redux 整合
/* Create root reducer, containing all features of the application */
const rootReducer = combineReducers({
  router: connectRouter(history),
  applicationCenter: ApplicationCenterReducer
})

// 预先定义的状态
const preloadedState = {}

// 初始化store
const store = createStore(
  rootReducer,
  preloadedState,
  composeWithDevTools(applyMiddleware(thunk, routerMiddleware(history)))
)

export default store
