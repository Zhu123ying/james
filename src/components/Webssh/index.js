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
        const { platformContainerId, containerName, handleClose } = this.props
        const url = `wss://172.118.59.90/websocket/execContainer?platformContainerId=${platformContainerId}&containerName=${containerName}`
        this.$websocket = new WebSocket(url)
        this.$websocket.onopen = () => {
            term.onKey(e => {
                const data = {
                    operation: "stdin",
                    data: e.key
                }
                this.$websocket.send(JSON.stringify(data))
                // const ev = e.domEvent
                // const printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey
                // if (ev.keyCode === 13) {
                //     term.prompt()
                //     const data = {
                //         operation: "stdin",
                //         data: this.lineInputValue + '\n'
                //     }
                //     this.$websocket.send(JSON.stringify(data))
                //     // 如果打了退出命令，则直接关闭
                //     if (this.lineInputValue === 'exit') {
                //         term.dispose()
                //         this.$websocket.close()
                //         handleClose && handleClose()
                //     }
                //     this.lineInputValue = ''
                // } else if (ev.keyCode === 8) {
                //     // Do not delete the prompt
                //     if (term._core.buffer.x > 2) {
                //         term.write('\b \b')
                //     }
                //     this.lineInputValue = this.lineInputValue.substr(0, this.lineInputValue.length - 1)
                // } else if (printable) {
                //     term.write(e.key)
                //     this.lineInputValue += e.key
                // }
            })
        }
        this.$websocket.onmessage = (data) => {
            let response = JSON.parse(data.data)
            term.write(response.data)
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

export default Webssh