/* eslint-disable */
import React from 'react'
import { Terminal } from 'xterm'
import 'xterm/css/xterm.css'
import { message } from 'huayunui'
class WebLog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.$websocket = null
    }
    componentDidMount() {
        let term = new Terminal({
            rendererType: "canvas", // 渲染类型
            convertEol: true, // 启用时，光标将设置为下一行的开头
            scrollback: 10, // 终端中的回滚量
            disableStdin: true, // 是否应禁用输入。
            cursorStyle: 'underline', // 光标样式
            cursorBlink: false, // 光标闪烁
            theme: {
                foreground: 'yellow', // 字体
                background: '#060101', // 背景色
                cursor: 'help'// 设置光标
            }
        })
        term.open(document.querySelector('.terminalContainer'))
        if (term._initialized) {
            return
        }
        term._initialized = true
        term.prompt = () => {
            term.write('\r\n ')
        }
        term.writeln('Welcome')
        term.prompt()
        // 建立websocket链接
        const { platformContainerId, containerName } = this.props
        const url = `wss://172.118.59.90/websocket/logsContainer?platformContainerId=${platformContainerId}&containerName=${containerName}&tail=100`
        this.$websocket = new WebSocket(url)
        this.$websocket.onmessage = (data) => {
            data.data && term.writeln(data.data)
        }
        this.$websocket.onerror = (ev) => {
            message.error(ev)
        }
    }
    componentWillUnmount(){
        this.$websocket.close()
    }
    render() {
        return (
            <div className='terminalContainer' />
        )
    }
}

export default WebLog