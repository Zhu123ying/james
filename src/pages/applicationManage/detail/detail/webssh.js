/* eslint-disable */
import React from 'react'
import { Terminal } from 'xterm'
import 'xterm/css/xterm.css'
import { message } from 'huayunui'
class Webssh extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.lineInputValue = '' // 每一行的文本值
        this.$websocket = null
    }
    componentDidMount() {
        let term = new Terminal({
            rendererType: "canvas", // 渲染类型
            convertEol: true, // 启用时，光标将设置为下一行的开头
            scrollback: 2000, // 终端中的回滚量
            disableStdin: true, // 是否应禁用输入。
            cursorStyle: 'underline', // 光标样式
            cursorBlink: true, // 光标闪烁
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
        // 建立websocket链接
        const { namespace, podName, handleClose } = this.props
        const url = `wss://${window.location.host}/websocket/application/container`
        this.$websocket = new WebSocket(url)
        this.$websocket.onopen = () => {
            const validInfo = {
                operate: "connect",
                namespace,
                podName
            }
            this.$websocket.send(JSON.stringify(validInfo))
            term.onKey(e => {
                const data = {
                    operate: "command",
                    command: e.key
                }
                this.$websocket.send(JSON.stringify(data))
            })
        }
        this.$websocket.onmessage = (data) => {
            term.write(data.data)
        }
        this.$websocket.onerror = (ev) => {
            message.error(ev)
        }
    }
    componentWillUnmount() {
        this.$websocket.close()
    }
    render() {
        return (
            <div className='terminalContainer' />
        )
    }
}

export default Webssh