import React from 'react'
import { Input } from 'huayunui'
import './index.less'
const { TextArea } = Input

class YamlTextArea extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            yamlinfo: ''
        }
    }
    handleOnChange = (key, val) => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            [key]: value
        })
    }
    render() {
        const { yamlinfo } = this.state
        return (
            <TextArea value={yamlinfo} onChange={(val) => this.handleOnChange('yamlinfo', val)} />
        )
    }
}

export default YamlTextArea