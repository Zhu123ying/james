/* eslint-disable */
import React from 'react'
import { Terminal } from 'xterm'
import 'xterm/css/xterm.css'
import keypair from '~/pages/advancedComponents/archer/compute/keypair/list/archer/keypair'
class AppStore extends React.Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    let term = new Terminal({
      rendererType: "canvas", // 渲染类型
      convertEol: true, // 启用时，光标将设置为下一行的开头
      scrollback: 10, // 终端中的回滚量
      disableStdin: false, // 是否应禁用输入。
      cursorStyle: 'underline', // 光标样式
      cursorBlink: true, // 光标闪烁
      theme: {
        foreground: 'yellow', // 字体
        background: '#060101', // 背景色
        cursor: 'help'// 设置光标
      }
    })
    term.open(document.getElementById('testWebsocket'))
    term.onData((data) => {
      ws.send(`{"operate":"command","command":${JSON.stringify(data)}}`)
    })

    const ws = new WebSocket(`ws://10.51.30.180:8001/application/v1/webssh`)
    ws.onopen = () => {
      ws.send(`{"operate":"connect","namespace":"kube-system","podName":"calico-node-2rs6f","username":"root","password":""}`)
    }
    ws.onmessage = (data) => {
      term.writeln(data.data)
    }
    ws.onclose = (ev) => {
      console.log('close')
    }
    ws.onerror = (ev) => {
      console.log('error')
    }
  }
  render() {
    return (
      <div id='testWebsocket' />
    )
  }
}

export default AppStore