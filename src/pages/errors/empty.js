import React from 'react'

// 一个空页面，跳转进来后会返回上一个页面，为了实现组件的强制重新挂载刷新
class Empty extends React.Component {
    componentWillMount() {
        window.history.go(-1)
    }

    render() {
        return (<div />)
    }
}

export default Empty