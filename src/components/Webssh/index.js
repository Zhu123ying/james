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
        term.open(document.getElementById('Webssh'))
        if (term._initialized) {
            return
        }
        term._initialized = true
        term.prompt = () => {
            term.write('\r\n$ ')
        }
        term.writeln('Welcome')
        term.prompt()
        // 建立websocket链接
        const { platformContainerId, containerName } = this.props
        const url = `wss://172.118.59.90/websocket/execContainer?platformContainerId=${platformContainerId}&containerName=${containerName}`
        const ws = new WebSocket(url)
        ws.onopen = () => {
            term.onKey(e => {
                const ev = e.domEvent
                const printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey
                if (ev.keyCode === 13) {
                    term.prompt()
                    const data = {
                        operation: "stdin",
                        data: this.lineInputValue + '\n'
                    }
                    ws.send(JSON.stringify(data))
                    this.lineInputValue = ''
                } else if (ev.keyCode === 8) {
                    // Do not delete the prompt
                    if (term._core.buffer.x > 2) {
                        term.write('\b \b')
                    }
                    this.lineInputValue = this.lineInputValue.substr(0, this.lineInputValue.length - 1)
                } else if (printable) {
                    term.write(e.key)
                    this.lineInputValue += e.key
                }
            })
        }
        ws.onmessage = (data) => {
            let response = JSON.parse(data.data)
            term.writeln(response.data)
        }
        ws.onerror = (ev) => {
            message.error(ev)
        }
    }
    render() {
        return (
            <div id='Webssh' />
        )
    }
}

export default Webssh