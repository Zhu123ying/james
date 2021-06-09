/* eslint-disable */
import PropTypes from 'prop-types'
import React from 'react'
import { Input, Button } from 'huayunui'
import { Icon } from 'ultraui'
import './index.less'

class EditInputInline extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            inputValue: ''
        }
    }
    handleOnchange = (val = '') => {
        const value = _.get(val, 'target.value', val)
        this.setState({
            inputValue: value
        })
    }
    handleClickError = () => {
        const { handleErrorClick } = this.props
        const { inputValue } = this.state
        handleErrorClick && handleErrorClick(inputValue)
        this.handleOnchange('')
    }
    handleClickCorrect = () => {
        const { handleCorrectClick } = this.props
        const { inputValue } = this.state
        handleCorrectClick && handleCorrectClick(inputValue)
    }
    render() {
        const { submitting } = this.props
        const { inputValue } = this.state
        return (
            <div className='editInputInline'>
                <Input value={inputValue} onChange={this.handleOnchange} />
                <Button
                    size='middle-s'
                    type='default'
                    icon={<Icon type='error' />}
                    onClick={() => this.handleClickError()}
                />
                <Button
                    loading={submitting}
                    disabled={!inputValue}
                    size='middle-s'
                    type='primary'
                    icon={<Icon type='correct' />}
                    onClick={() => this.handleClickCorrect()}
                />
            </div>
        )
    }
}


export default EditInputInline
