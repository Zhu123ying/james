import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { actionTypes, selectors } from '../../redux/counter'
import { Panel } from 'ultraui'
import HuayunRequest from 'http/request'
import testApi from 'http/api'

const Home = (props) => {
  const count = useSelector(selectors.getCountValue)
  const dispatch = useDispatch()

  const testHttpRequest = () => {
    HuayunRequest(
      testApi.getSite,
      null,
      {
        success: (res) => {
          console.log('各个组件自定义的接口成功处理函数')
        },
        fail: (error) => {
          console.log('各个组件自定义的接口失败处理函数:' + error)
        }
      }
    )
  }

  return (
    <Panel
      style={{ padding: '0 16px', margin: 0, minHeight: 'calc(100vh - 202px)' }}
    >
      <h1 style={{fontSize: '32px'}}>
        使用huayun-cli创建的qiankun微前端子应用，关于qiankun微前端可以参考<a href='https://qiankun.umijs.org/zh' target='_blank' rel="noreferrer">https://qiankun.umijs.org/zh</a>
      </h1>
      <br />
      <div style={{height: '200px', width: '500px', padding: '16px', border: '1px solid'}}>
        <h1 style={{fontSize: '24px'}}>redux使用示例：</h1>
        <br />
        <h1>
          Counter: <strong>{count}</strong>
        </h1>
        <p>
          通过点击增加减少按钮，了解redux的使用
        </p>
        <br />
        <div style={{display: 'flex', justifyContent: 'space-between', width: '160px'}}>
          <button
            type="button"
            onClick={() => dispatch({ type: actionTypes.DECREMENT_COUNTER })}
          >
            decrement
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: actionTypes.INCREMENT_COUNTER })}
          >
            increment
          </button>
        </div>
      </div>
      <div style={{height: '200px', width: '500px', padding: '16px', border: '1px solid', marginTop: '16px'}}>
        <h1 style={{fontSize: '24px'}}>request使用示例：</h1>
        <br />
        <button
            type="button"
            onClick={testHttpRequest}
        >
          发起请求
        </button>
        <p style={{marginTop: '16px'}}>查看控制台了解request的执行情况</p>
      </div>
    </Panel>
  )
}

export default Home